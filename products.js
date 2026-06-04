// Product Management System
// Handles product CRUD operations

class ProductManager {
  constructor() {}

  // Add new product (Admin only)
  addProduct(productData) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const { name, price, discount, stock, category, description, images, whatsapp } = productData;

    if (!name || !price || !category) {
      return { success: false, error: 'Required fields missing' };
    }

    const product = db.create('products', {
      name,
      price: parseFloat(price),
      discount: parseFloat(discount) || 0,
      finalPrice: this.calculateFinalPrice(parseFloat(price), parseFloat(discount) || 0),
      stock: parseInt(stock) || 0,
      category,
      description,
      images: images || [],
      whatsapp,
      seller: 'Admin',
      sellerId: auth.currentUser.id,
      views: 0,
      status: 'active'
    });

    return { success: true, product };
  }

  // Get all products
  getAllProducts() {
    return db.read('products');
  }

  // Get products by category
  getByCategory(category) {
    return db.findBy('products', 'category', category);
  }

  // Update product (Admin only)
  updateProduct(productId, updatedData) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const updated = db.update('products', productId, updatedData);
    return updated ? { success: true, product: updated } : { success: false, error: 'Product not found' };
  }

  // Delete product (Admin only)
  deleteProduct(productId) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const success = db.delete('products', productId);
    return { success, message: success ? 'Product deleted' : 'Product not found' };
  }

  // Get single product
  getProduct(productId) {
    return db.findById('products', productId);
  }

  // Search products
  searchProducts(query) {
    const products = this.getAllProducts();
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Calculate final price
  calculateFinalPrice(price, discount) {
    return price - (price * discount / 100);
  }

  // Increment product views
  incrementViews(productId) {
    const product = this.getProduct(productId);
    if (product) {
      this.updateProduct(productId, { views: (product.views || 0) + 1 });
    }
  }
}

const products = new ProductManager();