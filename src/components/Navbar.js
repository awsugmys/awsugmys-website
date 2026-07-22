import React, { useState } from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../../logos/White-Purple-Mascot.png'

const Navbar = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <nav className="navbar aws-navbar is-fixed-top" role="navigation" aria-label="main-navigation">
      <div className="container">
        {/* ── Brand: far left ── */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" title="AWS UG Mysuru Home" style={{ gap: '0.5rem' }}>
            <img src={logo} alt="AWS UG Mysuru" style={{ maxHeight: '4rem' }} />
            <span style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              background: 'linear-gradient(90deg, #ffffff, #FF9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}>
              AWS UG Mysuru
            </span>
          </Link>
          <button
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded={isActive}
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        {/* ── Menu: nav links + buttons all on the RIGHT ── */}
        <div id="navMenu" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
          {/* Empty navbar-start so menu content is pushed right */}
          <div className="navbar-start"></div>

          {/* Everything on the right side */}
          <div className="navbar-end" style={{ alignItems: 'center' }}>
            {/* Nav links */}
            <Link className="navbar-item" to="/" activeClassName="is-active">
              Home
            </Link>
            <Link className="navbar-item" to="/about" activeClassName="is-active" partiallyActive={true}>
              About
            </Link>
            <Link className="navbar-item" to="/tags" activeClassName="is-active" partiallyActive={true}>
              Topics
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '1.5rem', background: 'rgba(255,255,255,0.15)', margin: '0 0.5rem' }} />

            {/* CTA buttons */}
            <div className="navbar-item" style={{ gap: '0.5rem' }}>
              <a
                className="hero-btn-primary"
                href="https://meetup.com/awsugmys/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.5em 1.15em',
                  borderRadius: '6px',
                  boxShadow: 'none',
                }}
              >
                Join Meetup
              </a>
              <a
                href="https://github.com/awsugmys/awsugmys-website"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '6px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <img src={github} alt="Github" style={{ width: '1.1rem', height: '1.1rem', filter: 'invert(1)', display: 'block' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar