// localStorage Database Management System
// This handles all data storage and retrieval for the GM Store

class Database {
  constructor() {
    this.prefix = 'gm_store_';
    this.initializeData();
  }

  initializeData() {
    const requiredCollections = {
      users: [],
      products: [],
      orders: [],
      categories: [],
      messages: [],
      favorites: [],
      cartItems: []
    };

    Object.keys(requiredCollections).forEach(collection => {
      if (!localStorage.getItem(this.prefix + collection)) {
        localStorage.setItem(this.prefix + collection, JSON.stringify(requiredCollections[collection]));
      }
    });
  }

  // Generic CRUD operations
  create(collection, data) {
    const items = this.read(collection);
    const item = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    items.push(item);
    localStorage.setItem(this.prefix + collection, JSON.stringify(items));
    return item;
  }

  read(collection) {
    const data = localStorage.getItem(this.prefix + collection);
    return data ? JSON.parse(data) : [];
  }

  update(collection, id, data) {
    const items = this.read(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.prefix + collection, JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  delete(collection, id) {
    const items = this.read(collection);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(this.prefix + collection, JSON.stringify(filtered));
    return true;
  }

  findById(collection, id) {
    const items = this.read(collection);
    return items.find(item => item.id === id);
  }

  findBy(collection, key, value) {
    const items = this.read(collection);
    return items.filter(item => item[key] === value);
  }

  // Clear all data
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeData();
  }
}

// Export for use
const db = new Database();