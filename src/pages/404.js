import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'

const NotFoundPage = () => (
  <Layout>
    <div className="page-banner">
      <h1 className="page-banner-title">Page Not Found</h1>
    </div>
    <section className="section">
      <div className="container">
        <div className="not-found-page">
          <div>
            <div className="not-found-code">404</div>
            <h2 className="not-found-title">Oops! This page doesn't exist.</h2>
            <p className="not-found-text">
              The page you're looking for may have been moved or doesn't exist yet. Let's get you back on track.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="hero-btn-primary" style={{ fontSize: '0.95rem' }}>
                ← Back to Home
              </Link>
              <Link to="/about" className="hero-btn-secondary is-dark" style={{ fontSize: '0.95rem' }}>
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage