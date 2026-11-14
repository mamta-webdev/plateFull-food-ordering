import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faChevronLeft,
    faCartShopping,
    faUtensils,
    faTriangleExclamation,
    faPlus,
    faMinus
} from "@fortawesome/free-solid-svg-icons"
import "../../styles/Cart.css"

// Formats a number as Indian rupees, e.g. 159.64 -> ₹159.64
const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount)

const Cart = () => {

    const navigate = useNavigate()

    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [reloadKey, setReloadKey] = useState(0)

    // Fetch the cart (runs on page load and again when "Try again" is clicked)
    useEffect(() => {

        setLoading(true)
        setError("")

        axios
            .get("http://localhost:3000/api/cart", { withCredentials: true })
            .then((response) => {
                // The backend sends cart: null when the cart is empty
                setCart(response.data.cart || null)
            })
            .catch((err) => {

                if (err.response?.status === 404) {
                    setCart(null)
                } else if (err.response?.status === 401) {
                    setError("Please login to view your cart.")
                } else {
                    setError("Could not load your cart. Please try again.")
                }

            })
            .finally(() => setLoading(false))

    }, [reloadKey])


    // Safe values (work even if some data is missing)
    const items = cart?.items || []
    const partnerName = cart?.foodPartner?.businessName || "Unknown restaurant"

    const totalQuantity = items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    )

    const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    )

    

const handleQuantityChange = async (cartItemId, change) => {
    const item = cart?.items?.find((item) => item._id === cartItemId);

    if (!item) return;

    const currentQuantity = Number(item.quantity) || 1;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    try {
        const response = await axios.put(
            "http://localhost:3000/api/cart/update",
            {
                cartItemId,
                quantity: newQuantity,
            },
            { withCredentials: true }
        );

        if (response.data.cart) {
            setCart(response.data.cart);
        } else {
            // Fallback if the controller returns no cart object.
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.map((cartItem) =>
                    cartItem._id === cartItemId
                        ? { ...cartItem, quantity: newQuantity }
                        : cartItem
                ),
            }));
        }
    } catch (err) {
        console.error("Quantity update failed:", err);
        alert(
            err.response?.data?.message ||
            "Could not update quantity. Please try again."
        );
    }
};



const handleRemoveItem = async (cartItemId) => {
    try {
        const response = await axios.delete(
            "http://localhost:3000/api/cart/remove",
            {
                data: { cartItemId },
                withCredentials: true,
            }
        );

        if (response.data.cart) {
            setCart(response.data.cart);
        } else {
            // Handles an empty cart response if the backend deletes it.
            setCart((prevCart) => {
                if (!prevCart) return prevCart;

                const updatedItems = prevCart.items.filter(
                    (item) => item._id !== cartItemId
                );

                return updatedItems.length > 0
                    ? { ...prevCart, items: updatedItems }
                    : null;
            });
        }
    } catch (err) {
        console.error("Remove item failed:", err);
        alert(
            err.response?.data?.message ||
            "Could not remove item. Please try again."
        );
    }
};




    /* ---------- LOADING / ERROR / EMPTY ---------- */

    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-state">
                    <span className="cart-spinner" />
                    <p>Loading your cart...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="cart-page">
                <div className="cart-state">
                    <div className="cart-state-icon">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </div>
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <div className="cart-state-actions">
                        <button
                            type="button"
                            className="cart-btn cart-btn-primary"
                            onClick={() => setReloadKey((key) => key + 1)}
                        >
                            Try again
                        </button>
                        <button
                            type="button"
                            className="cart-btn cart-btn-outline"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-state">
                    <div className="cart-state-icon">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any food yet.</p>
                    <button
                        type="button"
                        className="cart-btn cart-btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Explore Food
                    </button>
                </div>
            </div>
        )
    }



    /* ---------- CART ---------- */

    return (
        <div className="cart-page">

            {/* HERO */}

            <header className="cart-hero">
                {/* Background food video */}
    <video
        className="cart-hero-video"
        autoPlay
        loop
        playsInline
        muted
        preload="metadata"
        aria-hidden="true"
    >
        <source
            src="/videos/food-background.mp4"
            type="video/mp4"
        />
    </video>

    {/* Dark overlay for readable text */}
    <div className="cart-hero-overlay"></div>

                <div className="cart-hero-inner">

                    <button
                        type="button"
                        className="cart-back"
                        onClick={() => navigate("/")}
                        aria-label="Back to home"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <h1>
                        <em>Your</em> cart
                    </h1>

                    <p>
                        {totalQuantity} {totalQuantity === 1 ? "item" : "items"} from {partnerName}
                    </p>

                </div>

            </header>


            <div className="cart-layout">

                {/* ITEMS */}

                <section className="cart-items">

                    <h2 className="cart-section-title">Your selection</h2>

                    <div className="cart-grid">

                        {items.map((item) => {

                            const price = Number(item.price) || 0
                            const quantity = Number(item.quantity) || 0
                            const videoUrl = item.food?.videoUrl

                            return (
                                <article className="cart-card" key={item._id}>

                                    <div className="cart-card-text">

                                        <h3>
                                            <span>{quantity}×</span>{" "}
                                            {item.food?.name || "Item no longer available"}
                                        </h3>

                                        <p className="cart-card-partner">{partnerName}</p>

                                        <p className="cart-card-unit">{formatPrice(price)} each</p>

                                        <strong className="cart-card-price">
                                            {formatPrice(price * quantity)}
                                        </strong>

                                    </div>

                                    <div className="cart-photo">
                                        {videoUrl ? (
                                            <video
                                                src={`${videoUrl}#t=0.5`}
                                                muted
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faUtensils} />
                                        )}
                                    </div>

                                </article>
                            )
                        })}

                    </div>

                </section>


                {/* YOUR ORDER PANEL */}

                <aside className="cart-order">

                    <h2>Your order</h2>

                    <ul className="cart-lines">
                        {items.map((item) => {

                            const price = Number(item.price) || 0
                            const quantity = Number(item.quantity) || 0

                            return (
                                <li key={item._id}>

                                    <span className="cart-line-name">
                                        {item.food?.name || "Item no longer available"}
                                    </span>

                                    {/* Display only: quantity editing is not built yet */}
                                    <span className="cart-stepper">
                                        <button type="button" onClick={() => handleQuantityChange(item._id, -1)} disabled={quantity <= 1} aria-label="Decrease quantity">
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>

                                        <b>{quantity}</b>

                                        <button type="button" onClick={() => handleQuantityChange(item._id, 1)}  aria-label="Increase quantity">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </span>

                                    <span className="cart-line-price">
                                        {formatPrice(price * quantity)}
                                    </span>

                                    <button
    type="button"
    className="cart-remove-btn"
    onClick={() => handleRemoveItem(item._id)}
>
    Remove
                                    </button>

                                </li>
                            )
                        })}
                    </ul>

                    <div className="cart-totals">

                        <div className="cart-row">
                            <span>Items</span>
                            <span>{totalQuantity}</span>
                        </div>

                        <div className="cart-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <p className="cart-note">
                            Delivery fees and taxes are not included yet.
                        </p>

                        <div className="cart-row cart-row-total">
                            <span>TOTAL</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>

                    </div>

                    {/* Placeholder: checkout is not built yet */}
                    <button type="button" className="cart-checkout" disabled>
                        Continue to checkout (coming soon)
                    </button>

                    <button
                        type="button"
                        className="cart-continue"
                        onClick={() => navigate("/")}
                    >
                        Continue Browsing
                    </button>

                </aside>

            </div>

        </div>
    )
}

export default Cart