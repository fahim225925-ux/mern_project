import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Edit3, Trash2, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      setErrorMessage('Could not load events. Check if backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await axios.delete(`http://localhost:5000/api/events/${id}`);
      if (res.data.success) {
        setEvents((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert('Error deleting event. Please try again.');
      console.error(err);
    }
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return 'N/A';
    return new Date(rawDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Registrations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live overview of all scheduled events and registered attendees
          </p>
        </div>
      </div>

      {errorMessage && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      <div className="panel-card">
        {loading ? (
          <div className="empty-box">Loading registry records...</div>
        ) : events.length === 0 ? (
          <div className="empty-box">
            <p>No events found in database.</p>
            <Link to="/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Venue</th>
                  <th>Total Registrations</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <span className="event-code-badge">{event.eventCode || event._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td>
                      <strong>{event.title}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.summary}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#94a3b8" />
                        {formatDate(event.scheduledDate)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#94a3b8" />
                        {event.location}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color="#38bdf8" />
                        <span className="attendee-badge">{event.attendeeCount || 0}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/edit/${event._id}`} className="btn btn-edit" title="Edit Event">
                          <Edit3 size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          className="btn btn-delete"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}