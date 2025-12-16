import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/awsugmys-logo.png'

const Navbar = () => (
  <nav className="navbar is-transparent">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <figure className="image">
            <img src={logo} alt="awsugmys" style={{ width: '100px' , maxHeight:'100%' }} />
          </figure>
        </Link>
      </div>
      <div className="navbar-start">
        <Link className="navbar-item" to="/about">
          About
        </Link>
        <a
          className="navbar-item"
          href="https://meetup.com/awsugmys/"
          target="_blank"
          rel="noopener noreferrer"
          >Join</a>
      </div>
      <div className="navbar-end">
        <a
          className="navbar-item"
          href="https://github.com/awsugmys/awsugmys-website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <img src={github} alt="Github" style={{ width: '150px' }} />
          </span>
        </a>
      </div>
    </div>
  </nav>
)

export default Navbar