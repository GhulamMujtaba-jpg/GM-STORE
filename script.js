function shopNow() {
  alert("Welcome to GM Store! Start shopping now 🛒");
}

function addToCart(productName) {
  const msg = document.getElementById("cart-message");
  msg.innerText = productName + " has been added to cart 🛒";
}