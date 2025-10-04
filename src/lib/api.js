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

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication APIs (to be implemented when auth is added)
  async signup(data) {
    // TODO: Implement when auth endpoints are ready
    return { success: false, error: 'Authentication not yet implemented' };
  }

  async login(data) {
    // TODO: Implement when auth endpoints are ready
    return { success: false, error: 'Authentication not yet implemented' };
  }

  async logout() {
    // TODO: Implement when auth endpoints are ready
    localStorage.removeItem('auth_token');
    return { success: true, data: null };
  }

  async getCurrentUser() {
    // TODO: Implement when auth endpoints are ready
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { success: true, data: null };
    }
    return { success: false, error: 'Authentication not yet implemented' };
  }

  // Public Inquiry API
  async submitInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // Public Card Viewing API
  async getCardById(cardId) {
    return this.request(`/cards/${cardId}`);
  }

  // Business Card Management APIs (for authenticated users)
  async createCard(cardData, userId) {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify({
        ...cardData,
        user_id: userId,
      }),
    });
  }

  async getCard(userId) {
    return this.request(`/cards/user/${userId}`);
  }

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
    return this.request(`/appointments/user/${userId}`);
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
  async getDashboardStats(userId) {
    return this.request(`/dashboard/stats/${userId}`);
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
  deleteAppointment,
  getDashboardStats
} = apiService;
