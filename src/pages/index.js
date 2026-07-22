import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import { IconCloud, IconBook, IconUsers, IconRocket } from '../components/Icons'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
        {/* ===== HERO SECTION ===== */}
        <section className="hero is-large hero-aws">
          {/* Mysuru Palace — translucent line-art watermark */}
          <img
            src="/img/mysuru-palace.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-82%',
              left: 0,
              width: '100%',
              opacity: 0.15,
              filter: 'invert(1)',
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'block',
            }}
          />
          <div className="hero-body">
            <div className="container has-text-centered" style={{ position: 'relative', zIndex: 2 }}>
              <p className="hero-badge">
                <IconCloud /> AWS USER GROUP MYSURU
              </p>
              <h1 className="hero-heading">
                Empowering the{' '}
                <span className="highlight">Cloud Community</span>
                <br />in Mysuru
              </h1>
              <p className="hero-subtitle-text">
                Join developers, architects, and tech enthusiasts to learn, share, and network around Amazon Web Services.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://meetup.com/awsugmys/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-primary"
                >
                  Join Upcoming Events
                </a>
                <Link to="/about" className="hero-btn-secondary">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS STRIP ===== */}
        <section className="stats-strip">
          <div className="container">
            <div className="columns is-mobile is-multiline is-gapless">
              <div className="column is-4-tablet is-4-mobile">
                <div className="stat-item">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Events Hosted</div>
                </div>
              </div>
              <div className="column is-4-tablet is-4-mobile">
                <div className="stat-item">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Community Members</div>
                </div>
              </div>
              <div className="column is-4-tablet is-4-mobile">
                <div className="stat-item">
                  <div className="stat-number">6+</div>
                  <div className="stat-label">Core Organizers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CORE PILLARS ===== */}
        <section className="section section-light">
          <div className="container">
            <div className="has-text-centered" style={{ marginBottom: '3.5rem' }}>
              <h2 className="section-heading">Our Core Pillars</h2>
              <p className="section-subheading">What drives us as a community</p>
            </div>
            <div className="columns is-variable is-6">
              <div className="column is-4">
                <div className="pillar-card">
                  <div className="pillar-icon-wrap"><IconBook /></div>
                  <h3 className="pillar-title">Learn</h3>
                  <p className="pillar-text">
                    Deep dive into AWS services, architectures, and best practices with expert-led sessions and technical talks.
                  </p>
                </div>
              </div>
              <div className="column is-4">
                <div className="pillar-card">
                  <div className="pillar-icon-wrap"><IconUsers /></div>
                  <h3 className="pillar-title">Network</h3>
                  <p className="pillar-text">
                    Connect with local cloud professionals, recruiters, and fellow developers in the Mysuru tech ecosystem.
                  </p>
                </div>
              </div>
              <div className="column is-4">
                <div className="pillar-card">
                  <div className="pillar-icon-wrap"><IconRocket /></div>
                  <h3 className="pillar-title">Build</h3>
                  <p className="pillar-text">
                    Participate in hands-on workshops, architecture reviews, and hackathons to apply what you learn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LATEST STORIES & EVENTS ===== */}
        <section className="section section-white">
          <div className="container">
            <div className="has-text-centered" style={{ marginBottom: '3.5rem' }}>
              <h2 className="section-heading">Latest Stories & Events</h2>
              <p className="section-subheading">Catch up on our recent meetups and announcements</p>
            </div>
            <div className="columns is-multiline is-variable is-5">
              {posts && posts.length > 0 ? (
                posts.map(({ node: post }) => (
                  <div className="column is-4" key={post.id}>
                    <div className="event-card">
                      <div className="event-card-body">
                        <p className="event-card-date">{post.frontmatter.date}</p>
                        <p className="event-card-title">
                          <Link to={post.fields.slug}>
                            {post.frontmatter.title}
                          </Link>
                        </p>
                        <p className="event-card-excerpt">{post.excerpt}</p>
                      </div>
                      <div className="event-card-footer">
                        <Link to={post.fields.slug}>
                          Keep Reading →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="column is-12 has-text-centered">
                  <p style={{ color: '#999' }}>Welcome to AWS User Group Mysuru! Check back soon for our latest updates and events.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section style={{
          background: 'linear-gradient(135deg, #232F3E 0%, #1a2332 100%)',
          padding: '5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div className="container">
            <h2 style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              Ready to join the community?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}>
              Whether you're just starting with AWS or you're a seasoned architect, there's a place for you here.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://meetup.com/awsugmys/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-primary"
              >
                Join on Meetup
              </a>
              <a
                href="https://forms.gle/uMkLMM4uJtVZ4iY3A"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-secondary"
              >
                Speak at an Event
              </a>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }}
    ) {
      edges {
        node {
          excerpt(pruneLength: 150)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`