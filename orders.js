// Order Management System
// Handles order creation, tracking, and status management

class OrderManager {
  constructor() {}

  // Create new order
  createOrder(orderData) {
    const { productId, customerName, email, phone, address, city, province, landmark, quantity, altPhone } = orderData;

    if (!productId || !customerName || !phone || !address || !city || !province) {
      return { success: false, error: 'Required fields missing' };
    }

    const product = products.getProduct(productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const order = db.create('orders', {
      productId,
      productName: product.name,
      productPrice: product.finalPrice || product.price,
      quantity: quantity || 1,
      totalPrice: (product.finalPrice || product.price) * (quantity || 1),
      customerName,
      email: email || '',
      phone,
      altPhone: altPhone || '',
      address,
      city,
      province,
      landmark,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryStatus: 'not-shipped',
      notes: '',
      userId: auth.isLoggedIn() ? auth.getCurrentUser().id : null
    });

    // Reduce product stock
    products.updateProduct(productId, {
      stock: product.stock - quantity
    });

    return { success: true, order };
  }

  // Get user orders
  getUserOrders(userId) {
    return db.findBy('orders', 'userId', userId);
  }

  // Get all orders (Admin)
  getAllOrders() {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }
    return db.read('orders');
  }

  // Update order status (Admin)
  updateOrderStatus(orderId, status) {
    if (!auth.isAdmin()) {
      return { success: false, error: 'Admin access required' };
    }

    const updated = db.update('orders', orderId, {
      status,
      deliveryStatus: status === 'completed' ? 'delivered' : 'in-transit'
    });

    return updated ? { success: true, order: updated } : { success: false, error: 'Order not found' };
  }

  // Get order details
  getOrder(orderId) {
    return db.findById('orders', orderId);
  }

  // Get orders by status
  getOrdersByStatus(status) {
    return db.findBy('orders', 'status', status);
  }

  // Get pending orders (Admin dashboard)
  getPendingOrders() {
    return db.findBy('orders', 'status', 'pending');
  }
}

const orders = new OrderManager();