/**
 * API Service for Rishi Lal Jewellers
 * Connects to the Express backend with token forwarding and automatic fallback
 */
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  getFallbackHighlights,
  filterFallbackProducts,
} from '@/data/fallbackData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rishilal_token') || localStorage.getItem('aurelia_token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      console.warn(`[API] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(token) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(email) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async addAddress(addressData) {
    return this.request('/auth/address', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(addressId) {
    return this.request(`/auth/address/${addressId}`, {
      method: 'DELETE',
    });
  }

  async toggleWishlist(productId) {
    return this.request('/auth/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    try {
      return await this.request(`/products${queryString}`);
    } catch (err) {
      if (err.status === 401 || err.status === 403) throw err;
      console.warn('[API] Server unreachable, serving offline fallback catalog:', err.message);
      return filterFallbackProducts(params);
    }
  }

  async getProductHighlights() {
    try {
      return await this.request('/products/highlights');
    } catch (err) {
      console.warn('[API] Server unreachable, serving offline fallback highlights:', err.message);
      return getFallbackHighlights();
    }
  }

  async getProduct(identifier) {
    try {
      return await this.request(`/products/${identifier}`);
    } catch (err) {
      if (err.status === 401 || err.status === 403) throw err;
      console.warn(`[API] Server unreachable, searching fallback product for ${identifier}:`, err.message);
      const product = FALLBACK_PRODUCTS.find(
        (p) => p.slug === identifier || p._id === identifier
      );
      if (product) {
        const related = FALLBACK_PRODUCTS.filter(
          (p) => p._id !== product._id && p.categorySlug === product.categorySlug
        ).slice(0, 4);
        return { success: true, product, relatedProducts: related };
      }
      throw err;
    }
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    try {
      return await this.request('/categories');
    } catch (err) {
      console.warn('[API] Server unreachable, serving fallback categories:', err.message);
      return { success: true, categories: FALLBACK_CATEGORIES };
    }
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/admin/all${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(orderId, orderStatus, trackingNumber) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus, trackingNumber }),
    });
  }

  // Coupons
  async validateCoupon(code, orderAmount) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    });
  }

  // Admin Dashboard
  async getAdminStats() {
    return this.request('/admin/dashboard-stats');
  }

  async getAdminCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/customers${query ? `?${query}` : ''}`);
  }

  // AI Jewelry Concierge Chatbot
  async sendChatMessage(message, history = []) {
    try {
      return await this.request('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
      });
    } catch (err) {
      console.warn('[API] Chat request failed, using local concierge fallback:', err.message);
      return {
        success: true,
        reply: "Welcome to Rishi Lal Jewellers! ✨ I'm your personal jewelry assistant. I'm currently operating in offline concierge mode. How may I assist you with our 100% BIS Hallmarked gold, certified diamonds, or bridal collections?",
        products: [],
        suggestedActions: ['Find Jewelry', 'Bridal Collection', 'Shop Under ₹50K', 'Help & Support'],
      };
    }
  }

  // Live Precious Metal Market Prices (Gold, Silver, Diamonds)
  async getMarketPrices(forceRefresh = false) {
    try {
      const endpoint = forceRefresh ? '/market-prices?refresh=true' : '/market-prices';
      return await this.request(endpoint);
    } catch (err) {
      console.warn('[API] Market prices fetch error:', err.message);
      return {
        success: false,
        dataStatus: 'OFFLINE',
        message: 'Market price server is currently offline. Please try again shortly.',
        retrievedAt: new Date().toISOString(),
        gold: { available: false },
        silver: { available: false },
        diamonds: { available: false }
      };
    }
  }
}

export const api = new ApiClient();

