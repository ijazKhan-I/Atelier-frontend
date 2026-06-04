export type CartItem = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

const CART_KEY = "cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-change"));
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = readCart();
  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.color === item.color &&
      cartItem.size === item.size
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  writeCart(cart);
}

export function updateCartQuantity(
  documentId: string,
  color: string,
  size: string,
  quantity: number
) {
  const cart = readCart()
    .map((item) =>
      item.documentId === documentId && item.color === color && item.size === size
        ? { ...item, quantity }
        : item
    )
    .filter((item) => item.quantity > 0);

  writeCart(cart);
}

export function removeCartItem(documentId: string, color: string, size: string) {
  writeCart(
    readCart().filter(
      (item) =>
        !(
          item.documentId === documentId &&
          item.color === color &&
          item.size === size
        )
    )
  );
}

export function clearCart() {
  writeCart([]);
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}
