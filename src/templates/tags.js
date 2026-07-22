import React from 'react'
import { Helmet } from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const tag = this.props.pageContext.tag
    const title = this.props.data.site.siteMetadata.title
    const totalCount = this.props.data.allMarkdownRemark.totalCount
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? '' : 's'
    } tagged with "${tag}"`

    return (
      <Layout>
        <Helmet title={`${tag} | ${title}`} />

        {/* Page Banner */}
        <div className="page-banner">
          <h1 className="page-banner-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#FF9900' }}>#</span>{tag}
          </h1>
          <p className="page-banner-subtitle">{tagHeader}</p>
        </div>

        {/* Post List */}
        <section className="section" style={{ paddingBottom: '4rem' }}>
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-8">

                  {posts.map((post, index) => (
                    <Link
                      key={post.node.fields.slug}
                      to={post.node.fields.slug}
                      style={{
                        display: 'block',
                        padding: '1.25rem 0',
                        borderBottom: index < posts.length - 1 ? '1px solid #f0f0f0' : 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#232F3E',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease, padding-left 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FF9900'
                        e.currentTarget.style.paddingLeft = '0.5rem'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#232F3E'
                        e.currentTarget.style.paddingLeft = '0'
                      }}
                    >
                      {post.node.frontmatter.title}
                    </Link>
                  ))}

                  <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                    <Link to="/tags/" className="tag-pill">
                      ← Browse all topics
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

export default TagRoute

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`