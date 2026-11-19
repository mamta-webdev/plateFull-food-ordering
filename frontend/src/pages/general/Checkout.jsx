import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/checkout.css";
import API_BASE from "../../config.js/api"

const formatPrice = (amount) => {
  const value = Math.round((Number(amount) || 0) * 100) / 100;
  const digits = Number.isInteger(value) ? 0 : 2;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    instructions: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchCart = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${API_BASE}/api/cart`,
          { withCredentials: true }
        );

        if (isMounted) {
          setCart(response.data.cart || null);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 401) {
            setError("Please log in to continue to checkout.");
          } else {
            setError(
              err.response?.data?.message ||
                "Could not load your cart. Please try again."
            );
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = cart?.items || [];

  const itemCount = items.length;

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  // Keep the current checkout preview's delivery-fee rule.
  const deliveryFee = subtotal >= 299 ? 0 : 30;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isSubmitting) return;

    if (items.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      navigate("/cart");
      return;
    }

    if (paymentMethod === "online") {
      alert(
        "Online payment is not available yet. Please select Cash on Delivery."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try{
      const response  = await axios.post(
        `${API_BASE}/api/orders/checkout`,
        {
          deliveryAddress: formData.address.trim(),
          phone: formData.phone.trim(),
          instructions: formData.instructions.trim(),
        },
        {withCredentials: true}
      );

      setOrderSuccess(response.data.order);
      setCart(null);
    } catch(err){
      if(err.response?.status === 401){
        setError("Your session has expired. Please log in again")
      }else{
        setError(
          err.response?.data?.message || "Unable to place your order.Pleasse try again."
        );  
      }
    } finally{
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-state">
          <p>Loading your checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-state">
          <h2>Couldn't load checkout</h2>
          <p>{error}</p>
          <button
            type="button"
            className="checkout-place-order"
            onClick={() => navigate("/cart")}
          >
            Back to cart
          </button>
        </div>
      </div>
    );
  }


  if (!orderSuccess && items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-state">
          <h2>Your cart is empty</h2>
          <p>Add some food before proceeding to checkout.</p>
          <button
            type="button"
            className="checkout-place-order"
            onClick={() => navigate("/cart")}
          >
            Return to cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button
          className="checkout-logo"
          onClick={() => navigate("/")}
          type="button"
        >
          plateful<span>.</span>
        </button>

        <div className="checkout-header-right">
          <span className="checkout-secure">
            <span>♧</span> Secure checkout
          </span>

          <button
            type="button"
            className="checkout-back"
            onClick={() => navigate("/cart")}
          >
            ← Back to cart
          </button>
        </div>
      </header>

      <main className="checkout-container">
        <div className="checkout-heading">
          <p className="checkout-eyebrow">ALMOST THERE!</p>

          <h1>
            Good food,
            <br />
            <span>coming your way.</span>
          </h1>

          <p className="checkout-subtitle">
            Just a few details and your next favourite meal
            will be on its way to you.
          </p>

          <div className="checkout-steps">
            <div className="checkout-step checkout-step-done">
              <span>✓</span>
              <div>
                <strong>Cart</strong>
                <small>Items selected</small>
              </div>
            </div>

            <div className="checkout-step-line" />

            <div className="checkout-step checkout-step-active">
              <span>2</span>
              <div>
                <strong>Checkout</strong>
                <small>Your details</small>
              </div>
            </div>

            
<div
  className={`checkout-step-line ${
    orderSuccess ? "checkout-step-line-done" : ""
  }`}
/>

              <div
  className={`checkout-step ${
    orderSuccess ? "checkout-step-done" : ""
  }`}
>
  <span>{orderSuccess ? "✓" : "3"}</span>
  <div>
    <strong>Confirmation</strong>
    <small>{orderSuccess ? "Order confirmed" : "Order placed"}</small>
  </div>
</div>
          </div>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-main">
            <section className="checkout-card">
              <div className="checkout-section-heading">
                <div className="checkout-section-icon">♧</div>
                <div>
                  <h2>Delivery details</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  title="Enter a valid 10-digit Indian mobile number"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="address">
                  House / Flat / Street address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, building, street..."
                  autoComplete="street-address"
                  rows={3}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="instructions">
                  Delivery instructions <span>(optional)</span>
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Any special instructions?"
                  rows={2}
                />
              </div>
            </section>

            <section className="checkout-card checkout-payment-card">
              <div className="checkout-section-heading">
                <div className="checkout-section-icon">₹</div>
                <div>
                  <h2>Payment method</h2>
                  <p>Choose how you would like to pay.</p>
                </div>
              </div>

              <label
                className={`checkout-payment-option ${
                  paymentMethod === "cod" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="checkout-payment-icon">💵</span>
                <span className="checkout-payment-copy">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
                <span className="checkout-radio-mark" />
              </label>

              <label
                className={`checkout-payment-option ${
                  paymentMethod === "online" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="checkout-payment-icon">📱</span>
                <span className="checkout-payment-copy">
                  <strong>Pay Online</strong>
                  <small>UPI, cards and net banking</small>
                </span>
                <span className="checkout-radio-mark" />
              </label>

              {paymentMethod === "online" && (
                <p className="checkout-payment-note">
                  Online payment is not available yet.
                </p>
              )}
            </section>
          </div>

          <aside className="checkout-sidebar">
            <section className="checkout-card checkout-summary">
              <div className="checkout-summary-title">
                <div>
                  <p className="checkout-eyebrow">YOUR SELECTION</p>
                  <h2>Order summary</h2>
                </div>
                <span className="checkout-item-count">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="checkout-items">
                {items.map((item) => {
                  const food = item.food || {};
                  const videoUrl = food.videoUrl;
                  const quantity = Number(item.quantity) || 0;
                  const price = Number(item.price) || 0;

                  return (
                    <div className="checkout-item" key={item._id}>
                      <div className="checkout-item-image">
                        {videoUrl ? (
                          <video
                            src={`${videoUrl}#t=0.5`}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          "🍽️"
                        )}
                      </div>

                      <div className="checkout-item-info">
                        <strong>{food.name || "Food item"}</strong>
                        <small>{formatPrice(price)} each</small>
                        <span>Qty: {quantity}</span>
                      </div>

                      <strong className="checkout-item-price">
                        {formatPrice(price * quantity)}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-price-breakdown">
                <div>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div>
                  <span>Delivery fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="checkout-free">FREE</strong>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <p className="checkout-free-tip">
                    Add {formatPrice(299 - subtotal)} more for free delivery.
                  </p>
                )}
              </div>

              <div className="checkout-total">
                <div>
                  <strong>Total to pay</strong>
                </div>
                <strong>{formatPrice(total)}</strong>
              </div>

              <button
                  type="submit"
                  className="checkout-place-order"
                  disabled={isSubmitting}
                >
                {isSubmitting ? "Placing your order..." : "Place your order"}
                {!isSubmitting && <span> →</span>}
            </button>

              <button
                type="button"
                className="checkout-edit-cart"
                onClick={() => navigate("/cart")}
              >
                ← Edit your cart
              </button>
            </section>
          </aside>
        </form>

        <footer className="checkout-footer">
          <span>
            plateful<span className="checkout-footer-dot">.</span>
          </span>
          <p>Good food. Good mood. Every time.</p>
        </footer>
      </main>

      {orderSuccess && (
  <div className="checkout-success-overlay">
    {/* Decorative falling confetti (styled in CSS) */}
    <div className="checkout-confetti" aria-hidden="true">
      <span /><span /><span /><span /><span /><span /><span /><span /><span />
    </div>

    <div
      className="checkout-success-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-success-title"
    >
      <div className="checkout-success-icon">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#83b879"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <p className="checkout-eyebrow">ORDER CONFIRMED</p>

      <h2 id="checkout-success-title">Order placed successfully!</h2>

      <p>
        Your Plateful order has been received. Get ready for something delicious!
      </p>

      <div className="checkout-success-details">
        <div>
          <span>Total amount</span>
          <strong>{formatPrice(orderSuccess.totalAmount)}</strong>
        </div>

        <div>
          <span>Payment</span>
          <strong>Cash on Delivery</strong>
        </div>

        <div className="checkout-success-id">
          <span>Order ID</span>
          <strong>{orderSuccess._id}</strong>
        </div>
      </div>

      <button
        type="button"
        className="checkout-place-order"
        onClick={() => navigate("/")}
        autoFocus
      >
        Continue shopping <span>→</span>
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Checkout;
