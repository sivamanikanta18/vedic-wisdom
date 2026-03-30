import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, guideAPI } from '../utils/api';
import './GuideStudents.css';

function GuideStudents() {
  const [guide, setGuide] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      setLoading(true);
      // Get current user's profile (guide)
      const response = await authAPI.getProfile();
      if (response.success) {
        const currentGuide = response.user;
        setGuide(currentGuide);
        
        // Fetch students for this guide
        if (currentGuide._id) {
          const studentsResponse = await guideAPI.getStudents(currentGuide._id);
          if (studentsResponse.success) {
            setStudents(studentsResponse.students || []);
          }
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

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query))
    );
  });

  const loadUnassignedStudents = async () => {
    try {
      setAssignLoading(true);
      const response = await guideAPI.getUnassignedStudents();
      if (response.success) {
        setUnassignedStudents(response.students || []);
      }
    } catch (err) {
      console.error('Error loading unassigned students:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignStudent = async (studentId) => {
    if (!guide?._id) return;
    
    try {
      setAssignLoading(true);
      const response = await guideAPI.assignStudent(guide._id, studentId);
      if (response.success) {
        await loadGuideData();
        setShowAssignModal(false);
        alert('Student assigned successfully!');
      }
    } catch (err) {
      alert('Error assigning student: ' + err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  const openAssignModal = () => {
    loadUnassignedStudents();
    setShowAssignModal(true);
  };

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
          <span className="stat-number">{students.filter(s => s.stats?.activeDays > 0).length}</span>
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
          <button onClick={openAssignModal} className="action-card assign-btn">
            <span className="action-title">Assign Student</span>
            <span className="action-desc">Add a new student to your guidance</span>
          </button>
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

      {/* Assign Student Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Student</h3>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {assignLoading ? (
                <div className="loading">Loading available students...</div>
              ) : unassignedStudents.length === 0 ? (
                <div className="no-students">
                  <p>No unassigned students available.</p>
                  <p>All students are already assigned to guides.</p>
                </div>
              ) : (
                <div className="unassigned-list">
                  <p className="modal-info">Select a student to assign to your guidance:</p>
                  {unassignedStudents.map(student => (
                    <div key={student.id} className="unassigned-item">
                      <div className="student-info">
                        <span className="student-name">{student.name || 'N/A'}</span>
                        <span className="student-email">{student.email}</span>
                      </div>
                      <button 
                        className="assign-btn-small"
                        onClick={() => handleAssignStudent(student.id)}
                        disabled={assignLoading}
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuideStudents;
