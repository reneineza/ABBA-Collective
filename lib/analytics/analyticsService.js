// ABBA Collective Event Analytics Service

export function trackPageView(url) {
  if (typeof window !== 'undefined') {
    console.log(`[Analytics] Page View: ${url}`);
  }
}

export function trackProductView(product) {
  if (typeof window !== 'undefined') {
    console.log(`[Analytics] Product View: ${product.name} ($${product.price})`);
  }
}

export function trackAddToCart(product, quantity = 1) {
  if (typeof window !== 'undefined') {
    console.log(`[Analytics] Add to Cart: ${product.name} (Qty: ${quantity})`);
  }
}

export function trackCheckoutStarted(cartTotal, itemCount) {
  if (typeof window !== 'undefined') {
    console.log(`[Analytics] Checkout Started: Subtotal $${cartTotal} (${itemCount} items)`);
  }
}

export function trackPurchase(orderId, totalAmount) {
  if (typeof window !== 'undefined') {
    console.log(`[Analytics] Purchase Conversion Completed: Order #${orderId} ($${totalAmount})`);
  }
}
