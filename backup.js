.saved-page {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-color);
    color: var(--text-color);
}


/* REELS CONTAINER */

.saved-reels-container {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
}

.saved-reels-container::-webkit-scrollbar {
    display: none;
}


/* SINGLE REEL */

.saved-reel {
    position: relative;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    overflow: hidden;
    background: #000;
}


/* VIDEO */

.saved-reel-video {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: contain;

    background: #000;
}


/* HOME BUTTON */

.saved-home-btn {
    position: fixed;
    top: 25px;
    left: 25px;

    z-index: 20;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 10px 16px;

    border: none;
    border-radius: 25px;

    background: rgba(0, 0, 0, 0.55);
    color: #fff;

    font-size: 15px;

    cursor: pointer;

    backdrop-filter: blur(8px);
}

.saved-home-btn:hover {
    background: rgba(0, 0, 0, 0.75);
}


/* RIGHT ACTIONS */

.saved-reel-actions {
    position: absolute;

    right: 25px;
    bottom: 120px;

    display: flex;
    flex-direction: column;
    gap: 20px;

    z-index: 5;
}


.saved-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    background: none;
    border: none;

    color: #fff;

    font-size: 14px;

    cursor: pointer;
}


.saved-action-icon {
    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: rgba(0, 0, 0, 0.45);

    font-size: 22px;
}


/* FOOD INFORMATION */

.saved-reel-info {
    position: absolute;

    left: 30px;
    right: 100px;
    bottom: 35px;

    z-index: 5;

    color: #fff;

    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
}

.saved-reel-info h3 {
    margin: 0 0 8px;

    font-size: 20px;
}

.saved-reel-info p {
    margin: 0;

    font-size: 14px;

    max-width: 500px;
}


/* EMPTY STATE */

.no-saved-food {
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 15px;
}

.no-saved-food svg {
    font-size: 45px;
}

.no-saved-food p {
    margin: 0;
    font-size: 18px;
}


/* MOBILE */

@media (max-width: 600px) {

    .saved-home-btn {
        top: 18px;
        left: 18px;

        padding: 9px 13px;
    }

    .saved-reel-actions {
        right: 15px;
        bottom: 110px;
    }

    .saved-reel-info {
        left: 20px;
        right: 80px;
        bottom: 25px;
    }

    .saved-reel-info h3 {
        font-size: 18px;
    }

    .saved-reel-info p {
        font-size: 13px;
    }
}


import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import "../../styles/Home.css"
import Comment from "./Comment"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faHeart,
    faBookmark,
    faComment,
    faHouse
} from "@fortawesome/free-regular-svg-icons"

const Home = () => {

    const navigate = useNavigate()

    const [videos, setVideos] = useState([
        {
            _id: "1",
            video: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Delicious food made fresh for you."
        },
        {
            _id: "2",
            video: "https://www.w3schools.com/html/movie.mp4",
            description: "Try our special dishes and visit our store."
        }
    ])

    const [likedVideos, setLikedVideos] = useState({})
    const [savedVideos, setSavedVideos] = useState({})
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [selectedFoodId, setSelectedFoodId] = useState(null)
    const [showComments, setShowComments] = useState(false)

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


    // Handle video play/pause while scrolling
    useEffect(() => {

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    const video = entry.target

                    if (entry.isIntersecting) {

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

        console.log("Error liking video:", error)

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
    }
}


    // Comment

const handleComment = (foodId) => {

    setSelectedFoodId(foodId);
    setShowComments(true);
};


    return (

        <div
            className="home"
            ref={containerRef}
        >

            <div className="video-feed">

                {videos.map((item) => (

                    <div
                        className="video-container"
                        key={item._id}
                    >

                        <video
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
                             className={`action-btn ${
                            likedVideos[item._id] ? "active" : ""
                            }`}
                            onClick={() => handleLike(item)}
                            >
                           <span
                               className="action-icon"
                                style={{
                                  color: likedVideos[item._id] ? "red" : "#222"
                            }}
                            >
                             {likedVideos[item._id] ? "♥" : "♡"}
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
                            <span>{comments.length}</span>
                        </button>

                        
                            {/* Save */}

                          <button
    className={`action-btn save-btn ${
        savedVideos[item._id] === 1 ? "active" : ""
    }`}
    onClick={() => handleSave(item._id)}
>
    <span className="action-icon">
        <FontAwesomeIcon icon={faBookmark} />
    </span>

    <span>{savedVideos[item._id] === 1 ? 1 : 0}</span>
                        </button>


                          

                           

                        </div>


                        {/* Bottom Information */}

                        <div className="video-info">

                            <p>
                                {item.description}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/food-partner/${item.foodPartner}`
                                    )
                                }
                            >
                                Visit Store
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {/* Bottom Navigation */}

                        {/* Bottom Navigation */}

            <nav className="bottom-nav">

                <button
                    className="bottom-nav-item active"
                    onClick={() => navigate("/")}
                >
                    <span className="bottom-nav-icon">
                        🏠
                    </span>

                    <span>
                        Home
                    </span>
                </button>


                <button
                    className="bottom-nav-item"
                    onClick={() => navigate("/saved")}
                >
                    <span className="bottom-nav-icon">
                        <FontAwesomeIcon icon={faBookmark} />
                    </span>

                    <span>
                        Saved
                    </span>
                </button>

            </nav>


            {/* Comments Panel */}

    

            {showComments && selectedFoodId && (
        <Comment
        foodId={selectedFoodId}
        onClose={() => {
            setShowComments(false);
            setSelectedFoodId(null);
        }}
    />
)}

        </div>

    )
}

export default Home




/* =========================
   HOME LAYOUT
========================= */

.home {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    position: relative;
    margin: 0;
    padding: 0;
    overflow: visible;
    /* background: var(--bg-primary, #ffffff); */
    background: #e1a31e
}

/* =========================
   VIDEO FEED
========================= */

.video-feed {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: visible;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
}

.video-feed::-webkit-scrollbar {
    display: none;
}

.video-container {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    flex-shrink: 0;
    overflow: hidden;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    /* background: var(--bg-primary, #ffffff); */
    background: #201e1e
}

/* Full-height video without the top gap */

.video-container video {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    display: block;
    margin: 0;
    padding: 0;
    background: #ffffff;
}

/* =========================
   RIGHT SIDE ACTIONS
========================= */

.video-actions {
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;

    z-index: 10;
}

/* Like, Save and Comment buttons */

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;

    padding: 0;
    border: none;
    background: transparent;

    color: var(--text-primary, #faefef);
    font-size: 15px;
    font-weight: 800;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

/* White circular icon background */

.action-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #ffffff;
    color: #202020;

    font-size: 27px;
    line-height: 1;

    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.10);

    transition:
        transform 0.2s ease,
        background 0.2s ease;
}

.action-btn:hover .action-icon {
    transform: scale(1.06);
}

.action-btn:active .action-icon {
    transform: scale(0.94);
}

/* Liked / saved state */

.action-btn.active .action-icon {
    color: #e63955;
}
.action-btn:not(.active) .action-icon{
    color:#222
}
.save-btn.active .action-icon {
    color: #e9e7e7;
}

/* .action-btn.active {
    color: var(--text-primary, #222222);
} */

/* =========================
   VIDEO DESCRIPTION
========================= */

.video-info {
    position: absolute;
    left: 32px;
    bottom: 85px;

    width: min(55%, 360px);
    max-width: calc(100% - 110px);

    z-index: 10;
}

.video-info p {
    margin: 0 0 12px;

    color: var(--text-primary, #f1ebeb);
    font-size: 15px;
    line-height: 1.5;

    overflow-wrap: anywhere;
}

/* Visit Store button */

.video-info button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-height: 38px;
    padding: 8px 18px;

    border: 1px solid var(--border-color, #dddddd);
    border-radius: 24px;

    background: #3a43ca;
    color: #eceaea;

    font-size: 13px;
    font-weight: 500;

    cursor: pointer;
    transition: background 0.2s ease;
}

.video-info button:hover {
    background-color: #9e3a3a;
}

/* =========================
   BOTTOM NAVIGATION
========================= */

.bottom-nav {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);

    width: 100%;
    max-width: 500px;

    min-height: 66px;
    padding: 6px 12px;
    padding-bottom: max(3px, env(safe-area-inset-bottom));

    display: flex;
    justify-content: space-around;
    align-items: center;

    background: var(--bg-primary, #ffffff);
    border-top: 1px solid var(--border-color, #eeeeee);

    z-index: 100;
}

.bottom-nav-item {
    min-width: 72px;
    min-height: 48px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    border: none;
    border-radius: 12px;
    background: transparent;

    color: var(--text-secondary, #777777);

    font-size: 11px;
    cursor: pointer;
}

.bottom-nav-icon {
    width: 30px;
    height: 30px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 21px;
}

.bottom-nav-item.active {
    color: var(--text-primary, #222222);
}

/* =========================
   TABLETS
========================= */

@media (min-width: 601px) {
    .video-container video {
        width: min(100%, 420px);
    }

    .video-actions {
        right: 24px;
        gap: 20px;
    }

    .video-info {
        left: 32px;
        bottom: 125px;
    }
}
.comments-panel {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    max-height: 60vh;
    overflow-y: auto;
    background: white;
    padding: 20px;
    border-radius: 20px 20px 0 0;
    z-index: 1000;
}

.comments-panel h3 {
    margin-top: 0;
}

.comments-panel div {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}

.comments-panel p {
    margin: 5px 0 0;
}

.comments-panel button {
    margin-top: 15px;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
    .home {
        width: 100%;
        height: 100vh;
        height: 100dvh;
    }

    .video-container video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .video-actions {
        right: 12px;
        top: auto;
        bottom: 115px;
        transform: none;
        gap: 15px;
    }

    .action-icon {
        width: 42px;
        height: 42px;
        font-size: 24px;
    }

    .action-btn {
        gap: 4px;
        font-size: 10px;
    }

    .video-info {
        left: 14px;
        bottom: 70px;

        width: calc(100% - 90px);
        max-width: 260px;
        margin-top:30px;
    }

    .video-info p {
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.4;
    }

    .video-info button {
        min-height: 36px;
        padding: 7px 15px;
        font-size: 12px;
    }

    .bottom-nav {
        max-width: none;
        min-height: 62px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .bottom-nav-item {
        min-width: 64px;
        font-size: 10px;
    }

    .bottom-nav-icon {
        font-size: 20px;
    }
}

/* =========================
   SMALL MOBILE SCREENS
========================= */

@media (max-width: 360px) {
    .video-actions {
        right: 8px;
        bottom: 105px;
        gap: 12px;
    }

    .action-icon {
        width: 38px;
        height: 38px;
        font-size: 22px;
    }

    .video-info {
        left: 10px;
        bottom: 50px;
        width: calc(100% - 75px);
    }

    .video-info p {
        font-size: 15px;
    }

    .bottom-nav {
        min-height: 58px;
    }
}

/* =========================
   SHORT SCREENS
========================= */

@media (max-height: 500px) and (min-width: 601px) {
    .video-actions {
        flex-direction: row;
        right: 16px;
        top: auto;
        bottom: 85px;
        transform: none;
        gap: 12px;
    }

    .action-icon {
        width: 38px;
        height: 38px;
        font-size: 22px;
    }

    .video-info {
        bottom: 85px;
    }
}



import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faHouse,
    faBookmark
} from "@fortawesome/free-solid-svg-icons"
import "../../styles/savedFood.css"

function SavedFood() {

    const [savedFoods, setSavedFoods] = useState([])
    const [loading, setLoading] = useState(true)

    const videoRefs = useRef(new Map())
    const navigate = useNavigate()

    const getSavedFoods = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/food/save",
                {
                    withCredentials: true
                }
            )

            console.log("SAVED FOODS:", response.data)

            setSavedFoods(response.data.savedFoods || [])

        } catch (error) {

            console.log(
                "GET SAVED FOODS ERROR:",
                error.response?.data || error
            )

        } finally {

            setLoading(false)
        }
    }


    useEffect(() => {
        getSavedFoods()
    }, [])

    useEffect(() => {

    if (savedFoods.length === 0) return

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                const video = entry.target

                if (entry.isIntersecting) {

                    video.play().catch((error) => {
                        console.log("VIDEO PLAY ERROR:", error)
                    })

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

}, [savedFoods])


    if (loading) {
        return (
            <div className="saved-page">
                <p>Loading...</p>
            </div>
        )
    }


    return (

        <div className="saved-page">

            {/* HOME BUTTON */}

            <button
                className="saved-home-btn"
                onClick={() => navigate("/")}
            >
                <FontAwesomeIcon icon={faHouse} />
                <span>Home</span>
            </button>


            {savedFoods.length === 0 ? (

                <div className="no-saved-food">

                    <FontAwesomeIcon icon={faBookmark} />

                    <p>No saved reels yet</p>

                </div>

            ) : (

                <div className="saved-reels-container">

                      {savedFoods.map((item) => {

    console.log("VIDEO URL:", item)

    return (
        <div
            className="saved-reel"
            key={item._id}
        >

            <video
                ref={(element) => {

                    if (element) {
                        videoRefs.current.set(item._id, element)
                    } else {
                        videoRefs.current.delete(item._id)
                    }

                }}
                src={item.food.videoUrl}
                className="saved-reel-video"
                loop
                muted
                playsInline
                preload="auto"
            />

            <div className="saved-reel-actions">

                <button className="saved-action-btn">
                    <span className="saved-action-icon">
                        <FontAwesomeIcon icon={faBookmark} />
                    </span>

                    <span>1</span>
                </button>

            </div>

            <div className="saved-reel-info">

                <h3>{item.food.name}</h3>

                <p>{item.food.description}</p>

            </div>

        </div>
    )
})}

                </div>

            )}

        </div>
    )
}

export default SavedFood