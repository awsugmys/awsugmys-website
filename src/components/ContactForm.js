import React, { useState } from 'react'

const ContactForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, we'll just show an alert. Later this can be connected to a backend service
    alert('Thank you for your interest! We will contact you soon. For immediate updates, please join our social media channels.')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="contact-form" style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h4>Get Notified About Our Events</h4>
      <p>Leave your email and we'll notify you about upcoming AWS User Group Mysuru events!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="email">Email Address</label>
          <div className="control">
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label" htmlFor="message">Message (Optional)</label>
          <div className="control">
            <textarea
              className="textarea"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your AWS interests or questions..."
              rows="3"
            />
          </div>
        </div>
        
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Notify Me About Events
            </button>
          </div>
        </div>
      </form>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>For immediate updates:</strong></p>
        <ul>
          <li>Join our <a href="https://www.meetup.com/awsugmys/" target="_blank" rel="noopener noreferrer">Meetup group</a></li>
          <li>Follow us on <a href="https://www.linkedin.com/company/awsugmys" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li>Follow us on <a href="https://www.twitter.com/awsugmys" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        </ul>
      </div>
    </div>
  )
}

export default ContactForm