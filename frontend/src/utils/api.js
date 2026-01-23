const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    // If response is not JSON or parsing fails
    if (error instanceof SyntaxError) {
      throw new Error('Server returned invalid response. Please check if backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name, email, password, communityProfile) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, communityProfile }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateSpiritualData: async (spiritualData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/spiritual-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(spiritualData),
    });
    return handleResponse(response);
  },

  getAdminStatus: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/admin-status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

export const eventsAPI = {
  list: async (from, to) => {
    const token = getAuthToken();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    const response = await fetch(`${API_BASE_URL}/events${qs ? `?${qs}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  getById: async (eventId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  create: async ({ title, description, location, startAt, endAt }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, location, startAt, endAt })
    });
    return handleResponse(response);
  },

  update: async (eventId, updates) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  remove: async (eventId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  rsvp: async (eventId, status) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  setAttendance: async (eventId, records) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ records })
    });
    return handleResponse(response);
  }
};

export const gamesAPI = {
  getKrishnaWordSearchStats: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/games/krishna-word-search`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  getKrishnaWordSearchPuzzle: async ({ count } = {}) => {
    const token = getAuthToken();
    const nonce = Date.now();
    const qs = typeof count === 'number' ? `?count=${count}&nonce=${nonce}` : `?nonce=${nonce}`;
    const response = await fetch(`${API_BASE_URL}/games/krishna-word-search/puzzle${qs}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  submitKrishnaWordSearchResult: async ({ score, timeMs }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/games/krishna-word-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score, timeMs })
    });
    return handleResponse(response);
  }
};

// Progress API
export const progressAPI = {
  getProgressByDate: async (dateString) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/progress/date/${dateString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProgress: async (dateString, roundsCompleted, chantingMinutes) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/progress/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ dateString, roundsCompleted, chantingMinutes }),
    });
    return handleResponse(response);
  },

  getProgressRange: async (startDate, endDate) => {
    const token = getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/progress/range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  getStats: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/progress/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout helper
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('spiritualData');
  
  // Dispatch custom event to notify all components
  window.dispatchEvent(new Event('logout'));
};
