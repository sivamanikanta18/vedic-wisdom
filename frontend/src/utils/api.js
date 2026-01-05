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
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
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
