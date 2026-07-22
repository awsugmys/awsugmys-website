import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql, Link } from "gatsby"

import Navbar from '../components/Navbar'
import { IconCloud } from '../components/Icons'
import './all.sass'

const TemplateWrapper = ({ children }) => {
  const data = useStaticQuery(graphql`
    query HeadingQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Helmet>
        <html lang="en" />
        <title>{data.site.siteMetadata.title}</title>
        <meta name="description" content={data.site.siteMetadata.description} />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16" />

        <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#FF9900" />
        <meta name="theme-color" content="#232F3E" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={data.site.siteMetadata.title} />
        <meta property="og:url" content="/" />
        <meta property="og:image" content="/img/og-image.jpg" />
      </Helmet>
      
      <Navbar />
      
      {/* Spacer for fixed navbar — matches .aws-navbar's min-height (3.5rem, border-box includes the border) */}
      <div style={{ height: '3.5rem' }}></div>
      
      <div style={{ flex: 1 }}>{children}</div>
      
      {/* Footer */}
      <footer className="aws-footer">
        <div className="container">
          <div className="columns is-multiline">
            {/* Brand Column */}
            <div className="column is-5-desktop is-12-tablet">
              <p className="footer-brand">
                <IconCloud /> AWS UG Mysuru
              </p>
              <p className="footer-tagline">
                An independent community of AWS enthusiasts in Mysuru, India. We learn, share, and build together.
              </p>
            </div>

            {/* Community Links */}
            <div className="column is-2-desktop is-4-tablet is-offset-1-desktop">
              <p className="footer-heading">Community</p>
              <ul className="footer-link-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/tags">Topics</Link></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="column is-2-desktop is-4-tablet">
              <p className="footer-heading">Connect</p>
              <ul className="footer-link-list">
                <li><a href="https://meetup.com/awsugmys/" target="_blank" rel="noopener noreferrer">Meetup</a></li>
                <li><a href="https://www.linkedin.com/company/awsugmys" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://www.twitter.com/awsugmys" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
                <li><a href="https://www.facebook.com/awsugmys/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="column is-2-desktop is-4-tablet">
              <p className="footer-heading">Resources</p>
              <ul className="footer-link-list">
                <li><a href="https://github.com/awsugmys/awsugmys-website" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://forms.gle/uMkLMM4uJtVZ4iY3A" target="_blank" rel="noopener noreferrer">Speak at an Event</a></li>
                <li><a href="mailto:info@awsugmys.in">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {currentYear} AWS User Group Mysuru · Built with <IconCloud /> by the community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TemplateWrapper