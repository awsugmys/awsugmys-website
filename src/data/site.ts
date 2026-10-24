// Site-wide facts. Social/community links live in src/content/links/links.json.
export const SITE = {
  name: 'AWS User Group Mysuru',
  shortName: 'AWS UG Mysuru',
  handle: 'awsugmys',
  url: 'https://awsugmys.in',
  description:
    'AWS User Group Mysuru is a community of AWS developers, solution architects, DevOps engineers, students and cloud enthusiasts who meet in Mysuru to learn, share and network.',
  tagline: 'Namma Mysuru, Namma Cloud',
  email: 'awsugmys@gmail.com',
  speakerFormUrl: 'https://forms.gle/uMkLMM4uJtVZ4iY3A',
  meetupUrl: 'https://www.meetup.com/awsugmys/',
  linkedinUrl: 'https://www.linkedin.com/company/awsugmys',
  repoUrl: 'https://github.com/awsugmys/awsugmys-website',
  locale: 'en_IN',
  timezone: 'Asia/Kolkata',
} as const;

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/events/', label: 'Events' },
  { href: '/blog/', label: 'Blog' },
  { href: '/student-builders/', label: 'Student Builders' },
  { href: '/collaborations/', label: 'Collaborations' },
  { href: '/get-involved/', label: 'Get Involved' },
] as const;
