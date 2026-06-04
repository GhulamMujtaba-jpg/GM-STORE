// Wishlist/Favorites System
// Handles user favorite products

class FavoritesManager {
  constructor() {}

  // Add to favorites
  addFavorite(productId) {
    if (!auth.isLoggedIn()) {
      return { success: false, error: 'Please login first' };
    }

    const existing = db.findBy('favorites', 'productId', productId);
    if (existing.length > 0) {
      return { success: false, error: 'Already in favorites' };
    }

    const favorite = db.create('favorites', {
      productId,
      userId: auth.getCurrentUser().id
    });

    return { success: true, favorite };
  }

  // Remove from favorites
  removeFavorite(productId) {
    const favorites = db.findBy('favorites', 'productId', productId);
    if (favorites.length > 0) {
      db.delete('favorites', favorites[0].id);
      return { success: true };
    }
    return { success: false, error: 'Not in favorites' };
  }

  // Get user favorites
  getUserFavorites(userId) {
    const userFavorites = db.findBy('favorites', 'userId', userId);
    return userFavorites.map(fav => products.getProduct(fav.productId)).filter(p => p);
  }

  // Check if product is favorite
  isFavorite(productId) {
    const user = auth.getCurrentUser();
    if (!user) return false;
    const favorite = db.findBy('favorites', 'productId', productId)
      .find(f => f.userId === user.id);
    return !!favorite;
  }

  // Get favorites count
  getFavoritesCount(userId) {
    return db.findBy('favorites', 'userId', userId).length;
  }
}

const favorites = new FavoritesManager();