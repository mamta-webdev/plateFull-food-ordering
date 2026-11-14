import React from "react"
import "../../styles/profile.css"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ChefProfile from "../../assets/chef-profile.jpg"

const Profile = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [profile, setProfile] = useState({})
    const [videos, setVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [addingToCart, setAddingToCart] = useState(false)
    const [cartMessage, setCartMessage] = useState("")

    useEffect(() => {

        axios.get(
            `http://localhost:3000/api/food-partner/${id}`,
            { withCredentials: true }
        ).then(response => {

            console.log("PROFILE API RESPONSE:", response.data)

            setProfile(response.data.foodPartner)
            setVideos(response.data.foodItems)

        }).catch(error => {

            console.log("Error fetching profile:", error)

        })

    }, [id])

    
const handleAddToCart = async (food) => {
    try {
        setAddingToCart(true);
        setCartMessage("");

        const response = await axios.post(
            "http://localhost:3000/api/cart/add",
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



    return (

        <div className="fp-root">

            <div className="fp-wrap">

                {/* BANNER */}

                <div className="fp-banner">

                    <button
                        type="button"
                        className="fp-back"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        ←
                    </button>

                </div>


                {/* PROFILE CARD */}

                <div className="fp-card">

                    <div className="fp-avatar">
                        <img className="fp-img" src={profile.profileImage || ChefProfile} alt="Chef Profile" />
                    </div>

                    <h1 className="fp-name">
                        {profile.businessName}
                    </h1>

                    <p className="fp-address">
                        📍 Address
                    </p>

                    <div className="fp-stats">

                        <div className="fp-stat">
                            <strong>{videos.length}</strong>
                            <span>Total Meals</span>
                        </div>

                        <div className="fp-stat">
                            <strong>100+</strong>
                            <span>Customers Served</span>
                        </div>

                    </div>

                </div>


                {/* MEALS */}

                <div className="fp-section">

                    <h2>Meals</h2>

                    <span className="fp-count">
                        {videos?.length || 0}
                    </span>

                </div>


                {videos?.length > 0 ? (

                    <div className="fp-grid">

                        {videos.map((video) => (

                            <div
                                className="fp-tile"
                                key={video._id || video.id}
                                onClick={() => setSelectedVideo(video)}
                            >

                                <video
                                    src={video.videoUrl}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="metadata"
                                />

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="fp-empty">
                        No meals posted yet
                    </div>

                )}

            </div>
            {selectedVideo && (
    <div className="fp-viewer" onClick={() => setSelectedVideo(null)}>
        <div className="fp-viewer-card" onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo.videoUrl} autoPlay loop playsInline controls />

            <div className="fp-viewer-info">
                <h3>{selectedVideo.name}</h3>
                <p>{selectedVideo.description}</p>

                <p className="fp-food-price">
        ₹{Number(selectedVideo.price || 0).toFixed(2)}
    </p>

    <button
        type="button"
        className="fp-add-cart-btn"
        disabled={addingToCart}
        onClick={() => {
            handleAddToCart(selectedVideo)}
        }
    >
        {addingToCart ? "Adding..." : "Add to Cart"}
    </button>

    {cartMessage && (
        <p className="fp-cart-message" role="status">
            {cartMessage}
        </p>
    )}
            </div>
        </div>
    </div>
)}

        </div>

    )
}

export default Profile
