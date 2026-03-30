import React, { useState, useEffect } from 'react';
import './FolkEvents.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vedic-wisdom-eight.vercel.app/api';

const folkEventsAPI = {
  getUpcomingEvents: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events/folk/upcoming`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  
  rsvpToEvent: async (eventId, status) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

function FolkEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvping, setRsvping] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await folkEventsAPI.getUpcomingEvents();
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId, status) => {
    setRsvping(eventId);
    try {
      const res = await folkEventsAPI.rsvpToEvent(eventId, status);
      if (res.success) {
        loadEvents(); // Refresh to show updated RSVP
      } else {
        alert(res.message || 'Failed to RSVP');
      }
    } catch (err) {
      alert('Error updating RSVP');
    } finally {
      setRsvping(null);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'TBD';
    return new Date(d).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRSVPBadge = (status) => {
    if (!status) return <span className="rsvp-badge pending">Not Responded</span>;
    if (status === 'yes') return <span className="rsvp-badge going">Going</span>;
    if (status === 'no') return <span className="rsvp-badge not-going">Not Going</span>;
    if (status === 'maybe') return <span className="rsvp-badge maybe">Maybe</span>;
  };

  if (loading) {
    return (
      <div className="folk-events">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="folk-events">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <p>RSVP to events organized by your guides</p>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No upcoming events at this time.</p>
          <p>Check back later for new events!</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-info">
                <h3>{event.title}</h3>
                <p className="event-organizer">By: {event.createdBy?.name || 'Guide'}</p>
                <p className="event-datetime">{formatDate(event.startAt)}</p>
                <p className="event-location">{event.location || 'Location TBD'}</p>
                {event.description && <p className="event-desc">{event.description}</p>}
                <div className="rsvp-status">
                  Your response: {getRSVPBadge(event.userRSVP)}
                </div>
              </div>
              
              <div className="rsvp-actions">
                <button 
                  className={`rsvp-btn yes ${event.userRSVP === 'yes' ? 'active' : ''}`}
                  onClick={() => handleRSVP(event._id, 'yes')}
                  disabled={rsvping === event._id}
                >
                  {rsvping === event._id ? '...' : 'Yes, Going'}
                </button>
                <button 
                  className={`rsvp-btn maybe ${event.userRSVP === 'maybe' ? 'active' : ''}`}
                  onClick={() => handleRSVP(event._id, 'maybe')}
                  disabled={rsvping === event._id}
                >
                  Maybe
                </button>
                <button 
                  className={`rsvp-btn no ${event.userRSVP === 'no' ? 'active' : ''}`}
                  onClick={() => handleRSVP(event._id, 'no')}
                  disabled={rsvping === event._id}
                >
                  Can't Go
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FolkEvents;
