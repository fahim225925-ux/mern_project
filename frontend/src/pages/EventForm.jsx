import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Calendar, MapPin, AlignLeft, Type, Users } from 'lucide-react';

export default function EventForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    scheduledDate: '',
    location: '',
    attendeeCount: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchCurrentEvent = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/events/${id}`);
          if (res.data.success) {
            const data = res.data.data;
            setFormData({
              title: data.title || '',
              summary: data.summary || '',
              scheduledDate: data.scheduledDate ? data.scheduledDate.substring(0, 10) : '',
              location: data.location || '',
              attendeeCount: data.attendeeCount || 0
            });
          }
        } catch (err) {
          setError('Failed to fetch event data.');
          console.error(err);
        }
      };
      fetchCurrentEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/events/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/events', formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event. Check backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Event Details' : 'Register New Event'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {isEditMode ? 'Update event parameters and venue schedule' : 'Fill out details to publish a new event'}
          </p>
        </div>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="panel-card">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label htmlFor="title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Type size={14} /> Event Name
              </span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="form-input"
              placeholder="e.g. Annual Tech Symposium 2026"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="summary">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <AlignLeft size={14} /> Event Description
              </span>
            </label>
            <textarea
              id="summary"
              name="summary"
              required
              className="form-textarea"
              placeholder="Brief overview of agenda and topics..."
              value={formData.summary}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-field">
              <label htmlFor="scheduledDate">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Event Date
                </span>
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                required
                className="form-input"
                value={formData.scheduledDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="location">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Venue
                </span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="form-input"
                placeholder="e.g. Auditorium Hall B"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="attendeeCount">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Total Registrations (Initial Count)
              </span>
            </label>
            <input
              type="number"
              id="attendeeCount"
              name="attendeeCount"
              min="0"
              className="form-input"
              value={formData.attendeeCount}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              <Save size={16} />
              {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}