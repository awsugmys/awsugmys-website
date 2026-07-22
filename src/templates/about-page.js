import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import ContactForm from '../components/ContactForm'
import {
  IconCalendar,
  IconLinkedIn,
  IconTwitterX,
  IconFacebook,
  IconMail,
  IconMic,
} from '../components/Icons'

const CONNECT_ICONS = {
  meetup: IconCalendar,
  linkedin: IconLinkedIn,
  twitter: IconTwitterX,
  facebook: IconFacebook,
}

const initialsOf = (name) => {
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const AboutPageTemplate = ({
  title,
  content,
  contentComponent,
  connect,
  team,
  contactEmail,
  speakerFormUrl,
}) => {
  const PageContent = contentComponent || Content

  return (
    <div>
      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">{title}</h1>
        <p className="page-banner-subtitle">Learn about our mission, team, and how to get involved</p>
      </div>

      {/* Mission + Connect */}
      <section className="section" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-9">
                <div className="about-intro">
                  <img
                    className="about-intro-mascot"
                    src="/img/White-Purple-Mascot.png"
                    alt="AWS User Group Mysuru"
                  />
                  <div className="about-intro-text">
                    <PageContent className="content" content={content} />
                  </div>
                </div>

                {connect && connect.length > 0 && (
                  <div className="connect-row">
                    {connect.map((item) => {
                      const IconComp = CONNECT_ICONS[item.icon] || IconCalendar
                      return (
                        <a
                          key={item.label}
                          className="social-pill"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconComp /> {item.label}
                        </a>
                      )
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      {team && team.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="about-section-heading">Leadership Team</h2>
            <p className="about-section-subheading">The organisers behind AWS User Group Mysuru</p>
            <div className="columns is-centered">
              <div className="column is-9">
                <div className="team-grid">
                  {team.map((person) => (
                    <div className="team-card" key={person.name}>
                      <div className="team-avatar">{initialsOf(person.name)}</div>
                      <p className="team-name">{person.name}</p>
                      <p className="team-role">{person.role}</p>
                      <a
                        className="team-link"
                        href={person.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${person.name} on LinkedIn`}
                      >
                        <IconLinkedIn />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Get in touch */}
      <section className="section section-light" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <h2 className="about-section-heading">Get in Touch</h2>
          <p className="about-section-subheading">Questions, ideas, or want to get more involved?</p>
          <div className="columns is-centered">
            <div className="column is-9">
              <div className="contact-grid">
                <div className="contact-tile">
                  <div className="contact-tile-icon"><IconMail /></div>
                  <p className="contact-tile-title">Email us</p>
                  <p className="contact-tile-text">Have a question or want to partner with us? Drop us a line anytime.</p>
                  <a className="contact-tile-link" href={`mailto:${contactEmail}`}>{contactEmail} →</a>
                </div>
                <div className="contact-tile">
                  <div className="contact-tile-icon"><IconMic /></div>
                  <p className="contact-tile-title">Speak at an event</p>
                  <p className="contact-tile-text">Got something worth sharing with the community? We'd love to have you on stage.</p>
                  <a className="contact-tile-link" href={speakerFormUrl} target="_blank" rel="noopener noreferrer">Fill the speaker form →</a>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  connect: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
  })),
  team: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    url: PropTypes.string,
  })),
  contactEmail: PropTypes.string,
  speakerFormUrl: PropTypes.string,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
        connect={post.frontmatter.connect}
        team={post.frontmatter.team}
        contactEmail={post.frontmatter.contactEmail}
        speakerFormUrl={post.frontmatter.speakerFormUrl}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        connect {
          label
          icon
          url
        }
        team {
          name
          role
          url
        }
        contactEmail
        speakerFormUrl
      }
    }
  }
`
