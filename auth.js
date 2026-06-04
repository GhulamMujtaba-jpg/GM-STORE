// Authentication System
// Handles user login, signup, and session management

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.loadSession();
  }

  // Admin credentials (hardcoded for demo - change in production)
  ADMIN_CREDS = {
    email: 'admin@gmstore.com',
    password: 'Admin@12345',
    name: 'GM Admin',
    role: 'admin'
  };

  register(userData) {
    const { email, password, name, phone } = userData;

    // Validation
    if (!email || !password || !name) {
      return { success: false, error: 'All fields required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be 6+ characters' };
    }

    // Check if user exists
    const existingUser = db.findBy('users', 'email', email)[0];
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Create user
    const user = db.create('users', {
      email,
      password: this.hashPassword(password),
      name,
      phone: phone || '',
      role: 'client',
      status: 'active'
    });

    // Set session
    this.currentUser = { ...user, password: undefined };
    this.saveSession();

    return { success: true, user: this.currentUser };
  }

  login(email, password) {
    // Admin login
    if (email === this.ADMIN_CREDS.email && password === this.ADMIN_CREDS.password) {
      this.currentUser = {
        id: 'admin-001',
        email: this.ADMIN_CREDS.email,
        name: this.ADMIN_CREDS.name,
        role: 'admin'
      };
      this.saveSession();
      return { success: true, user: this.currentUser };
    }

    // Client login
    const user = db.findBy('users', 'email', email)[0];
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: 'Incorrect password' };
    }

    this.currentUser = { ...user, password: undefined };
    this.saveSession();

    return { success: true, user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('gm_session');
    return { success: true };
  }

  saveSession() {
    localStorage.setItem('gm_session', JSON.stringify(this.currentUser));
  }

  loadSession() {
    const session = localStorage.getItem('gm_session');
    if (session) {
      this.currentUser = JSON.parse(session);
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Simple password hashing (for demo - use bcrypt in production)
  hashPassword(password) {
    return btoa(password);
  }

  verifyPassword(password, hash) {
    return btoa(password) === hash;
  }
}

const auth = new AuthManager();