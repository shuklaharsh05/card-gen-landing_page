// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = localStorage.getItem('auth_token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log('API Request:', { url, config, body: options.body });

      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          details: data, // Include full error details
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.log('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication APIs
  async signup({ name, email, password }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login({ email, password }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // If login is successful, store the token
    if (response.success && response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    return { success: true, data: null };
  }

  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { success: true, data: null };
    }

    const response = await this.request('/auth/profile');
    console.log('getCurrentUser response:', response);
    return response;
  }

  // Get user data by ID
  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // Public Inquiry API
  async submitInquiry(inquiryData) {
    // Send only the required fields as specified
    const requestData = {
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      businessType: inquiryData.businessType,
      message: inquiryData.message || '', // Include message if provided
    };
    
    console.log('Submitting inquiry with data:', requestData);
    
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Public Card Viewing API
  async getCardById(cardId) {
    console.log('getCardById - Fetching card with ID:', cardId);
    console.log('getCardById - Calling endpoint: /api/cards/' + cardId);
    return this.request(`/cards/${cardId}`);
  }

  // Get user inquiries
  async getUserInquiries(userId) {
    return this.request(`/inquiries/user/${userId}`);
  }

  // Get specific inquiry by ID
  async getInquiryById(inquiryId) {
    return this.request(`/inquiries/${inquiryId}`);
  }

  // Business Card Management APIs (for authenticated users)
  async createCard(cardData, userId) {
    // Send all fields collected in the MyCard form including message
    const requestData = {
      name: cardData.name,
      email: cardData.email,
      phone: cardData.phone,
      businessType: cardData.business_type, // Note: using businessType instead of business_type
      message: cardData.message || '', // Include message if provided
    };
    
    console.log('Creating card with data:', requestData);
    console.log('Sending to endpoint: /api/inquiries');
    
    // Use /api/inquiries endpoint for card creation
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Note: Removed getCategoryId method as we're sending simple form data


  async updateCard(cardId, cardData) {
    return this.request(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }

  async deleteCard(cardId) {
    return this.request(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  // Appointments/Inquiries Management APIs (for authenticated users)
  async getAppointments(userId) {
    // Try different possible endpoints
    const endpoints = [
      `/appointments/user/${userId}`,
      `/appointments/${userId}`,
      `/users/${userId}/appointments`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.request(endpoint);
        if (response.success && response.data) {
          console.log(`Found appointments at endpoint: ${endpoint}`);
          return {
            ...response,
            data: Array.isArray(response.data) ? response.data : []
          };
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
      }
    }
    
    // If all endpoints fail, return empty array
    return {
      success: true,
      data: [],
      message: 'No appointments found'
    };
  }

  async updateAppointmentStatus(appointmentId, status) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteAppointment(appointmentId) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard stats

  // Additional helper methods for user profile data
  getUserId() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    try {
      // Decode JWT token to get user ID (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || payload._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual functions for convenience
export const {
  signup,
  login,
  logout,
  getCurrentUser,
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getCardById,
  submitInquiry,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = apiService;
