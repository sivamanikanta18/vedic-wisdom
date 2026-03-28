import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, adminAPI } from '../utils/api';
import './GuideStudents.css';

function GuideStudents() {
  const [guide, setGuide] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      setLoading(true);
      // Get current user's profile (guide)
      const response = await authAPI.getProfile();
      if (response.success) {
        setGuide(response.user);
        // If guide has students array, load their details
        if (response.user.students && response.user.students.length > 0) {
          // For now, we'll just store the student IDs
          // In a real implementation, you'd fetch student details
          setStudents(response.user.students);
        }
      } else {
        setError('Failed to load guide data');
      }
    } catch (err) {
      setError('Error loading data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (studentEmail) => {
    // This would be implemented to assign a student to this guide
    alert('Student assignment feature - to be implemented');
  };

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="guide-students-page">
        <div className="loading">Loading your students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guide-students-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="guide-students-page">
      <div className="guide-header">
        <h1>My Students</h1>
        <p>Manage and track your assigned students</p>
        {guide && (
          <div className="guide-info">
            <span className="guide-name">Guide: {guide.name}</span>
            <span className="student-count">Students: {students.length}</span>
          </div>
        )}
      </div>

      <div className="students-stats">
        <div className="stat-box total">
          <span className="stat-number">{students.length}</span>
          <span className="stat-label">Total Students</span>
        </div>
        <div className="stat-box active">
          <span className="stat-number">{students.filter(s => s.isActive).length}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-box new">
          <span className="stat-number">{students.filter(s => !s.initiationStatus || s.initiationStatus === 'none').length}</span>
          <span className="stat-label">Not Initiated</span>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="clear-search"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
        )}
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <h3>No Students Assigned Yet</h3>
          <p>You don't have any students assigned to you yet.</p>
          <p>Contact an administrator to have students assigned to your guidance.</p>
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-results">No students found matching "{searchQuery}"</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id || index}>
                    <td>{student.name || 'N/A'}</td>
                    <td>{student.email || 'N/A'}</td>
                    <td>{student.joinDate ? new Date(student.joinDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${student.initiationStatus || 'none'}`}>
                        {student.initiationStatus === 'none' && 'Not Initiated'}
                        {student.initiationStatus === 'first' && 'First Initiation'}
                        {student.initiationStatus === 'second' && 'Second Initiation'}
                        {!student.initiationStatus && 'Not Initiated'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/dashboard?student=${student.id}`} className="view-progress-btn">
                        View Progress
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="guide-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/colleges" className="action-card">
            <span className="action-title">Colleges</span>
            <span className="action-desc">View all colleges and students</span>
          </Link>
          <Link to="/community" className="action-card">
            <span className="action-title">Community</span>
            <span className="action-desc">Engage with the community</span>
          </Link>
          <Link to="/temples" className="action-card">
            <span className="action-title">Temples</span>
            <span className="action-desc">Find temples and events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuideStudents;
