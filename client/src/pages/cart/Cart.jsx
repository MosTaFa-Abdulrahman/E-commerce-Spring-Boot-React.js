import "./cart.scss";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Cart Context
import { useCart } from "../../context/useCart";
import toast from "react-hot-toast";

function Cart() {
  const { cart, changeQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // No shipping costs - direct total
  const finalTotal = cart?.totalPrice || 0;

  // Handle quantity change
  const handleQuantityChange = (cartItem, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItem.product.id);
      return;
    }

    if (newQuantity > cartItem.product.stockQuantity) {
      toast.error("Cannot add more items than available in stock");
      return;
    }

    changeQuantity(cartItem, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  // Handle clear cart
  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared successfully");
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Proceeding to checkout...");
    navigate("/checkout");
  };

  // Render cart item
  const renderCartItem = (cartItem) => {
    const { product, quantity, price } = cartItem;

    return (
      <div key={product.id} className="cart-item">
        <div className="cart-item-image">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/100x100?text=No+Image";
            }}
          />
        </div>

        <div className="cart-item-details">
          <div className="item-info">
            <h3 className="item-name">{product.name}</h3>
            <p className="item-category">{product.category?.name}</p>
            <div className="item-price">
              <span className="unit-price">
                ${product.price.toFixed(2)} each
              </span>
              <span className="total-price">${price.toFixed(2)}</span>
            </div>
          </div>

          <div className="item-actions">
            <div className="quantity-controls">
              <button
                onClick={() => handleQuantityChange(cartItem, quantity - 1)}
                className="quantity-btn"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="quantity">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(cartItem, quantity + 1)}
                className="quantity-btn"
                disabled={quantity >= product.stockQuantity}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => handleRemoveItem(product.id)}
              className="remove-btn"
              title="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {product.stockQuantity <= 5 && (
          <div className="stock-warning">
            <AlertCircle size={16} />
            Only {product.stockQuantity} left in stock
          </div>
        )}
      </div>
    );
  };

  // Empty cart component
  const EmptyCart = () => (
    <div className="empty-cart">
      <ShoppingBag size={80} />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <NavLink to="/products" className="continue-shopping-btn">
        <ShoppingCart size={20} />
        Start Shopping
      </NavLink>
    </div>
  );

  // Check if cart is empty - improved condition
  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isCartEmpty) {
    return (
      <div className="cart-container">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="header-info">
            <h1>Shopping Cart</h1>
            <p>
              {cart.totalCount} {cart.totalCount === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="clear-cart-btn"
            type="button"
          >
            <Trash2 size={18} />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items">{cart.items.map(renderCartItem)}</div>

          {/* Continue Shopping */}
          <div className="continue-shopping">
            <NavLink to="/products" className="continue-shopping-link">
              <ArrowLeft size={18} />
              Continue Shopping
            </NavLink>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cart.totalCount} items)</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              <CreditCard size={20} />
              Proceed to Checkout
            </button>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <Shield size={16} />
                <span>Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <Truck size={16} />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="recommended-actions">
            <h4>You might also like</h4>
            <NavLink to="/products" className="action-link">
              Browse more products
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
