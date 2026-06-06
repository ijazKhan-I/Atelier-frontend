export type CartItem = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  maxStock: number;
};

const CART_KEY = "cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
    return parsed.map((item) => ({
      ...item,
      maxStock:
        typeof item.maxStock === "number" && item.maxStock >= 0
          ? item.maxStock
          : Math.max(item.quantity, 1),
    }));
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
  const maxStock = Math.max(0, item.maxStock);
  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.color === item.color &&
      cartItem.size === item.size
  );

  if (maxStock <= 0) {
    return false;
  }

  if (existingIndex >= 0) {
    cart[existingIndex].maxStock = maxStock;
    cart[existingIndex].quantity = Math.min(
      cart[existingIndex].quantity + 1,
      maxStock
    );
  } else {
    cart.push({ ...item, quantity: 1, maxStock });
  }

  writeCart(cart);
  return true;
}

export function updateCartQuantity(
  documentId: string,
  color: string,
  size: string,
  quantity: number
) {
  const cart = readCart()
    .map((item) => {
      if (
        item.documentId !== documentId ||
        item.color !== color ||
        item.size !== size
      ) {
        return item;
      }

      const maxStock = Math.max(0, item.maxStock ?? quantity);
      return {
        ...item,
        maxStock,
        quantity: Math.min(Math.max(quantity, 0), maxStock),
      };
    })
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
