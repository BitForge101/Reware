import api from './api';

// Auth service class
class AuthService {
  // Register new user
  async signup(userData) {
    try {
      const response = await api.post('/api/auth/signup', userData);
      
      if (response.success && response.token) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Unified login for both users and admins
  async login(credentials) {
    try {
      console.log('🔐 Attempting unified login with:', credentials);
      const response = await api.post('/api/auth/login', credentials);
      console.log('🔐 Unified login response:', response);
      
      if (response.success && response.token) {
        console.log('✅ Login successful, storing data...');
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', response.userType);
        
        // Set admin flag if admin login
        if (response.userType === 'admin') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        
        console.log('✅ User data stored in localStorage');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  // Admin login
  async adminLogin(credentials) {
    try {
      console.log('🔐 Attempting admin login with:', credentials);
      const response = await api.post('/api/admin/login', credentials);
      console.log('🔐 Admin login response:', response);
      
      if (response.success && response.token) {
        console.log('✅ Admin login successful, storing data...');
        // Store token and admin data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.admin));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        console.log('✅ Admin data stored in localStorage');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw new Error(error.message || 'Admin login failed');
    }
  }

  // Check if user is admin
  isAdmin() {
    const userType = localStorage.getItem('userType');
    const userData = this.getCurrentUser();
    return userType === 'admin' || (userData && (userData.role === 'admin' || userData.role === 'superadmin'));
  }

  // Get user type
  getUserType() {
    return localStorage.getItem('userType') || 'user';
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return !!(token && isLoggedIn);
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

// Create and export auth service instance
const authService = new AuthService();
export default authService;
