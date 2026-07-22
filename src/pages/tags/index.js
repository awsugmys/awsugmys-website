import React from 'react'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import { IconHash } from '../../components/Icons'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => {
  const sortedTags = [...group].sort((a, b) => b.totalCount - a.totalCount)

  return (
    <Layout>
      <Helmet title={`Topics | ${title}`} />

      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">Topics</h1>
        <p className="page-banner-subtitle">Browse all {group.length} topics covered by AWS UG Mysuru</p>
      </div>

      {/* Topic Grid */}
      <section className="section section-light">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              <div className="topic-grid">
                {sortedTags.map((tag) => (
                  <Link
                    className="topic-card"
                    to={`/tags/${kebabCase(tag.fieldValue)}/`}
                    key={tag.fieldValue}
                  >
                    <span className="topic-card-icon"><IconHash /></span>
                    <span className="topic-card-name">{tag.fieldValue}</span>
                    <span className="topic-card-count">{tag.totalCount} post{tag.totalCount === 1 ? '' : 's'}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
