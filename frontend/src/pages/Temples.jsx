import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templesAPI } from '../utils/api';
import './Temples.css';

function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      const response = await templesAPI.getAll();
      if (response.success) {
        setTemples(response.temples);
      }
    } catch (err) {
      setError('Failed to load temples');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="temples-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading temples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="temples-page">
      <div className="temples-header">
        <h1>HKM Temples</h1>
        <p className="subtitle">Find Hare Krishna temples across India</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="temples-grid">
        {filteredTemples.map(temple => (
          <div key={temple._id} className="temple-card">
            <div className="temple-image">
              {temple.images && temple.images[0] ? (
                <img src={temple.images[0]} alt={temple.name} />
              ) : (
                <div className="temple-placeholder">
                  <span>🛕</span>
                </div>
              )}
            </div>
            <div className="temple-info">
              <h3>{temple.name}</h3>
              <p className="location">
                <span>📍</span> {temple.city}, {temple.state}
              </p>
              <div className="temple-stats">
                <span>Devotees: {temple.statistics?.totalDevotees || 0}</span>
                <span>Programs: {temple.programs?.length || 0}</span>
              </div>
              <Link to={`/temples/${temple._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTemples.length === 0 && !loading && (
        <div className="no-results">
          <p>No temples found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default Temples;
