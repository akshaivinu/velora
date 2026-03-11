import { useCallback, useEffect, useMemo, useState } from "react";
import CartItem from "../components/CartItem";
import Loader from "../components/Loader";
import { getCart, removeFromCart, updateCart } from "../services/api";
import { useAppContext } from "../context/AppContext";

const CartPage = () => {
  const { isAuthenticated, refreshCart } = useAppContext();
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    setStatus("loading");
    try {
      const cartData = await getCart();
      setCart(cartData);
      setError("");
    } catch (err) {
      setCart(null);
      setError("Unable to load your cart.");
    } finally {
      setStatus("idle");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [isAuthenticated, loadCart]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleQuantityChange = async (productId, quantity) => {
    if (!cart) return;

    const payload = cart.products.map((entry) => ({
      productId: entry.productId._id,
      quantity:
        entry.productId._id === productId ? Math.max(1, quantity) : entry.quantity,
    }));

    setStatus("updating");
    try {
      const updated = await updateCart(payload);
      setCart(updated);
      await refreshCart();
      setMessage("Cart updated.");
      setError("");
    } catch (err) {
      setError("Could not update cart.");
    } finally {
      setStatus("idle");
    }
  };

  const handleRemove = async (productId) => {
    setStatus("updating");
    try {
      const updated = await removeFromCart(productId);
      setCart(updated);
      await refreshCart();
      setMessage("Item removed.");
      setError("");
    } catch (err) {
      setError("Unable to remove the item.");
    } finally {
      setStatus("idle");
    }
  };

  const subtotal = useMemo(() => {
    if (!cart?.products?.length) {
      return 0;
    }

    return cart.products.reduce((sum, item) => {
      const price = Number(item.productId?.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  if (!isAuthenticated) {
    return (
      <section className="container">
        <h1 className="page-heading">Your shopping bag</h1>
        <p className="hero__notice">
          Please log in to view and manage your cart.
        </p>
      </section>
    );
  }

  if (status === "loading") {
    return <Loader message="Fetching your cart..." />;
  }

  return (
    <section className="container cart-page">
      <h1 className="page-heading">Your shopping bag</h1>
      {error && <p className="hero__notice">{error}</p>}
      {message && <p className="hero__notice">{message}</p>}

      <div className="cart-page__list">
        {cart?.products?.length ? (
          cart.products.map((item) => (
            <CartItem
              key={item.productId._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))
        ) : (
          <p className="hero__notice">
            Your bag is empty. Explore the shop for fresh arrivals.
          </p>
        )}
      </div>

      <div className="cart-summary">
        <div className="cart-summary__item">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary__item">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="cart-summary__item">
          <strong>Total</strong>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <button className="btn btn--primary" type="button">
          Checkout
        </button>
      </div>
    </section>
  );
};

export default CartPage;
