import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { addToCart, getProductById } from "../services/api";
import { useAppContext } from "../context/AppContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const ProductPage = () => {
  const { id } = useParams();
  const { isAuthenticated, refreshCart } = useAppContext();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("idle");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchProduct = async () => {
      setStatus("loading");
      try {
        const data = await getProductById(id);
        setProduct(data);
        setError("");
        setQuantity(1);
      } catch (err) {
        setError("Unable to load product.");
      } finally {
        setStatus("idle");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const clearTimer = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(clearTimer);
  }, [feedback]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      setFeedback("Log in to add items to your cart.");
      return;
    }

    try {
      setStatus("adding");
      await addToCart(product._id, quantity);
      await refreshCart();
      setFeedback("Product added to cart.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to add product to cart.";
      setFeedback(message);
    } finally {
      setStatus("idle");
    }
  };

  if (status === "loading" && !product) {
    return <Loader message="Loading product details..." />;
  }

  if (!product) {
    return (
      <section className="container">
        <p className="hero__notice">{error || "Product not found."}</p>
      </section>
    );
  }

  const maxQuantity = Number(product.stock) || 1;

  return (
    <section className="container">
      <h1 className="page-heading">{product.name}</h1>
      <div className="product-detail">
        <div className="product-detail__gallery">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <p className="product-card__category">{product.category}</p>
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          <p className="product-detail__meta">{product.description}</p>
          <div className="product-detail__meta">
            <span className="size-pill">Stock: {maxQuantity}</span>
            <span className="size-pill">
              Sizes: {product.sizes?.join(", ") ?? "standard"}
            </span>
          </div>

          <div className="product-detail__actions">
            <div className="cart-item__quantity">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>

            <button
              className="btn btn--primary"
              type="button"
              onClick={handleAddToCart}
            >
              {status === "adding" ? "Adding..." : "Add to cart"}
            </button>
          </div>

          {feedback && <p className="hero__notice">{feedback}</p>}
          {error && <p className="hero__notice">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
