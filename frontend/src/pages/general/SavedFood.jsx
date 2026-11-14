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
