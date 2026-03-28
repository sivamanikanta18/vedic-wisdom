import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success) {
        setUsers(response.users || []);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error loading users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get effective role (treat missing/undefined as folk_boy)
  const getEffectiveRole = (user) => {
    if (!user.userType || user.userType === 'N/A' || user.userType === '') {
      return 'folk_boy';
    }
    return user.userType;
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  // Calculate stats with effective roles
  const stats = {
    total: users.length,
    folkBoys: users.filter(u => getEffectiveRole(u) === 'folk_boy').length,
    folkGuides: users.filter(u => getEffectiveRole(u) === 'folk_guide').length,
    admins: users.filter(u => getEffectiveRole(u) === 'admin').length
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await adminAPI.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, userType: newRole } : user
        ));
        setShowRoleModal(false);
        setSelectedUser(null);
        alert('Role updated successfully!');
      } else {
        alert('Failed to update role: ' + response.message);
      }
    } catch (err) {
      alert('Error updating role: ' + err.message);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'folk_guide': return 'role-badge guide';
      case 'folk_boy': return 'role-badge folk';
      default: return 'role-badge';
    }
  };

  const getRoleDisplayName = (role) => {
    const names = {
      'folk_boy': 'Folk Boy',
      'folk_guide': 'Folk Guide',
      'admin': 'Administrator'
    };
    return names[role] || role;
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-header">
        <h1>User Management</h1>
        <p>Manage user roles and permissions</p>
      </div>

      <div className="users-stats">
        <div className="stat-box">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-box folk-boys">
          <span className="stat-number">{stats.folkBoys}</span>
          <span className="stat-label">Folk Boys</span>
        </div>
        <div className="stat-box folk-guides">
          <span className="stat-number">{stats.folkGuides}</span>
          <span className="stat-label">Folk Guides</span>
        </div>
        <div className="stat-box admins">
          <span className="stat-number">{stats.admins}</span>
          <span className="stat-label">Admins</span>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or email..."
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">No users found matching "{searchQuery}"</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(getEffectiveRole(user))}>
                      {getRoleDisplayName(getEffectiveRole(user))}
                    </span>
                  </td>
                  <td>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      className="change-role-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleModal(true);
                      }}
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showRoleModal && selectedUser && (
        <div className="role-modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="role-modal" onClick={e => e.stopPropagation()}>
            <h3>Change Role for {selectedUser.name || selectedUser.email}</h3>
            <p>Current Role: <strong>{getRoleDisplayName(getEffectiveRole(selectedUser))}</strong></p>
            
            <div className="role-options">
              <button 
                className={`role-option ${getEffectiveRole(selectedUser) === 'folk_boy' ? 'active' : ''}`}
                onClick={() => handleRoleChange(selectedUser.id, 'folk_boy')}
              >
                <span className="role-name">Folk Boy</span>
                <span className="role-desc">Student - Learning access only</span>
              </button>
              
              <button 
                className={`role-option ${getEffectiveRole(selectedUser) === 'folk_guide' ? 'active' : ''}`}
                onClick={() => handleRoleChange(selectedUser.id, 'folk_guide')}
              >
                <span className="role-name">Folk Guide</span>
                <span className="role-desc">Teacher - Can manage students</span>
              </button>
              
              <button 
                className={`role-option ${getEffectiveRole(selectedUser) === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange(selectedUser.id, 'admin')}
              >
                <span className="role-name">Administrator</span>
                <span className="role-desc">Full system access</span>
              </button>
            </div>
            
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
