import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/foodPartnerDashboard.css";
import API_BASE from "../../config.js/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUtensils,
  faCirclePlus,
  faUserPen,
  faRightFromBracket,
  faHeart,
  faComment,
  faBookmark,
  faPen,
  faTrash,
  faEnvelope,
  faLocationDot,
  faUser,
  faFilm,
  faCamera,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const PROFILE_FIELDS = [
  { key: "businessName",label: "Business Name",type: "text",icon: faUtensils,},
  { key: "ownerName", label: "Owner Name", type: "text", icon: faUser },
  { key: "email", label: "Email", type: "email", icon: faEnvelope },
  { key: "address", label: "Address", type: "text", icon: faLocationDot },
]

/* ---------- SMALL COMPONENTS ---------- */

const StatCard = ({ stat }) => (
  <div className="fpd-stat">
    <div className={`fpd-stat-icon ${stat.tone}`}>
      <FontAwesomeIcon icon={stat.icon} />
    </div>
    <strong>{stat.value.toLocaleString()}</strong>
    <span>{stat.label}</span>
    <small>{stat.note}</small>
  </div>
);

const MealCard = ({ meal, onEdit, onDelete }) => {
  const videoRef = useRef(null);

  return (
    <article
      className="fpd-meal"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <div className="fpd-meal-media">
        <video
          ref={videoRef}
          src={`${meal.video}#t=0.5`}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="fpd-meal-badge">
          <FontAwesomeIcon icon={faFilm} /> Reel
        </span>
      </div>

      <div className="fpd-meal-body">
        <h3>{meal.name}</h3>
        {meal.price != null && (
          <span className="fpd-meal-price">₹{meal.price}</span>
        )}
        <p>{meal.description}</p>

        <div className="fpd-meal-stats">
          <span>
            <FontAwesomeIcon icon={faHeart} /> {meal.likes.toLocaleString()}
          </span>
          <span>
            <FontAwesomeIcon icon={faComment} /> {meal.comments}
          </span>
          <span>
            <FontAwesomeIcon icon={faBookmark} /> {meal.saves}
          </span>
        </div>

        <div className="fpd-meal-actions">
          <button
            type="button"
            className="fpd-btn fpd-btn-soft"
            onClick={() => onEdit(meal)}
          >
            <FontAwesomeIcon icon={faPen} /> Edit
          </button>
          <button
            type="button"
            className="fpd-btn fpd-btn-danger"
            onClick={() => onDelete(meal)}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
};

const EditProfileModal = ({ profile, onSave, onClose }) => {
  const [draft, setDraft] = useState(profile);
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const update = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onSave(draft, imageFile);
  };

  return (
    <div
      className="fpd-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="fpd-modal" onSubmit={handleSaveProfile}>
        <div className="fpd-modal-head">
          <h2>Edit Profile</h2>
          <button
            type="button"
            className="fpd-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="fpd-modal-avatar">
          <div className="fpd-avatar">
            {imageFile ? (
              <img
                src={imagePreview} 
                alt="Profile Photo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 25%",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            ) : draft.profileImage ? (
              <img src={draft.profileImage} alt="Profile Photo" />
            ) : (
              draft.businessName.charAt(0) || "Z"
            )}
          </div>
          <label className="fpd-camera" aria-label="Change photo">
            <FontAwesomeIcon icon={faCamera} />

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                 const file = e.target.files[0]
                 setImageFile(file)
                 setImagePreview(URL.createObjectURL(file))
                }}
            />
          </label>
        </div>

        {PROFILE_FIELDS.map((field) => (
          <label className="fpd-field" key={field.key}>
            <span>{field.label}</span>
            <div>
              <FontAwesomeIcon icon={field.icon} />
              <input
                type={field.type}
                value={draft[field.key]}
                onChange={update(field.key)}
              />
            </div>
          </label>
        ))}

        <div className="fpd-modal-actions">
          <button
            type="button"
            className="fpd-btn fpd-btn-soft"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="fpd-btn fpd-btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- MAIN DASHBOARD ---------- */

const FoodPartnerDashboard = () => {
  const [profile, setProfile] = useState({});
  const [meals, setMeals] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const mealsRef = useRef(null);
  const navigate = useNavigate();


  /*profile-fetching useEffect */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/food-partner/profile`,
          { withCredentials: true },
        );
        console.log("DASHBOARD PROFILE RESPONSE:", response.data);
        setProfile(response.data.foodPartner);
        setMeals(response.data.foodItem || []);
      } catch (error) {
        console.log("DASHBOARD PROFILE ERROR:", error);
      }
    };
    fetchProfile();
  }, []);


  const handleEdit = (meal) => {
    setEditingMeal(meal);
  };

  const handleDelete = async (meal) => {
    if (!window.confirm(`Delete "${meal.name}"? This cannot be undone.`)) return;
    try {
      const response = await axios.delete(
        `${API_BASE}/api/food/delete/${meal.id}`,
        { withCredentials: true },
      );
      // console.log("DELETE FOOD:", response.data)

      setMeals((prevMeals) => prevMeals.filter((item) => item._id != meal.id));
    } catch (error) {
      console.log("Delete Food error:", error.response?.data || error);
    }
  };
  const handleUpdateFood = async () => {
    try {
      const response = await axios.put(
        `${API_BASE}/api/food/update/${editingMeal.id}`,
        {
          name: editingMeal.name,
          description: editingMeal.description,
        },
        {
          withCredentials: true,
        },
      );
      // console.log("FOOD UPDATED:", response.data)

      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal._id === editingMeal.id
            ? {
                ...meal,
                name: editingMeal.name,
                description: editingMeal.description,
              }
            : meal,
        ),
      );
      setEditingMeal(null);
    } catch (error) {
      console.log("UPDATE FOOD ERROR:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/food-partner/logout`,
        {},
        { withCredentials: true },
      );
      // console.log("LOGOUT RESPONSE:", response.data)
      navigate("/");
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  
  const totalMeals = meals.length;
  const totalLikes = meals.reduce((sum, meal) => sum + (meal.likeCount || 0), 0);
  const totalComments = meals.reduce(
    (sum, meal) => sum + (meal.commentCount || 0),
    0,
  );
  const totalSaves = meals.reduce(
    (sum, meal) => sum + (meal.saveCount || 0),
    0,
  );

  const STATS = [
    {
      label: "Total Meals",
      value: totalMeals,
      icon: faUtensils,
      tone: "blue",
      note: "Your posted meals",
    },
    {
      label: "Total Likes",
      value: totalLikes,
      icon: faHeart,
      tone: "pink",
      note: "Likes on your meals",
    },
    {
      label: "Total Comments",
      value: totalComments,
      icon: faComment,
      tone: "indigo",
      note: "Comments on your meals",
    },
    {
      label: "Total Saves",
      value: totalSaves,
      icon: faBookmark,
      tone: "amber",
      note: "Saves on your meals",
    },
  ];

  const NAV = [
    { label: "Dashboard", icon: faChartLine, active: true },
    {
      label: "My Meals",
      icon: faUtensils,
      onClick: () => mealsRef.current?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Add Food",
      icon: faCirclePlus,
      onClick: () => navigate("/create-food"),
    },
    { label: "Edit Profile", icon: faUserPen, onClick: () => setEditing(true) },
    { label: "Logout", icon: faRightFromBracket, logout: true },
  ];

  return (
    <div className="fpd-root">
      {/* SIDEBAR / BOTTOM BAR ON MOBILE */}

      <aside className="fpd-sidebar">
        <div className="fpd-brand">
          <span className="fpd-brand-mark">🍴</span>
          <span className="fpd-brand-name">PlateFull</span>
        </div>

        <nav className="fpd-nav">
          {NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              title={item.label}
              className={`fpd-nav-item ${item.active ? "active" : ""} ${item.logout ? "fpd-nav-logout" : ""}`}
              onClick={item.logout ? handleLogout : item.onClick}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="fpd-main">
        {/* PROFILE HEADER */}

        <header className="fpd-profile">
          <div className="fpd-cover" />

          <div className="fpd-profile-body">
            <div className="fpd-avatar fpd-dashboard-avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" />
              ) : (
                profile.businessName?.charAt(0) || "Z"
              )}
            </div>

            <div className="fpd-profile-info">
              <h1>{profile.businessName}</h1>

              <p className="fpd-owner">
                <FontAwesomeIcon icon={faUser} /> {profile.ownerName}
              </p>

              <div className="fpd-meta">
                <span>
                  <FontAwesomeIcon icon={faEnvelope} /> {profile.email}
                </span>
                <span>
                  <FontAwesomeIcon icon={faLocationDot} />{" "}
                  {profile.address || (
                    <button
                      type="button"
                      className="fpd-link-btn"
                      onClick={() => setEditing(true)}
                    >
                      Add your address
                    </button>
                  )}
                </span>
              </div>
            </div>

            <div className="fpd-profile-actions">
              <button
                type="button"
                className="fpd-btn fpd-btn-primary"
                onClick={() => setEditing(true)}
              >
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            </div>
          </div>
        </header>

        {/* STATISTICS */}

        <section className="fpd-stats">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        {/* MY MEALS */}

        <section ref={mealsRef} className="fpd-meals-section">
          <div className="fpd-section-head">
            <div className="fpd-section-title">
              <h2>My Meals</h2>
              <span className="fpd-count">{meals.length}</span>
            </div>

            <button
              type="button"
              className="fpd-btn fpd-btn-add"
              onClick={() => navigate("/create-food")}
            >
              + Add Food
            </button>
          </div>

          <div className="fpd-meals-grid">
            {meals.map((meal) => (
              <MealCard
                key={meal._id}
                meal={{
                  id: meal._id,
                  name: meal.name,
                  description: meal.description,
                  price: meal.price,
                  video: meal.videoUrl,
                  likes: meal.likeCount || 0,
                  comments: meal.commentCount || 0,
                  saves: meal.saveCount || 0,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {editingMeal && (
            <div className="fpd-edit-form">
              <h2>Edit Food</h2>

              <input
                type="text"
                value={editingMeal.name}
                onChange={(e) =>
                  setEditingMeal({
                    ...editingMeal,
                    name: e.target.value,
                  })
                }
              />

              <textarea
                value={editingMeal.description}
                onChange={(e) =>
                  setEditingMeal({
                    ...editingMeal,
                    description: e.target.value,
                  })
                }
              />

              <div className="fpd-edit-actions">
                <button
                  type="button"
                  className="fpd-btn fpd-btn-soft"
                  onClick={() => setEditingMeal(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="fpd-btn fpd-btn-add"
                  onClick={() => handleUpdateFood()}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {editing && (
        <EditProfileModal
          profile={profile}
          onSave={async (updatedProfile, imageFile) => {
            try {
              const formData = new FormData();

              formData.append("businessName", updatedProfile.businessName);
              formData.append("ownerName", updatedProfile.ownerName);
              formData.append("email", updatedProfile.email);
              formData.append("address", updatedProfile.address);

              if (imageFile) {
                formData.append("profileImage", imageFile);
              }

              const response = await fetch(
                `${API_BASE}/api/food-partner/profile`,
                {
                  method: "PUT",
                  body: formData,
                  credentials: "include",
                },
              );

              const data = await response.json();

              // console.log("PROFILE UPDATED:", data)

              setProfile(data.foodPartner);
              setEditing(false);
            } catch (error) {
              console.log("Updated profile error", error);
            }
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
};

export default FoodPartnerDashboard;