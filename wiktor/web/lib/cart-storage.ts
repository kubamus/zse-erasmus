export type StoredCart = Record<number, number>;

const CART_KEY = "verdelight_cart";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart(): StoredCart {
  if (!isBrowser()) {
    return {};
  }

  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    const normalized: StoredCart = {};

    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key);
      if (Number.isFinite(id) && Number.isFinite(value) && value > 0) {
        normalized[id] = Math.floor(value);
      }
    }

    return normalized;
  } catch {
    return {};
  }
}

export function setCart(cart: StoredCart) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(productId: number, quantity = 1) {
  const cart = getCart();
  cart[productId] = (cart[productId] ?? 0) + quantity;
  setCart(cart);
  return cart;
}

export function removeFromCart(productId: number) {
  const cart = getCart();
  delete cart[productId];
  setCart(cart);
  return cart;
}

export function updateCartQuantity(productId: number, quantity: number) {
  const cart = getCart();
  if (quantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = Math.floor(quantity);
  }
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart({});
}

export function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}
