import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { addToCart, getProducts } from "../services/api";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const { isAuthenticated, refreshCart } = useAppContext();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ["all", ...unique.filter(Boolean)];
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setStatus("loading");
      try {
        const data = await getProducts({ limit: 18 });
        setProducts(data);
        setError("");
      } catch (err) {
        setError("Unable to load products at the moment.");
      } finally {
        setStatus("idle");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeout = setTimeout(() => setFeedback(""), 3000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const visibleProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        normalized === "" ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      setFeedback("Log in to add products to your cart.");
      return;
    }

    try {
      setStatus("adding");
      await addToCart(productId);
      await refreshCart();
      setFeedback("Product added to cart.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to add item to cart.";
      setFeedback(message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="container">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Limited release</p>
          <h1 className="hero__title">
            Premium streetwear essentials with bold silhouettes.
          </h1>
          <p className="hero__description">
            Curated drops, effortless layering, and pieces designed to last
            through every season. We source responsibly and accent every look
            with breathable fabrics and streamlined tailoring.
          </p>
          <div className="hero__cta">
            <input
              className="hero__search"
              type="search"
              placeholder="Search collection"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button
              className="btn btn--primary"
              onClick={() => setSelectedCategory("all")}
            >
              Shop all
            </button>
          </div>
          {feedback && <p className="hero__notice">{feedback}</p>}
        </div>
      </section>

      <div className="filters" aria-label="Product filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filters__button${
              category === selectedCategory ? " filters__button--active" : ""
            }`}
            type="button"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {error && <p className="hero__notice">{error}</p>}

      {status === "loading" ? (
        <Loader message="Fetching curated products..." />
      ) : visibleProducts.length === 0 ? (
        <p className="hero__notice">No products match your search.</p>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
