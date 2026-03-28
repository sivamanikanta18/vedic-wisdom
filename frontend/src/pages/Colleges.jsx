import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collegesAPI } from '../utils/api';
import './Colleges.css';

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemple, setFilterTemple] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await collegesAPI.getAll();
      if (response.success) {
        setColleges(response.colleges);
      }
    } catch (err) {
      setError('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemple = !filterTemple || college.temple?._id === filterTemple;
    return matchesSearch && matchesTemple;
  });

  // Get unique temples for filter
  const temples = [...new Set(colleges.map(c => c.temple).filter(Boolean))];

  if (loading) {
    return (
      <div className="colleges-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="colleges-page">
      <div className="colleges-header">
        <h1>College Outreach Programs</h1>
        <p className="subtitle">HKM spiritual programs in colleges across India</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search colleges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterTemple} 
          onChange={(e) => setFilterTemple(e.target.value)}
          className="filter-select"
        >
          <option value="">All Temples</option>
          {temples.map(temple => (
            <option key={temple._id} value={temple._id}>{temple.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="colleges-grid">
        {filteredColleges.map(college => (
          <div key={college._id} className="college-card">
            <div className="college-header">
              <h3>{college.name}</h3>
              <span className="location">📍 {college.city}, {college.state}</span>
            </div>
            
            <div className="college-info">
              {college.temple && (
                <p className="temple-link">
                  🛕 <Link to={`/temples/${college.temple._id}`}>{college.temple.name}</Link>
                </p>
              )}
              
              {college.assignedGuide && (
                <p className="guide-info">
                  👤 Guide: {college.assignedGuide.spiritualName || college.assignedGuide.name}
                </p>
              )}
              
              <div className="stats-row">
                <span className="stat">
                  <strong>{college.statistics?.totalStudents || 0}</strong> Students
                </span>
                <span className="stat">
                  <strong>{college.programs?.length || 0}</strong> Programs
                </span>
              </div>
            </div>

            {college.programs && college.programs.length > 0 && (
              <div className="programs-preview">
                <h4>Active Programs</h4>
                <ul>
                  {college.programs.slice(0, 3).map((program, idx) => (
                    <li key={idx}>{program.name}</li>
                  ))}
                  {college.programs.length > 3 && (
                    <li className="more">+{college.programs.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            <Link to={`/colleges/${college._id}`} className="view-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {filteredColleges.length === 0 && !loading && (
        <div className="no-results">
          <p>No colleges found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default Colleges;
