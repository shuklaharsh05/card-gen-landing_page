// API Configuration
const API_BASE_URL = 'https://teamserver.cloud/api';

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

  // Auth code exchange (short-lived code -> JWT/session)
  async exchangeAuthCode(code) {
    const response = await this.request('/auth/exchange-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        origin: window.location.origin,
      }),
    });

    // If exchange is successful, store the token (support both top-level and wrapped shapes)
    const token = response?.token || response?.data?.token;
    if (response?.success && token) {
      localStorage.setItem('auth_token', token);
    }

    return response;
  }

  // Authentication APIs
  async signup({ name, email, password }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    // If signup is successful, store the token
    if (response.success && response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
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

  // Get user's saved cards directly
  async getUserSavedCards(userId) {
    return this.request(`/users/${userId}/saved-cards`);
  }

  // Delete a saved card
  async deleteSavedCard(userId, cardId) {
    return this.request(`/users/${userId}/saved-cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  // Get user's cards (for card selection in appointments)
  async getUserCards(userId) {
    return this.request(`/users/${userId}/cards`);
  }

  // Get user's cards with full card data (alternative method)
  async getUserCardsWithData(userId) {
    try {
      // Get user data first
      const userResponse = await this.getUserById(userId);
      if (!userResponse.success || !userResponse.data) {
        return { success: false, error: 'User not found' };
      }

      const userData = userResponse.data;
      const cardsWithData = [];

      if (userData.inquiries && Array.isArray(userData.inquiries)) {
        for (const inquiryRef of userData.inquiries) {
          let inquiry;
          
          if (typeof inquiryRef === 'string') {
            const inquiryResponse = await this.getInquiryById(inquiryRef);
            if (inquiryResponse.success && inquiryResponse.data) {
              inquiry = inquiryResponse.data;
            }
          } else {
            inquiry = inquiryRef;
          }
          
          if (inquiry && inquiry.cardGenerated === true && inquiry.cardId) {
            const cardResponse = await this.getCardById(inquiry.cardId);
            if (cardResponse.success && cardResponse.data) {
              const cardData = cardResponse.data;
              cardsWithData.push({
                id: inquiry.cardId,
                name: cardData.name || 'Business Card',
                businessType: cardData.business_type || cardData.businessType || 'Business',
                email: cardData.email,
                createdAt: inquiry.createdAt || inquiry.created_at,
                inquiryId: inquiry._id,
                cardData: cardData
              });
            }
          }
        }
      }

      return {
        success: true,
        data: cardsWithData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user cards'
      };
    }
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
          // console.log(`Found appointments at endpoint: ${endpoint}`);
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

  // Get appointments for a specific card with pagination and filtering
  async getCardAppointments(cardId, options = {}) {
    console.log('🚀 getCardAppointments called with:', { cardId, options });
    
    const { page = 1, limit = 10, status } = options;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      queryParams.append('status', status);
    }
    
    const endpoint = `/appointments/card/${cardId}?${queryParams.toString()}`;
    
    console.log('📡 Fetching card appointments:', { 
      cardId, 
      options, 
      endpoint,
      queryParams: queryParams.toString()
    });
    
    try {
      const response = await this.request(endpoint);
      console.log('✅ getCardAppointments response:', response);
      return response;
    } catch (error) {
      console.error('❌ getCardAppointments error:', error);
      throw error;
    }
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

// Add test functions to window for easy console testing
if (typeof window !== 'undefined') {
  window.testCardAppointments = async (cardId = 'test123', options = {}) => {
    console.log('🧪 Testing getCardAppointments...');
    try {
      const result = await apiService.getCardAppointments(cardId, options);
      console.log('🧪 Test result:', result);
      return result;
    } catch (error) {
      console.error('🧪 Test error:', error);
      return error;
    }
  };

  window.testMyAppointments = async (userId = '68e119bf1055a2e0c74bc4a9') => {
    console.log('🧪 Testing getAppointments (My Appointments)...');
    try {
      const result = await apiService.getAppointments(userId);
      console.log('🧪 Test result:', result);
      return result;
    } catch (error) {
      console.error('🧪 Test error:', error);
      return error;
    }
  };

  window.testUserCards = async (userId = '68e119bf1055a2e0c74bc4a9') => {
    console.log('🧪 Testing getUserCardsWithData...');
    try {
      const result = await apiService.getUserCardsWithData(userId);
      console.log('🧪 Test result:', result);
      return result;
    } catch (error) {
      console.error('🧪 Test error:', error);
      return error;
    }
  };

  window.testDateFilter = async (cardId = 'test123', startDate = '2023-12-01', endDate = '2023-12-31') => {
    console.log('🧪 Testing date filtering...');
    try {
      const result = await apiService.getCardAppointments(cardId, {
        page: 1,
        limit: 10,
        startDate,
        endDate
      });
      console.log('🧪 Date filter test result:', result);
      return result;
    } catch (error) {
      console.error('🧪 Date filter test error:', error);
      return error;
    }
  };
}

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
  getCardAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = apiService;
