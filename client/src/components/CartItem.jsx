const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const product = item?.productId;
  if (!product) {
    return null;
  }

  const quantity = Number(item.quantity) || 1;
  const availableStock = Number(product.stock) || 0;

  return (
    <article className="cart-item">
      <div className="cart-item__media">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="cart-item__content">
        <div>
          <h4>{product.name}</h4>
          <p className="cart-item__meta">{product.category}</p>
          <p className="cart-item__meta">{product.sizes?.join(", ")}</p>
        </div>

        <div className="cart-item__controls">
          <div className="cart-item__quantity">
            <button
              type="button"
              onClick={() =>
                onQuantityChange(product._id, Math.max(1, quantity - 1))
              }
              disabled={quantity <= 1}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  product._id,
                  Math.min(availableStock || Number.MAX_SAFE_INTEGER, quantity + 1),
                )
              }
              disabled={availableStock && quantity >= availableStock}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="btn btn--link"
            onClick={() => onRemove(product._id)}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="cart-item__pricing">
        <p className="cart-item__price">{formatCurrency(product.price)}</p>
        <p className="cart-item__subtotal">
          {formatCurrency(product.price * quantity)}
        </p>
      </div>
    </article>
  );
};

export default CartItem;
