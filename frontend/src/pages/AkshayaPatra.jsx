import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kitchensAPI } from '../utils/api';
import './AkshayaPatra.css';

function AkshayaPatra() {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      setLoading(true);
      const response = await kitchensAPI.getAll();
      if (response.success) {
        setKitchens(response.kitchens);
        if (response.kitchens.length > 0) {
          setSelectedKitchen(response.kitchens[0]);
          fetchKitchenStats(response.kitchens[0]._id);
        }
      }
    } catch (err) {
      setError('Failed to load kitchen data');
    } finally {
      setLoading(false);
    }
  };

  const fetchKitchenStats = async (id) => {
    try {
      const response = await kitchensAPI.getStatistics(id);
      if (response.success) {
        setStats(response.statistics);
      }
    } catch (err) {
      console.error('Failed to load statistics');
    }
  };

  const handleKitchenChange = (kitchen) => {
    setSelectedKitchen(kitchen);
    fetchKitchenStats(kitchen._id);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="akshaya-patra-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Akshaya Patra data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="akshaya-patra-page">
      <div className="ap-header">
        <h1>🍽️ Akshaya Patra</h1>
        <p className="subtitle">Midday meal distribution for school children</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Kitchen Selector */}
      {kitchens.length > 0 && (
        <div className="kitchen-selector">
          <label>Select Kitchen:</label>
          <div className="kitchen-buttons">
            {kitchens.map(kitchen => (
              <button
                key={kitchen._id}
                className={selectedKitchen?._id === kitchen._id ? 'active' : ''}
                onClick={() => handleKitchenChange(kitchen)}
              >
                {kitchen.city}, {kitchen.state}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedKitchen && (
        <>
          {/* Overview Cards */}
          <div className="stats-overview">
            <div className="stat-card-large">
              <div className="stat-icon">🍲</div>
              <div className="stat-content">
                <span className="stat-number-large">
                  {formatNumber(stats?.total?.totalMealsServed || 0)}
                </span>
                <span className="stat-label-large">Total Meals Served</span>
              </div>
            </div>
            <div className="stat-card-large">
              <div className="stat-icon">🏫</div>
              <div className="stat-content">
                <span className="stat-number-large">
                  {stats?.total?.totalSchoolsSupported || 0}
                </span>
                <span className="stat-label-large">Schools Supported</span>
              </div>
            </div>
            <div className="stat-card-large">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <span className="stat-number-large">
                  {stats?.last30Days?.mealsServed ? formatNumber(stats.last30Days.mealsServed) : 0}
                </span>
                <span className="stat-label-large">Meals (Last 30 Days)</span>
              </div>
            </div>
            <div className="stat-card-large">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-number-large">
                  {stats?.last30Days?.averageDailyMeals || 0}
                </span>
                <span className="stat-label-large">Avg Daily Meals</span>
              </div>
            </div>
          </div>

          {/* Kitchen Details */}
          <div className="kitchen-details">
            <div className="detail-section">
              <h3>Kitchen Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Location:</span>
                  <span className="value">{selectedKitchen.city}, {selectedKitchen.state}</span>
                </div>
                <div className="info-item">
                  <span className="label">Capacity:</span>
                  <span className="value">{formatNumber(selectedKitchen.capacity?.mealsPerDay || 0)} meals/day</span>
                </div>
                <div className="info-item">
                  <span className="label">Schools:</span>
                  <span className="value">{selectedKitchen.capacity?.schoolsSupported || 0} supported</span>
                </div>
                <div className="info-item">
                  <span className="label">Students Fed:</span>
                  <span className="value">{formatNumber(selectedKitchen.capacity?.studentsFed || 0)}</span>
                </div>
              </div>
              {selectedKitchen.temple && (
                <div className="temple-link">
                  <span>Associated Temple:</span>
                  <Link to={`/temples/${selectedKitchen.temple._id}`}>
                    {selectedKitchen.temple.name}
                  </Link>
                </div>
              )}
            </div>

            {selectedKitchen.contact?.manager && (
              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="contact-grid">
                  <p><strong>Manager:</strong> {selectedKitchen.contact.manager}</p>
                  {selectedKitchen.contact.phone && <p>📞 {selectedKitchen.contact.phone}</p>}
                  {selectedKitchen.contact.email && <p>✉️ {selectedKitchen.contact.email}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Impact Statement */}
          <div className="impact-section">
            <h3>🙏 Making a Difference</h3>
            <p>
              The Akshaya Patra Foundation, in partnership with HKM temples across India, 
              serves nutritious midday meals to school children, ensuring no child goes hungry 
              and every child can focus on education. Your support helps us reach more children 
              and create a nourished, educated generation.
            </p>
          </div>
        </>
      )}

      {!loading && kitchens.length === 0 && (
        <div className="no-data">
          <p>No Akshaya Patra kitchen data available.</p>
        </div>
      )}
    </div>
  );
}

export default AkshayaPatra;
