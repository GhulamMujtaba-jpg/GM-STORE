// Utility Functions
// Helper functions for common tasks

class Utils {
  // Format currency
  static formatCurrency(amount, currency = 'PKR') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'PKR' ? 'USD' : currency,
      minimumFractionDigits: 0
    }).format(amount).replace('$', 'Rs. ');
  }

  // Format date
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Generate unique ID
  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone
  static isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Truncate text
  static truncate(text, length = 50) {
    return text.length > length ? text.substr(0, length) + '...' : text;
  }

  // Show notification
  static showNotification(message, type = 'info') {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        text: message,
        icon: type,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Download file
  static downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Export data as JSON
  static exportDataAsJSON(dataName) {
    const data = db.read(dataName);
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `${dataName}-backup.json`);
  }

  // Send WhatsApp message
  static sendWhatsApp(phone, message) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Copy to clipboard
  static copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Copied to clipboard!', 'success');
    });
  }

  // Get browser info
  static getBrowserInfo() {
    return navigator.userAgent;
  }

  // Check internet connection
  static async isOnline() {
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors' });
      return true;
    } catch {
      return false;
    }
  }
}

// Global utility object
window.Utils = Utils;