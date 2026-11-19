import React from "react"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import "../../styles/Comment.css"
import API_BASE from "../../config.js/api"

const AVATAR_COLORS = [
    ["#4f8cff", "#7a5cff"],
    ["#00c2a8", "#2b8cff"],
    ["#ff7a9c", "#a35cff"],
    ["#ffb347", "#ff6b6b"],
    ["#38d9a9", "#3b82f6"],
]

const getAvatarGradient = (name = "U") => {
    const [from, to] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
    return `linear-gradient(135deg, ${from}, ${to})`
}

const Comment = (props) => {

    const foodId = props.foodId
    const onClose = props.onClose
    const onCountChange = props.onCountChange

    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [posting, setPosting] = useState(false)
    const [loginMessage, setLoginMessage]  = useState("")

    const listRef = useRef(null)
    const inputRef = useRef(null)

    const fetchComments = async () => {

        const response = await axios.get(
            `${API_BASE}/api/food/get-comment/${foodId}`,
            { withCredentials: true }
        )

        setComments(response.data.comments || [])

    }

    useEffect(() => {

        const getComments = async () => {

            try {
                await fetchComments()
            } catch (error) {
                console.log("Error Fetching comments:", error)
            }

        }

        getComments()

    }, [foodId])


    // Close on Escape
    useEffect(() => {

        const handleKey = (e) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKey)

        return () => window.removeEventListener("keydown", handleKey)

    }, [onClose])


    const scrollToBottom = () => {

        requestAnimationFrame(() => {
            listRef.current?.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth"
            })
        })

    }


    const handleAddComment = async () => {

        if (!commentText.trim() || posting) {
            return
        }

        setPosting(true)

        try {

            await axios.post(
                "http://localhost:3000/api/food/add-comment",
                {
                    foodId: foodId,
                    comment: commentText
                },
                { withCredentials: true }
            )

            setCommentText("")

            await fetchComments()

            scrollToBottom()

            inputRef.current?.focus()

        } catch (error) {

            console.log("STATUS:", error.response?.status)
            console.log("BACKEND ERROR:", error.response?.data)

            if(error.response?.status === 401){
                setLoginMessage("Please login to comment")
                setTimeout(()=>setLoginMessage(""),2000)
            }

        } finally {
            setPosting(false)
        }
    }


    return (

        <div
            className="cmt-root cmt-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >

            <div className="cmt-panel">

                {/* HEADER */}

                <div className="cmt-header">

                    <span className="cmt-title">Comments</span>

                    <button
                        type="button"
                        className="cmt-close"
                        onClick={onClose}
                        aria-label="Close comments"
                    >
                        ×
                    </button>

                </div>


                {/* COMMENTS LIST (only this part scrolls) */}

                <div className="cmt-list" ref={listRef}>

                    {comments.length === 0 ? (

                        <div className="cmt-empty">

                            <span className="cmt-empty-title">No comments yet</span>

                            <span className="cmt-empty-sub">Be the first to comment</span>

                        </div>

                    ) : (

                        comments.map((item) => {

                            const name = item.user?.name || "User"

                            return (

                                <div className="cmt-item" key={item._id}>

                                    <div
                                        className="cmt-avatar"
                                        style={{ background: getAvatarGradient(name) }}
                                    >
                                        {name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="cmt-body">

                                        <span className="cmt-name">{name}</span>

                                        <span className="cmt-text">{item.comment}</span>

                                    </div>

                                </div>

                            )

                        })

                    )}

                </div>


                {/* INPUT (always pinned at the bottom, full width) */}

                <div className="cmt-composer">

                    {loginMessage && (
                       <div className="cmt-login-message">
                          {loginMessage}
                      </div>
                    )}

                    <div className="cmt-field">

                        <input
                            ref={inputRef}
                            type="text"
                            className="cmt-input"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment()
                            }}
                        />

                        <button
                            type="button"
                            className="cmt-post"
                            onClick={handleAddComment}
                            disabled={!commentText.trim() || posting}
                        >
                            {posting ? "Posting..." : "Post"}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default Comment
