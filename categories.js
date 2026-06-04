// Category Management System
// Handles product categories

class CategoryManager {
  constructor() {
    this.initializeDefaultCategories();
  }

  initializeDefaultCategories() {
    const existing = db.read('categories');
    if (existing.length === 0) {
      const defaultCategories = [
        { name: 'Electronics', icon: '📱', description: 'Electronic devices' },
        { name: 'Fashion', icon: '👕', description: 'Clothing and accessories' },
        { name: 'Home & Living', icon: '🏠', description: 'Home and lifestyle products' },
        { name: 'Beauty', icon: '💄', description: 'Beauty and personal care' },
        { name: 'Sports', icon: '⚽', description: 'Sports and fitness' },
        { name: 'Books', icon: '📚', description: 'Books and educational materials' }
      ];

      defaultCategories.forEach(cat => db.create('categories', cat));
    }
  }

  // Add category (Admin only)
  addCategory(categoryData) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const { name, icon, description } = categoryData;

    if (!name) {
      return { success: false, error: 'Category name required' };
    }

    const category = db.create('categories', {
      name,
      icon: icon || '📦',
      description: description || ''
    });

    return { success: true, category };
  }

  // Get all categories
  getAllCategories() {
    return db.read('categories');
  }

  // Get category by name
  getCategory(name) {
    return db.findBy('categories', 'name', name)[0];
  }

  // Update category (Admin only)
  updateCategory(categoryId, updatedData) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const updated = db.update('categories', categoryId, updatedData);
    return updated ? { success: true, category: updated } : { success: false, error: 'Category not found' };
  }

  // Delete category (Admin only)
  deleteCategory(categoryId) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const success = db.delete('categories', categoryId);
    return { success, message: success ? 'Category deleted' : 'Category not found' };
  }
}

const categories = new CategoryManager();