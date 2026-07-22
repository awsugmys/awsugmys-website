import React, { useState } from 'react'
import { IconMail } from './Icons'

const ContactForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your interest! We will contact you soon. For immediate updates, please join our social media channels.')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="contact-card">
      <h4 className="contact-card-heading" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#232F3E', marginBottom: '0.35rem' }}>
        <IconMail /> Get Notified About Our Events
      </h4>
      <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
        Leave your email and we'll keep you posted on upcoming AWS User Group Mysuru events.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="email" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: '0.35rem' }}>Email Address</label>
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
          <label className="label" htmlFor="message" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: '0.35rem' }}>Message (Optional)</label>
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
        
        <div className="field" style={{ marginTop: '1.5rem' }}>
          <div className="control">
            <button className="button is-primary is-medium" type="submit">
              Notify Me About Events
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactForm