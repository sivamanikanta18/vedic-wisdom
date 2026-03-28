import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { templesAPI } from '../utils/api';
import './TempleDetail.css';

function TempleDetail() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [devotees, setDevotees] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTempleData();
  }, [id]);

  const fetchTempleData = async () => {
    try {
      setLoading(true);
      const [templeRes, devoteesRes, statsRes] = await Promise.all([
        templesAPI.getById(id),
        templesAPI.getDevotees(id),
        templesAPI.getStatistics(id)
      ]);

      if (templeRes.success) setTemple(templeRes.temple);
      if (devoteesRes.success) setDevotees(devoteesRes.devotees);
      if (statsRes.success) setStatistics(statsRes.statistics);
    } catch (err) {
      setError('Failed to load temple details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="temple-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading temple details...</p>
        </div>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="temple-detail-page">
        <div className="error-container">
          <p>{error || 'Temple not found'}</p>
          <Link to="/temples" className="back-btn">← Back to Temples</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="temple-detail-page">
      {/* Header */}
      <div className="temple-header">
        <Link to="/temples" className="back-link">← Back to Temples</Link>
        <h1>{temple.name}</h1>
        <p className="location">📍 {temple.city}, {temple.state}</p>
      </div>

      {/* Tabs */}
      <div className="temple-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'programs' ? 'active' : ''}
          onClick={() => setActiveTab('programs')}
        >
          Programs ({temple.programs?.length || 0})
        </button>
        <button 
          className={activeTab === 'devotees' ? 'active' : ''}
          onClick={() => setActiveTab('devotees')}
        >
          Devotees ({temple.devoteesCount || 0})
        </button>
        <button 
          className={activeTab === 'leadership' ? 'active' : ''}
          onClick={() => setActiveTab('leadership')}
        >
          Leadership
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {temple.description && (
              <div className="section">
                <h3>About</h3>
                <p>{temple.description}</p>
              </div>
            )}

            <div className="section">
              <h3>Contact Information</h3>
              <div className="contact-grid">
                {temple.contact?.phone && (
                  <div className="contact-item">
                    <span>📞</span>
                    <span>{temple.contact.phone}</span>
                  </div>
                )}
                {temple.contact?.email && (
                  <div className="contact-item">
                    <span>✉️</span>
                    <span>{temple.contact.email}</span>
                  </div>
                )}
                {temple.contact?.website && (
                  <div className="contact-item">
                    <span>🌐</span>
                    <a href={temple.contact.website} target="_blank" rel="noopener noreferrer">
                      {temple.contact.website}
                    </a>
                  </div>
                )}
                <div className="contact-item">
                  <span>📍</span>
                  <span>{temple.address}</span>
                </div>
              </div>
            </div>

            {statistics && (
              <div className="section">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-number">{statistics.totalDevotees || 0}</span>
                    <span className="stat-label">Total Devotees</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{statistics.initiatedDevotees || 0}</span>
                    <span className="stat-label">Initiated</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{statistics.firstInitiation || 0}</span>
                    <span className="stat-label">First Initiation</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{statistics.secondInitiation || 0}</span>
                    <span className="stat-label">Second Initiation</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{statistics.guides || 0}</span>
                    <span className="stat-label">Guides</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{statistics.students || 0}</span>
                    <span className="stat-label">Students</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="programs-tab">
            {temple.programs && temple.programs.length > 0 ? (
              <div className="programs-list">
                {temple.programs.map((program, index) => (
                  <div key={index} className="program-card">
                    <h4>{program.name}</h4>
                    {program.schedule && <p className="schedule">⏰ {program.schedule}</p>}
                    {program.description && <p className="description">{program.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No programs listed yet.</p>
            )}
          </div>
        )}

        {activeTab === 'devotees' && (
          <div className="devotees-tab">
            {devotees.length > 0 ? (
              <div className="devotees-table-container">
                <table className="devotees-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Spiritual Name</th>
                      <th>Initiation</th>
                      <th>Service</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devotees.map(devotee => (
                      <tr key={devotee._id}>
                        <td>{devotee.name}</td>
                        <td>{devotee.spiritualName || '-'}</td>
                        <td>
                          <span className={`badge ${devotee.initiationStatus}`}>
                            {devotee.initiationStatus}
                          </span>
                        </td>
                        <td>{devotee.serviceRoles?.join(', ') || '-'}</td>
                        <td>{new Date(devotee.joinDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No devotees registered yet.</p>
            )}
          </div>
        )}

        {activeTab === 'leadership' && (
          <div className="leadership-tab">
            {temple.leadership && temple.leadership.length > 0 ? (
              <div className="leadership-grid">
                {temple.leadership.map((leader, index) => (
                  <div key={index} className="leader-card">
                    <div className="leader-avatar">👤</div>
                    <h4>{leader.name}</h4>
                    <p className="role">{leader.role}</p>
                    {leader.contact && <p className="contact">📞 {leader.contact}</p>}
                    {leader.email && <p className="contact">✉️ {leader.email}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No leadership information available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TempleDetail;
