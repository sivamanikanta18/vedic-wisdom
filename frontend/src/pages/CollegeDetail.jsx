import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collegesAPI } from '../utils/api';
import './CollegeDetail.css';

function CollegeDetail() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchCollegeData();
  }, [id]);

  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      const [collegeRes, studentsRes] = await Promise.all([
        collegesAPI.getById(id),
        collegesAPI.getStudents(id)
      ]);

      if (collegeRes.success) setCollege(collegeRes.college);
      if (studentsRes.success) setStudents(studentsRes.students);
    } catch (err) {
      setError('Failed to load college details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="college-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="college-detail-page">
        <div className="error-container">
          <p>{error || 'College not found'}</p>
          <Link to="/colleges" className="back-btn">← Back to Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="college-detail-page">
      <div className="college-header">
        <Link to="/colleges" className="back-link">← Back to Colleges</Link>
        <h1>{college.name}</h1>
        <p className="location">📍 {college.city}, {college.state}</p>
      </div>

      <div className="college-tabs">
        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
          Information
        </button>
        <button className={activeTab === 'programs' ? 'active' : ''} onClick={() => setActiveTab('programs')}>
          Programs ({college.programs?.length || 0})
        </button>
        <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
          Students ({students.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <div className="section">
              <h3>About</h3>
              <p>{college.address}</p>
            </div>

            {college.temple && (
              <div className="section">
                <h3>Associated Temple</h3>
                <div className="temple-card-mini">
                  <h4>{college.temple.name}</h4>
                  <p>{college.temple.city}, {college.temple.state}</p>
                  <Link to={`/temples/${college.temple._id}`}>View Temple →</Link>
                </div>
              </div>
            )}

            {college.assignedGuide && (
              <div className="section">
                <h3>Assigned Guide</h3>
                <div className="guide-card">
                  <div className="guide-avatar">👤</div>
                  <div className="guide-info">
                    <h4>{college.assignedGuide.spiritualName || college.assignedGuide.name}</h4>
                    <p>Guide for this college outreach program</p>
                  </div>
                </div>
              </div>
            )}

            {college.contactPerson && (
              <div className="section">
                <h3>Contact Person</h3>
                <div className="contact-info">
                  <p><strong>{college.contactPerson.name}</strong></p>
                  {college.contactPerson.designation && <p>{college.contactPerson.designation}</p>}
                  {college.contactPerson.phone && <p>📞 {college.contactPerson.phone}</p>}
                  {college.contactPerson.email && <p>✉️ {college.contactPerson.email}</p>}
                </div>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{college.statistics?.totalStudents || 0}</span>
                <span className="stat-label">Total Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{college.statistics?.activeStudents || 0}</span>
                <span className="stat-label">Active Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{college.programs?.length || 0}</span>
                <span className="stat-label">Programs</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="programs-tab">
            {college.programs && college.programs.length > 0 ? (
              <div className="programs-list">
                {college.programs.map((program, index) => (
                  <div key={index} className="program-card-detailed">
                    <div className="program-header">
                      <h4>{program.name}</h4>
                      {program.isActive !== false && <span className="active-badge">Active</span>}
                    </div>
                    {program.schedule && (
                      <div className="schedule-info">
                        {program.schedule.day && <p>📅 {program.schedule.day}</p>}
                        {program.schedule.time && <p>⏰ {program.schedule.time}</p>}
                        {program.schedule.venue && <p>📍 {program.schedule.venue}</p>}
                      </div>
                    )}
                    {program.description && <p className="description">{program.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No programs available.</p>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-tab">
            {students.length > 0 ? (
              <div className="students-grid">
                {students.map(student => (
                  <div key={student._id} className="student-card">
                    <div className="student-avatar">
                      {student.spiritualName ? student.spiritualName[0] : student.name[0]}
                    </div>
                    <div className="student-info">
                      <h4>{student.spiritualName || student.name}</h4>
                      <p className="legal-name">{student.name}</p>
                      {student.initiationStatus !== 'none' && (
                        <span className={`badge ${student.initiationStatus}`}>
                          {student.initiationStatus} initiation
                        </span>
                      )}
                      {student.serviceRoles?.length > 0 && (
                        <p className="services">{student.serviceRoles.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No students registered yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeDetail;
