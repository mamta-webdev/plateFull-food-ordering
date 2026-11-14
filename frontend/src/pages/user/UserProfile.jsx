import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faUser,
    faEnvelope,
    faBookmark,
    faRightFromBracket,
    faChevronRight,
    faArrowLeft,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons"
import "../../styles/UserProfile.css"

/* ------------------------------------------------------------------
   TODO: fill in YOUR existing routes (paths start with /api/...).
   I could not see your auth routes file, so I did not guess them.

   GET_USER_PATH  -> your existing "get the logged-in user" route
   LOGOUT_PATH    -> your existing user logout route (uses logoutUser)
   LOGOUT_METHOD  -> "get" or "post", whichever your route uses
------------------------------------------------------------------- */
const API_BASE = "http://localhost:3000"
const GET_USER_PATH = "/api/auth/user/profile"
const LOGOUT_PATH = "/api/auth/user/logout"
const LOGOUT_METHOD = "get"

const NOT_SET_MESSAGE = "This endpoint is not set yet. See the TODO at the top of UserProfile.jsx."

const UserProfile = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [loggingOut, setLoggingOut] = useState(false)
    const [logoutError, setLogoutError] = useState("")

    useEffect(() => {

        const loadUser = async () => {

            if (!GET_USER_PATH) {
                setError(NOT_SET_MESSAGE)
                setLoading(false)
                return
            }

            try {

                const response = await axios.get(
                    `${API_BASE}${GET_USER_PATH}`,
                    { withCredentials: true }
                )

                setUser(response.data.user || response.data)

            } catch (err) {

                setError(
                    err.response?.status === 401
                        ? "Please login to continue."
                        : "Could not load your profile. Please try again."
                )

            } finally {

                setLoading(false)

            }

        }

        loadUser()

    }, [])


    const handleLogout = async () => {

        if (!LOGOUT_PATH) {
            setLogoutError(NOT_SET_MESSAGE)
            return
        }

        setLoggingOut(true)
        setLogoutError("")

        try {

            await axios({
                method: LOGOUT_METHOD,
                url: `${API_BASE}${LOGOUT_PATH}`,
                withCredentials: true
            })

            navigate("/")

        } catch (err) {

            setLogoutError("Unable to logout. Please try again.")
            setLoggingOut(false)

        }

    }


    /* ---------- LOADING ---------- */

    if (loading) {
        return (
            <div className="up-page">
                <div className="up-center">
                    <span className="up-spinner" />
                    <p>Loading profile...</p>
                </div>
            </div>
        )
    }


    /* ---------- NOT LOGGED IN / ERROR (no private info shown) ---------- */

    if (error || !user) {
        return (
            <div className="up-page">
                <div className="up-card up-card-small">
                    <div className="up-alert">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <span>{error || "Please login to continue."}</span>
                    </div>

                    <button
                        type="button"
                        className="up-action"
                        onClick={() => navigate("/")}
                    >
                        <span className="up-action-icon">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </span>
                        <span className="up-action-text">
                            <strong>Back to Home</strong>
                        </span>
                    </button>
                </div>
            </div>
        )
    }


    const name = user.name || user.fullName || "User"

    return (

        <div className="up-page">

            <button
                type="button"
                className="up-back"
                onClick={() => navigate("/")}
            >
                <FontAwesomeIcon icon={faArrowLeft} /> Home
            </button>

            <div className="up-card">

                {/* PROFILE HEADER */}

                <div className="up-header">
                    <div className="up-avatar">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <h1 className="up-name">{name}</h1>
                    <p className="up-email">{user.email}</p>
                </div>


                {/* ACCOUNT INFORMATION */}

                <div className="up-section">

                    <h2>Account Information</h2>

                    <div className="up-info">
                        <span className="up-info-icon">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <div>
                            <small>Name</small>
                            <strong>{name}</strong>
                        </div>
                    </div>

                    <div className="up-info">
                        <span className="up-info-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <div>
                            <small>Email</small>
                            <strong>{user.email}</strong>
                        </div>
                    </div>

                </div>


                {/* ACTIONS */}

                <div className="up-section">

                    <button
                        type="button"
                        className="up-action"
                        onClick={() => navigate("/saved")}
                    >
                        <span className="up-action-icon">
                            <FontAwesomeIcon icon={faBookmark} />
                        </span>
                        <span className="up-action-text">
                            <strong>Saved Food</strong>
                            <small>View your saved food</small>
                        </span>
                        <FontAwesomeIcon icon={faChevronRight} className="up-chevron" />
                    </button>

                    {logoutError && (
                        <div className="up-alert">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <span>{logoutError}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        className="up-action up-logout"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        <span className="up-action-icon">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                        <span className="up-action-text">
                            <strong>{loggingOut ? "Logging out..." : "Logout"}</strong>
                        </span>
                    </button>

                </div>

            </div>

        </div>

    )
}

export default UserProfile
