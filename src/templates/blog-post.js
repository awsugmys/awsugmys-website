import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  date,
  helmet,
}) => {
  const PostContent = contentComponent || Content

  return (
    <div>
      {helmet || ''}

      {/* Page Banner */}
      <div className="page-banner">
        {date && (
          <p style={{
            color: '#FF9900',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            {date}
          </p>
        )}
        <h1 className="page-banner-title">{title}</h1>
      </div>

      {/* Article Content */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">

                {description && (
                  <div style={{
                    borderLeft: '4px solid #FF9900',
                    paddingLeft: '1.5rem',
                    marginBottom: '2.5rem',
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                  }}>
                    <p style={{
                      fontSize: '1.1rem',
                      color: '#555',
                      lineHeight: 1.75,
                      fontStyle: 'italic',
                      margin: 0,
                    }}>
                      {description}
                    </p>
                  </div>
                )}
                <PostContent className="content" content={content} />
                {tags && tags.length ? (
                  <div style={{ 
                    marginTop: '3rem', 
                    paddingTop: '2rem', 
                    borderTop: '1px solid #eee',
                  }}>
                    <p style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: 700, 
                      color: '#999', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em', 
                      marginBottom: '1rem',
                    }}>
                      Topics
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {tags.map(tag => (
                        <Link className="tag-pill" to={`/tags/${kebabCase(tag)}/`} key={tag + `tag`}>
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Back link */}
                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f5f5f5' }}>
                  <Link
                    to="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#007EB9',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    ← Back to all stories
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        date={post.frontmatter.date}
        helmet={
          <Helmet titleTemplate="%s | AWS UG Mysuru">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`