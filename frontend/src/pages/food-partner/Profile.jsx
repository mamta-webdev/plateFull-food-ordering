import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ChefProfile from "../../assets/chef-profile.jpg";
import API_BASE from "../../config.js/api"

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_BASE}/api/food-partner/${id}`, {
                withCredentials: true,
            })
            .then((response) => {
                setProfile(response.data.foodPartner);
                setVideos(response.data.foodItems || []);
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
            });
    }, [id]);

    const handleAddToCart = async (food) => {
        if (addingToCart) return;

        try {
            setAddingToCart(true);
            setCartMessage("");

            const response = await axios.post(
                `${API_BASE}/api/cart/add`,
                {
                    foodId: food._id,
                    quantity: 1,
                },
                { withCredentials: true }
            );

            setCartMessage(
                response.data.message || "Food added to cart successfully!"
            );
        } catch (error) {
            console.error("Add to cart error:", error);

            setCartMessage(
                error.response?.data?.message ||
                "Could not add food to cart. Please try again."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleSaved = (foodId) => {
        setSavedIds((previous) =>
            previous.includes(foodId)
                ? previous.filter((id) => id !== foodId)
                : [...previous, foodId]
        );
    };

    const categories = [
        ...new Set(videos.map((food) => food.category).filter(Boolean)),
    ].slice(0, 2);

    const closeViewer = () => {
        setSelectedVideo(null);
        setCartMessage("");
    };

    return (
        <main className="fp-root">
            <button
                type="button"
                className="fp-back"
                onClick={() => navigate(-1)}
                aria-label="Go back"
            >
                <span>←</span>
            </button>

            {/* RESTAURANT HERO */}
            <header
                className="fp-hero"
                style={{
                    "--hero-image": `url("${profile.profileImage || ChefProfile}")`,
                }}
            >
                <div className="fp-hero-content">
                    <div className="fp-avatar-wrap">
                        <img
                            className="fp-avatar"
                            src={profile.profileImage || ChefProfile}
                            alt={profile.businessName || "Restaurant"}
                        />
                    </div>

                    <h1 className="fp-name">
                        {profile.businessName || "Restaurant"}
                    </h1>

                    <p className="fp-tagline">
                        {profile.description || "Freshly prepared, made with care"}
                    </p>

                    <div className="fp-badges">
                        <span className="fp-badge">
                            {videos.length} {videos.length === 1 ? "meal" : "meals"}
                        </span>

                        {categories.map((category) => (
                            <span className="fp-badge" key={category}>
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            {/* MEALS */}
            <section className="fp-meals-section">
                <div className="fp-section-heading">
                    <h2>Meals</h2>
                    <span className="fp-count">{videos.length}</span>
                </div>

                {videos.length > 0 ? (
                    <div className="fp-grid">
                        {videos.map((food) => (
                            <article
                                className="fp-tile"
                                key={food._id || food.id}
                                onClick={() => {
                                    setCartMessage("");
                                    setSelectedVideo(food);
                                }}
                            >
                                <video
                                    className="fp-food-video"
                                    src={food.videoUrl}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="metadata"
                                />

                                <div className="fp-card-gradient" />

                                <button
                                    type="button"
                                    className={`fp-save-btn ${
                                        savedIds.includes(food._id)
                                            ? "is-saved"
                                            : ""
                                    }`}
                                    aria-label={
                                        savedIds.includes(food._id)
                                            ? "Unsave food"
                                            : "Save food"
                                    }
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleSaved(food._id);
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill={
                                            savedIds.includes(food._id)
                                                ? "currentColor"
                                                : "none"
                                        }
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                                    </svg>
                                </button>

                                <div className="fp-food-info">
                                    <h3>{food.name || "Untitled meal"}</h3>
                                    <p>₹{Number(food.price || 0).toFixed(0)}</p>
                                </div>

                                <button
                                    type="button"
                                    className="fp-add-btn"
                                    disabled={addingToCart}
                                    aria-label={`Add ${food.name || "food"} to cart`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleAddToCart(food);
                                    }}
                                >
                                    {addingToCart ? "…" : "+"}
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="fp-empty">
                        <span className="fp-empty-icon">🍽</span>
                        <h3>No meals yet</h3>
                        <p>This restaurant hasn't posted any meals yet.</p>
                    </div>
                )}
            </section>

            {/* FOOD DETAILS VIEWER */}
            {selectedVideo && (
                <div className="fp-viewer" onClick={closeViewer}>
                    <div
                        className="fp-viewer-card"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="fp-viewer-close"
                            onClick={closeViewer}
                            aria-label="Close food details"
                        >
                            ×
                        </button>

                        <video
                            className="fp-viewer-video"
                            src={selectedVideo.videoUrl}
                            autoPlay
                            loop
                            playsInline
                            controls
                        />

                        <div className="fp-viewer-info">
                            <div>
                                <h3>{selectedVideo.name}</h3>
                                <p>{selectedVideo.description}</p>
                            </div>

                            <div className="fp-viewer-bottom">
                                <strong>
                                    ₹{Number(selectedVideo.price || 0).toFixed(2)}
                                </strong>

                                <button
                                    type="button"
                                    className="fp-viewer-add"
                                    disabled={addingToCart}
                                    onClick={() => handleAddToCart(selectedVideo)}
                                >
                                    {addingToCart ? "Adding..." : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD-TO-CART FEEDBACK */}
            {cartMessage && (
                <div className="fp-toast" role="status">
                    <span>{cartMessage}</span>
                    <button
                        type="button"
                        onClick={() => setCartMessage("")}
                        aria-label="Dismiss message"
                    >
                        ×
                    </button>
                </div>
            )}
        </main>
    );
};

export default Profile;
