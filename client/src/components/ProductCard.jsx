import { Link } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const ProductCard = ({ product, onAdd }) => {
  if (!product) {
    return null;
  }

  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price)}</p>
        <p className="product-card__description">
          {product.description?.slice(0, 120)}...
        </p>

        <div className="product-card__actions">
          <Link className="btn btn--ghost" to={`/product/${product._id}`}>
            View details
          </Link>
          <button
            className="btn btn--primary"
            onClick={() => onAdd(product._id)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
