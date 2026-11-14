import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import "../../styles/Home.css"
import Comment from "./Comment"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as faHeartRegular,faBookmark as faBookmarkRegular,faComment } from "@fortawesome/free-regular-svg-icons"
import {faHeart as faHeartSolid, faBookmark as faBookmarkSolid, faHouse ,faStore, faCartShopping} from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons";

const Home = () => {

    const navigate = useNavigate()

    const [videos, setVideos] = useState([])

    const [likedVideos, setLikedVideos] = useState({})
    const [savedVideos, setSavedVideos] = useState({})
    const [commentCounts, setCommentCounts] = useState({})
    const [selectedFoodId, setSelectedFoodId] = useState(null)
    const [showComments, setShowComments] = useState(false)
    const [activeVideoIndex, setActiveVideoIndex] = useState(0)
    const [loginMessage, setLoginMessage] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const videoRefs = useRef(new Map())
    const containerRef = useRef(null)

    // Fetch videos from backend
    useEffect(() => {

        const fetchVideos = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/food/",
                    {
                        withCredentials: true
                    }
                )

                setVideos(response.data.foodItems)

            } catch (error) {

                console.log("Error fetching videos:", error)

            }

        }

        fetchVideos()

    }, [])

    // Fetch already saved videos
    useEffect(() => {

        const fetchSavedVideos = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/api/food/save",
                    {
                        withCredentials: true
                    }
                )

                const savedFoods = response.data.savedFoods || []

                const savedMap = {}

                savedFoods.forEach((item) => {

                    savedMap[item.food._id] = 1

                })

                setSavedVideos(savedMap)

            } catch (error) {

                if (error.response?.status === 404) {

                    setSavedVideos({})

                } else {

                    console.log(
                        "Error fetching saved videos:",
                        error
                    )
                }

            }

        }

        fetchSavedVideos()

    }, [])

    // check if user is LoggedIn
    useEffect(()=>{
        const checkUserLogin = async () =>{
            try{
                const response = await axios.get("http://localhost:3000/api/auth/user/profile", {withCredentials: true})

                setIsLoggedIn(true)
            }
            catch(error){
                setIsLoggedIn(false)
            }
        }
        checkUserLogin()
    },[])
    // Handle video play/pause while scrolling
    useEffect(() => {

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    const video = entry.target

                    if (entry.isIntersecting) {
                        const index = videos.findIndex(video => video._id === entry.target.dataset.id)
                        setActiveVideoIndex(index)

                        video.play().catch(() => {})

                    } else {

                        video.pause()

                    }

                })

            },

            {
                threshold: 0.7
            }

        )

        videoRefs.current.forEach((video) => {

            observer.observe(video)

        })

        return () => {

            observer.disconnect()

        }

    }, [videos])

    useEffect(() => {
    const savedVideoId = sessionStorage.getItem("homeVideoId")

    if (savedVideoId && videos.length > 0) {
        setTimeout(() => {
            videoRefs.current.get(savedVideoId)?.scrollIntoView({
                behavior: "auto"
            })
        }, 300)
    }
}, [videos])


    const handleFoodPartnerClick = async () => {
    try {
        await axios.get(
            "http://localhost:3000/api/food-partner/profile",
            { withCredentials: true }
        );

        navigate("/food-partner/dashboard");
    } catch (error) {
        navigate("/food-partner/login");
    }
    };

    // Like video
    const handleLike = async (item) => {

        try {

            const response = await axios.post(
                "http://localhost:3000/api/food/like",
                { foodId: item._id },
                { withCredentials: true }
            )

            console.log(response.data)

            if (response.data.like) {
                console.log("Video liked")
            } else {
                console.log("Video unliked")
            }

            setVideos((prev) =>
                prev.map((v) =>
                    v._id === item._id
                        ? {
                            ...v,
                            likeCount: response.data.likeCount
                        }
                        : v
                )
            )

            setLikedVideos((prev) => ({
                ...prev,
                [item._id]: response.data.like
            }))

        } catch (error) {
            console.log(error.response?.data || error)
            if(error.response?.status === 401){
                setLoginMessage("Please login to like videos")
                setTimeout(()=> setLoginMessage(""),2000)
            }

        }
    }

    // Save video
    const handleSave = async (foodId) => {

        try {

            const response = await axios.post(
                "http://localhost:3000/api/food/save",
                {
                    foodId
                },
                {
                    withCredentials: true
                }
            )

            console.log("SAVE RESPONSE:", response.data)

            setSavedVideos(prev => ({
                ...prev,
                [foodId]: response.data.saved
            }))

        } catch (error) {
            console.log(error.response?.data || error)
            if(error.response?.status === 401){
                setLoginMessage("Please Login to save Videos")
                setTimeout(()=>
                    setLoginMessage(""),2000)
            }

        }
    }

    // Comment
    const handleComment = (foodId) => {
        setSelectedFoodId(foodId)
        setShowComments(true)

    }


    return (

        <div
            className="home"
            ref={containerRef}
        >
            {loginMessage && (
            <div className="login-message">
                {loginMessage}
            </div>
        )}

            <div className="video-feed">

                {videos.map((item) => {

                    const liked = !!likedVideos[item._id]
                    const saved = savedVideos[item._id] === 1

                    return (

                        <div
                            className="video-container"
                            key={item._id}
                        >

                            <video
                                data-id={item._id}
                                ref={(element) => {

                                    if (element) {

                                        videoRefs.current.set(
                                            item._id,
                                            element
                                        )

                                    } else {

                                        videoRefs.current.delete(
                                            item._id
                                        )

                                    }

                                }}
                                src={item.videoUrl || item.video}
                                muted
                                loop
                                playsInline
                            />


                            {/* Right Side Actions */}

                            <div className="video-actions">

                                {/* Like */}

                                <button
                                    className={`action-btn like-btn ${liked ? "active" : ""}`}
                                    onClick={() => handleLike(item)}
                                >
                                    <span className="action-icon">
                                        <FontAwesomeIcon
                                            icon={liked ? faHeartSolid : faHeartRegular}
                                        />
                                    </span>

                                    <span>{item.likeCount || 0}</span>
                                </button>


                                {/* Comment */}

                                <button
                                    className="action-btn"
                                    onClick={() => handleComment(item._id)}
                                >
                                    <span className="action-icon">
                                        <FontAwesomeIcon icon={faComment} />
                                    </span>

                                    <span>
                                        {commentCounts[item._id] ?? item.commentCount ?? 0}
                                    </span>
                                </button>


                                {/* Save */}

                                <button
                                    className={`action-btn save-btn ${saved ? "active" : ""}`}
                                    onClick={() => handleSave(item._id)}
                                >
                                    <span className="action-icon">
                                        <FontAwesomeIcon
                                            icon={saved ? faBookmarkSolid : faBookmarkRegular}
                                        />
                                    </span>

                                    <span>{saved ? 1 : 0}</span>
                                </button>

                            </div>


                            {/* Bottom Information */}

                            <div className="video-info">

                                <p>
                                    {item.name}
                                </p>
                                <p className="meal-price">
                                    ₹{item.price}
                                </p>

                                <button
                                    onClick={() => {
                                        sessionStorage.setItem("homeVideoId", item._id)
                                        navigate( `/food-partner/${item.foodPartner}`)
                                    }}
                                >
                                    Visit Store
                                </button>

                            </div>

                        </div>

                    )

                })}

            </div>


            {/* Bottom Navigation */}

            <nav className="bottom-nav">

                <button
                    className="bottom-nav-item active"
                    onClick={() => navigate("/")}
                >
                    <span className="bottom-nav-icon">
                        <FontAwesomeIcon icon={faHouse} />
                    </span>

                    {/* <span>
                        Home
                    </span> */}
                </button>


                <button
                    className="bottom-nav-item"
                    onClick={() => navigate("/saved")}
                >
                    <span className="bottom-nav-icon">
                        <FontAwesomeIcon icon={faBookmarkRegular} />
                    </span>

                    {/* <span>
                        Saved
                    </span> */}
                </button>

                <button
        className="bottom-nav-item"
        onClick={() => navigate(isLoggedIn ? "/user/profile" : "/user/login")}
    >
        <span className="bottom-nav-icon">
            <FontAwesomeIcon icon={faUser} />
        </span>

        {/* <span>
            Account
        </span> */}
                </button>

                <button
    type="button"
    className="bottom-nav-item"
    onClick={() => navigate(isLoggedIn ? "/food-partner/dashboard" : "/food-partner/login")}
>
    <span className="bottom-nav-icon">
        <FontAwesomeIcon icon={faStore} />
    </span>
</button>

                 
<button
    type="button"
    className="bottom-nav-item"
    onClick={() => navigate("/cart")}
>
    <span className="bottom-nav-icon">
        <FontAwesomeIcon icon={faCartShopping} />
    </span>
</button>



            </nav>



            {/* Comments Panel */}

            {showComments && selectedFoodId && (
                <Comment
                    foodId={selectedFoodId}
                    onCountChange={(count) =>
                        setCommentCounts((prev) => ({
                            ...prev,
                            [selectedFoodId]: count
                        }))
                    }
                    onClose={() => {
                        setShowComments(false)
                        setSelectedFoodId(null)
                    }}
                />
            )}

        </div>

    )
}

export default Home
