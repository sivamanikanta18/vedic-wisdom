import React, { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import './GuideDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vedic-wisdom-eight.vercel.app/api';

const adminAPI = {
  getAllGuides: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/guides`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getAllUsers: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

const guideEventsAPI = {
  getEvents: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  createEvent: async (data) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  deleteEvent: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getAttendanceList: async (eventId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events/${eventId}/attendance-list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  markAttendance: async (eventId, studentId, present) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/guide/events/${eventId}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentId, present })
    });
    return response.json();
  }
};

function GuideDashboard() {
  const [guide, setGuide] = useState(null);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', location: '', startAt: '', endAt: '', college: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Admin view state
  const [allGuides, setAllGuides] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  
  // Attendance state
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    loadGuideData();
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await guideEventsAPI.getEvents();
      if (res.success) setEvents(res.events || []);
    } catch (err) { console.error('Error loading events:', err); }
  };

  const loadGuideData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.success) {
        setGuide(response.user);
        setStudents(response.user.students || []);
        const admin = response.user.userType === 'admin';
        setIsAdmin(admin);
        
        // If admin, load all guides and all students
        if (admin) {
          const guidesRes = await adminAPI.getAllGuides();
          if (guidesRes.success) setAllGuides(guidesRes.guides || []);
          
          const usersRes = await adminAPI.getAllUsers();
          if (usersRes.success) {
            const students = usersRes.users?.filter(u => u.userType === 'folk_boy') || [];
            setAllStudents(students);
          }
        }
      }
    } catch (err) {
      console.error('Error loading guide data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await guideEventsAPI.createEvent(eventForm);
      if (res.success) {
        setShowModal(false);
        setEventForm({ title: '', description: '', location: '', startAt: '', endAt: '', college: '' });
        loadEvents();
      } else alert(res.message || 'Failed to create event');
    } catch (err) {
      alert('Error creating event');
    } finally { setCreating(false); }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await guideEventsAPI.deleteEvent(id);
      if (res.success) loadEvents();
      else alert(res.message || 'Failed to delete');
    } catch (err) { alert('Error deleting event'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

  const handleTakeAttendance = async (event) => {
    setSelectedEvent(event);
    setAttendanceModal(true);
    setLoadingAttendance(true);
    try {
      const res = await guideEventsAPI.getAttendanceList(event._id);
      if (res.success) {
        setRegisteredStudents(res.registeredStudents || []);
      } else {
        alert(res.message || 'Failed to load attendance list');
      }
    } catch (err) {
      alert('Error loading attendance list');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleMarkAttendance = async (studentId, present) => {
    try {
      const res = await guideEventsAPI.markAttendance(selectedEvent._id, studentId, present);
      if (res.success) {
        // Update local state
        setRegisteredStudents(prev => prev.map(s => 
          s._id === studentId ? { ...s, attended: present } : s
        ));
        loadEvents(); // Refresh event counts
      } else {
        alert(res.message || 'Failed to update attendance');
      }
    } catch (err) {
      alert('Error updating attendance');
    }
  };

  if (loading) {
    return (
      <div className="guide-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="guide-dashboard">
      <div className="guide-header">
        <h1>{isAdmin ? 'Admin Dashboard - College Outreach' : 'College Outreach Program'}</h1>
        <p>Welcome, {guide?.name || 'Guide'} {isAdmin && '(Administrator)'}</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          {isAdmin ? 'All Students' : 'My Students'}
        </button>
        {!isAdmin && (
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events ({events.length})
          </button>
        )}
        {isAdmin && (
          <button 
            className={`tab ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            All Guides ({allGuides.length})
          </button>
        )}
        {isAdmin && (
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            All Events ({events.length})
          </button>
        )}
        {!isAdmin && (
          <button 
            className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Chanting Progress
          </button>
        )}
      </div>

      {activeTab === 'students' && (
        <div className="tab-content">
          <div className="students-list">
            {isAdmin ? (
              // Admin sees all students
              allStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No students in the system.</p>
                </div>
              ) : (
                <>
                  <div className="admin-stats">
                    <p><strong>Total Students:</strong> {allStudents.length}</p>
                  </div>
                  {allStudents.map((student) => (
                    <div key={student.id || student._id} className="student-card">
                      <div className="student-info">
                        <h4>{student.name || 'N/A'}</h4>
                        <p>{student.email || 'N/A'}</p>
                        <p className="student-role">{student.userType?.toUpperCase() || 'FOLK BOY'}</p>
                      </div>
                      <div className="student-status">
                        <span className={`status ${student.initiationStatus || 'none'}`}>
                          {student.initiationStatus === 'none' && 'Not Initiated'}
                          {student.initiationStatus === 'first' && 'First Initiation'}
                          {student.initiationStatus === 'second' && 'Second Initiation'}
                          {!student.initiationStatus && 'Not Initiated'}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )
            ) : (
              // Guide sees only their students
              students.length === 0 ? (
                <div className="empty-state">
                  <p>No students assigned yet.</p>
                  <p>Contact admin to add students to your college program.</p>
                </div>
              ) : (
                students.map((student) => (
                  <div key={student.id || student._id} className="student-card">
                    <div className="student-info">
                      <h4>{student.name || 'N/A'}</h4>
                      <p>{student.email || 'N/A'}</p>
                    </div>
                    <div className="student-status">
                      <span className={`status ${student.initiationStatus || 'none'}`}>
                        {student.initiationStatus === 'none' && 'Not Initiated'}
                        {student.initiationStatus === 'first' && 'First Initiation'}
                        {student.initiationStatus === 'second' && 'Second Initiation'}
                        {!student.initiationStatus && 'Not Initiated'}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="tab-content">
          <div className="events-header">
            <button className="create-event-btn" onClick={() => setShowModal(true)}>Create New Event</button>
          </div>
          
          {events.length === 0 ? (
            <div className="empty-state"><p>No events created yet.</p><p>Create an event to start tracking attendance.</p></div>
          ) : (
            <div className="events-list">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>{formatDate(event.startAt)} | {event.location || 'No location'}</p>
                    <p>Present: {event.attendance?.filter(a => a.attended).length || 0} students</p>
                  </div>
                  <div className="event-actions">
                    <button className="attendance-btn" onClick={() => handleTakeAttendance(event)}>Take Attendance</button>
                    <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'guides' && isAdmin && (
        <div className="tab-content">
          <div className="guides-list">
            {allGuides.length === 0 ? (
              <div className="empty-state">
                <p>No guides in the system.</p>
                <p>Assign users as Folk Guides from User Management.</p>
              </div>
            ) : (
              <>
                <div className="admin-stats">
                  <p><strong>Total Guides:</strong> {allGuides.length}</p>
                </div>
                {allGuides.map((g) => (
                  <div key={g.id || g._id} className="guide-card">
                    <div className="guide-info">
                      <h4>{g.name || 'N/A'}</h4>
                      <p>{g.email || 'N/A'}</p>
                      <p className="guide-role">{g.userType?.toUpperCase() || 'FOLK GUIDE'}</p>
                    </div>
                    <div className="guide-stats">
                      <span className="student-count">
                        {g.totalStudents || 0} Students
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'progress' && !isAdmin && (
        <div className="tab-content">
          <div className="progress-header">
            <h3>Student Chanting Progress</h3>
            <p>Daily rounds completed by your students</p>
          </div>
          
          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students to track.</p>
            </div>
          ) : (
            <div className="progress-list">
              {students.map((student) => (
                <div key={student.id || student._id} className="progress-card">
                  <div className="progress-info">
                    <h4>{student.name || 'N/A'}</h4>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((student.dailyRounds || 0) / 16 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p>{student.dailyRounds || 0} / 16 rounds today</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {attendanceModal && (
        <div className="modal-overlay" onClick={() => setAttendanceModal(false)}>
          <div className="modal attendance-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Attendance: {selectedEvent?.title}</h3>
              <button onClick={() => setAttendanceModal(false)}>✕</button>
            </div>
            <div className="attendance-content">
              {loadingAttendance ? (
                <div className="loading">Loading...</div>
              ) : registeredStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No students have RSVP'd yet.</p>
                  <p>Share the event with your students!</p>
                </div>
              ) : (
                <div className="attendance-list">
                  <p className="attendance-count">
                    {registeredStudents.filter(s => s.attended).length} / {registeredStudents.length} Present
                  </p>
                  {registeredStudents.map((student) => (
                    <div key={student._id} className="attendance-row">
                      <div className="student-details">
                        <h4>{student.name}</h4>
                        <p>{student.email}</p>
                      </div>
                      <div className="attendance-toggle">
                        <button 
                          className={`toggle-btn ${student.attended ? 'present' : ''}`}
                          onClick={() => handleMarkAttendance(student._id, !student.attended)}
                        >
                          {student.attended ? 'Present' : 'Absent'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Create Event</h3><button onClick={() => setShowModal(false)}>✕</button></div>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group"><label>Title *</label><input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} rows="2" /></div>
              <div className="form-row">
                <div className="form-group"><label>Start *</label><input type="datetime-local" value={eventForm.startAt} onChange={e => setEventForm({...eventForm, startAt: e.target.value})} required /></div>
                <div className="form-group"><label>End</label><input type="datetime-local" value={eventForm.endAt} onChange={e => setEventForm({...eventForm, endAt: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Location</label><input type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} /></div>
              <div className="form-group"><label>College</label><input type="text" value={eventForm.college} onChange={e => setEventForm({...eventForm, college: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuideDashboard;
