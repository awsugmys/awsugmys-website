// Imports events from the AWS UG Mysuru Meetup iCal feed into the `events`
// content collection (src/content/events/*.json), so the site's events list
// stays current. Runs in the daily deploy workflow and can be run by hand:
//   npm run import:meetup
//
// De-duplication: each imported file carries `meetupId` (the iCal UID). On a
// re-run, an existing file with the same id is merged in place; new events
// create a new file. Hand-authored events (no `meetupId`) are never touched.
//
// Merge semantics: the feed owns only the fields it originally provided
// (`title`, date/times, `format`, feed `description`, `registrationUrl`). Any
// field you add or change by hand (`speakers`, `featuredimage`, `venue`,
// `slidesUrl`, an edited `description`, etc.) is preserved. The script tracks
// what it last wrote in `_meetupSync` so it can tell a feed update apart from
// your manual edit and never overwrites the latter.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ICAL_URL = 'https://www.meetup.com/awsugmys/events/ical/';
const OUT_DIR = 'src/content/events';
const DESCRIPTION_MAX = 280;

/* ---------- iCal parsing ---------- */

// Unfold folded lines (continuation lines begin with a space or tab).
function unfold(text) {
  return text.replace(/\r?\n[ \t]/g, '');
}

// Un-escape iCal TEXT values (\\n, \\,, \\;, \\\\).
function unescapeText(v) {
  return v
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

// Split a VEVENT block into { PROP: value, params: {...} } entries.
function parseEvent(block) {
  const out = {};
  for (const line of block.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const left = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const [name, ...paramParts] = left.split(';');
    const params = Object.fromEntries(
      paramParts.map((p) => {
        const [k, v] = p.split('=');
        return [k.toUpperCase(), v];
      }),
    );
    out[name.toUpperCase()] = { value, params };
  }
  return out;
}

function getEventBlocks(ical) {
  const blocks = [];
  const re = /BEGIN:VEVENT\r?\n([\s\S]*?)\r?\nEND:VEVENT/g;
  let m;
  while ((m = re.exec(ical))) blocks.push(m[1]);
  return blocks;
}

// '20261031T170000' (local to TZID Asia/Kolkata) -> { date, time }.
// We treat the feed's Asia/Kolkata times as the site's IST, matching the
// events schema (date: YYYY-MM-DD, startTime/endTime: HH:MM).
function parseDateTime(prop) {
  if (!prop) return {};
  const v = prop.value;
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return {};
  const [, y, mo, d, hh, mm] = m;
  return {
    date: `${y}-${mo}-${d}`,
    time: hh !== undefined ? `${hh}:${mm}` : undefined,
  };
}

// First paragraph of the description, markdown stripped, capped in length.
function cleanDescription(raw) {
  if (!raw) return '';
  let text = unescapeText(raw);
  // Drop a leading 'AWS User Group, Mysuru' banner line the feed prepends.
  text = text.replace(/^AWS User Group[^\n]*\n+/i, '');
  const firstPara = text
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  const plain = firstPara
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/[*_`#>]/g, '')
    .trim();
  if (plain.length <= DESCRIPTION_MAX) return plain;
  return plain.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '') + '…';
}

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/* ---------- Mapping ---------- */

// Fields the feed owns. Only these can be auto-updated, and only when the
// file's current value still matches what the script last wrote.
const FEED_FIELDS = [
  'title',
  'date',
  'endDate',
  'startTime',
  'endTime',
  'format',
  'description',
  'registrationUrl',
];

// Build the feed's view of an event from a parsed VEVENT.
function feedView(ev) {
  const start = parseDateTime(ev.DTSTART);
  const end = parseDateTime(ev.DTEND);
  const title = ev.SUMMARY
    ? unescapeText(ev.SUMMARY.value).trim()
    : 'Untitled event';
  const description = cleanDescription(ev.DESCRIPTION?.value);
  const url = ev.URL?.value?.trim();
  const location = ev.LOCATION ? unescapeText(ev.LOCATION.value).trim() : '';
  const online = !location || /online/i.test(location);

  const view = {
    title,
    date: start.date,
    format: online ? 'online' : 'in-person',
    description,
    meetupId: ev.UID.value.trim(),
  };
  if (end.date && end.date !== start.date) view.endDate = end.date;
  if (start.time) view.startTime = start.time;
  if (end.time) view.endTime = end.time;
  if (url) view.registrationUrl = url;
  if (!online)
    view.venue = {
      name: location,
      city: location.split(',').pop().trim() || location,
    };
  return view;
}

// Create the JSON for a brand-new event: the feed view plus a sync snapshot.
function newRecord(view) {
  const sync = {};
  for (const f of FEED_FIELDS) if (view[f] !== undefined) sync[f] = view[f];
  return { ...view, _meetupSync: sync };
}

// Merge the feed view into an existing record. A feed field is updated only
// when the file still holds the value the script last wrote (no hand edit) and
// the feed now differs. Returns { record, changed }.
function mergeRecord(existing, view) {
  const record = { ...existing };
  const lastSync = existing._meetupSync ?? {};
  const nextSync = {};
  let changed = false;

  for (const f of FEED_FIELDS) {
    const feedVal = view[f];
    const lastVal = lastSync[f];
    const currentVal = existing[f];
    const edited =
      currentVal !== undefined &&
      JSON.stringify(currentVal) !== JSON.stringify(lastVal);

    if (edited) {
      // Hand-edited: keep the manual value, stop tracking this field.
      if (currentVal !== undefined) record[f] = currentVal;
    } else if (feedVal !== undefined) {
      if (JSON.stringify(currentVal) !== JSON.stringify(feedVal)) {
        record[f] = feedVal;
        changed = true;
      }
      nextSync[f] = feedVal;
    } else if (currentVal !== undefined) {
      // Feed dropped this field; leave the existing value untouched.
    }
  }

  record.meetupId = view.meetupId;
  record._meetupSync = nextSync;
  if (JSON.stringify(existing._meetupSync ?? {}) !== JSON.stringify(nextSync))
    changed = true;
  return { record, changed };
}

// Order keys so files stay stable/diff-friendly, with _meetupSync last.
function orderKeys(record) {
  const ORDER = [
    'title',
    'date',
    'endDate',
    'startTime',
    'endTime',
    'format',
    'venue',
    'speakers',
    'description',
    'note',
    'registrationUrl',
    'alternateUrl',
    'slidesUrl',
    'materialsUrl',
    'recordingUrl',
    'blogPost',
    'placeholder',
    'meetupId',
  ];
  const out = {};
  for (const k of ORDER) if (record[k] !== undefined) out[k] = record[k];
  for (const k of Object.keys(record))
    if (!(k in out) && k !== '_meetupSync') out[k] = record[k];
  if (record._meetupSync) out._meetupSync = record._meetupSync;
  return out;
}

/* ---------- File reconciliation ---------- */

async function existingByMeetupId() {
  const map = new Map();
  if (!existsSync(OUT_DIR)) return map;
  for (const file of await readdir(OUT_DIR)) {
    if (!file.endsWith('.json')) continue;
    try {
      const data = JSON.parse(await readFile(join(OUT_DIR, file), 'utf8'));
      if (data.meetupId) map.set(data.meetupId, file);
    } catch {
      /* ignore unreadable/non-JSON files */
    }
  }
  return map;
}

/* ---------- Main ---------- */

async function main() {
  const res = await fetch(ICAL_URL, {
    headers: { 'User-Agent': 'awsugmys-website/import' },
  });
  if (!res.ok) throw new Error(`Meetup iCal fetch failed: HTTP ${res.status}`);
  const ical = unfold(await res.text());

  const blocks = getEventBlocks(ical);
  if (blocks.length === 0) {
    console.log('No events in the feed; nothing to import.');
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const existing = await existingByMeetupId();

  let created = 0;
  let updated = 0;
  for (const block of blocks) {
    const ev = parseEvent(block);
    if (!ev.UID || !ev.DTSTART) continue;
    const view = feedView(ev);
    const id = view.meetupId;

    if (existing.has(id)) {
      const filename = existing.get(id);
      const path = join(OUT_DIR, filename);
      const current = JSON.parse(await readFile(path, 'utf8'));
      const { record, changed } = mergeRecord(current, view);
      if (changed) {
        await writeFile(
          path,
          JSON.stringify(orderKeys(record), null, 2) + '\n',
        );
        updated++;
        console.log(`updated ${filename}`);
      }
    } else {
      const filename = `${view.date}-${slugify(view.title)}.json`;
      const path = join(OUT_DIR, filename);
      await writeFile(
        path,
        JSON.stringify(orderKeys(newRecord(view)), null, 2) + '\n',
      );
      created++;
      console.log(`created ${filename}`);
    }
  }

  console.log(
    `Done. ${blocks.length} event(s) in feed · ${created} created · ${updated} updated.`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
