import "../../styles/createFood.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import API_BASE from "../../config.js/api"

const MAX_DESCRIPTION = 300

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const CreateFood = () => {

    const [video, setVideo] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [foodName, setFoodName] = useState("")
    const [description, setDescription] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const [price, setPrice] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (uploading) return

        const formData = new FormData()

        formData.append("name", foodName)
        formData.append("description", description)
        formData.append("video", video)
        formData.append("price",price)

        setUploading(true)
        setError("")

        try {

            const response = await axios.post(
                `${API_BASE}/api/food`,
                formData,
                {
                    withCredentials: true
                }
            )

            console.log("Food created:", response.data)
            navigate("/food-partner/dashboard")

        } catch (error) {

            console.log("Error creating food:", error.response?.data || error)

            setError(
                error.response?.data?.message ||
                "Could not upload your reel. Please try again."
            )

            setUploading(false)

        }
    }

    const chooseFile = (file) => {

        if (!file || !file.type.startsWith("video/")) return

        if (videoPreview) URL.revokeObjectURL(videoPreview)

        setVideo(file)
        setVideoPreview(URL.createObjectURL(file))
        setError("")
    }

    const handleVideoChange = (e) => {
        chooseFile(e.target.files[0])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        chooseFile(e.dataTransfer.files[0])
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const removeVideo = () => {

        if (videoPreview) URL.revokeObjectURL(videoPreview)

        setVideo(null)
        setVideoPreview(null)
    }

    return (

        <div className="cf-root">

            <div className="cf-container">

                <button
                    type="button"
                    className="cf-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="cf-layout">

                    {/* LEFT SIDE - VIDEO */}

                    <div className="cf-video-col">

                        <div
                            className={`cf-upload ${isDragging ? "dragging" : ""} ${videoPreview ? "has-video" : ""}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={() => setIsDragging(false)}
                        >

                            {videoPreview ? (

                                <>
                                    <video
                                        src={videoPreview}
                                        controls
                                        muted
                                        playsInline
                                    />

                                    <button
                                        type="button"
                                        className="cf-remove"
                                        onClick={removeVideo}
                                        aria-label="Remove video"
                                    >
                                        ×
                                    </button>
                                </>

                            ) : (

                                <label className="cf-upload-content">

                                    <div className="cf-upload-icon">↑</div>

                                    <h2>Upload your food reel</h2>

                                    <p>Drag & drop your video here</p>

                                    <span className="cf-or">or</span>

                                    <div className="cf-choose">Choose Video</div>

                                    <small>MP4, MOV • Portrait videos work best</small>

                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        hidden
                                    />

                                </label>

                            )}

                        </div>

                        {video && (
                            <div className="cf-file">
                                <span className="cf-file-name">{video.name}</span>
                                <span className="cf-file-size">{formatSize(video.size)}</span>
                            </div>
                        )}

                    </div>


                    {/* RIGHT SIDE - DETAILS */}

                    <form onSubmit={handleSubmit} className="cf-form">

                        <div className="cf-header">
                            <span>Create</span>
                            <h1>New Food Reel</h1>
                            <p>
                                Share a dish from your business with your customers.
                            </p>
                        </div>


                        <div className="cf-group">

                            <label htmlFor="cf-name">Food Name</label>

                            <input
                                id="cf-name"
                                type="text"
                                placeholder="e.g. Paneer Tikka"
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value)}
                            />

                        </div>


                        <div className="cf-group">

                            <div className="cf-label-row">
                                <label htmlFor="cf-desc">Description</label>
                                <span>{description.length}/{MAX_DESCRIPTION}</span>
                            </div>

                            <textarea
                                id="cf-desc"
                                placeholder="Tell customers a little about this dish..."
                                rows="5"
                                maxLength={MAX_DESCRIPTION}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                        </div>

<div className="cf-group">
    <label htmlFor="cf-price">Price (₹)</label>

    <input
        id="cf-price"
        type="number"
        placeholder="Enter price in rupees"
        min="1"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
    />
</div>


                        {/* LIVE INFO */}

                        <div className="cf-summary">

                            <div>
                                <span>Video</span>
                                <strong>
                                    {video ? video.name : "No video selected"}
                                </strong>
                            </div>

                            <div>
                                <span>Food</span>
                                <strong>
                                    {foodName || "Not added yet"}
                                </strong>
                            </div>

                        </div>


                        {error && (
                            <div className="cf-error">{error}</div>
                        )}


                        <button
                            className="cf-submit"
                            type="submit"
                            disabled={!video || !foodName.trim() || uploading}
                        >
                            {uploading ? (
                                <>
                                    <span className="cf-spinner" />
                                    Uploading...
                                </>
                            ) : (
                                "Create Food Reel"
                            )}
                        </button>

                    </form>

                </div>

            </div>

        </div>

    )
}

export default CreateFood;