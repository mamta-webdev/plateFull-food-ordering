import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../config.js/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBookmark,
  faRightFromBracket,
  faChevronRight,
  faArrowLeft,
  faTriangleExclamation,
  faReceipt,
  faLocationDot,
  faCircleQuestion,
  faPen,
  faHouse,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/UserProfile.css";

/* ------------------------------------------------------------------
   TODO: fill in YOUR existing routes (paths start with /api/...).
   I could not see your auth routes file, so I did not guess them.

   GET_USER_PATH  -> your existing "get the logged-in user" route
   LOGOUT_PATH    -> your existing user logout route (uses logoutUser)
   LOGOUT_METHOD  -> "get" or "post", whichever your route uses
------------------------------------------------------------------- */

const GET_USER_PATH = "/api/auth/user/profile";
const LOGOUT_PATH = "/api/auth/user/logout";
const LOGOUT_METHOD = "get";

const NOT_SET_MESSAGE =
  "This endpoint is not set yet. See the TODO at the top of UserProfile.jsx.";
/* Set a path once that page exists. null = shows a "Soon" tag and does nothing. */
const ROUTES = {
  orders: "/cart", // e.g. "/orders"
  saved: "/saved",
  cart: "/cart",
  addresses: "/checkout", // e.g. "/addresses"
  help: null, // e.g. "/help"
  edit: "/profile/edit", // e.g. "/profile/edit"
  search: null, // e.g. "/search"  (the Search tab is hidden while this is null)
};

/* e.g. "mailto:you@example.com". The "Contact support" link is hidden while this is null. */
const SUPPORT_HREF = null;

/* One action row. Rows without a route are visibly "Soon" and do not navigate. */
const ActionRow = ({ icon, title, sub, to, navigate }) => {
  const ready = Boolean(to);

  return (
    <button
      type="button"
      className="up-action"
      onClick={() => ready && navigate(to)}
      aria-disabled={!ready}
      title={ready ? undefined : "Coming soon"}
    >
      <span className="up-action-icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="up-action-text">
        <strong>{title}</strong>
        <small>{sub}</small>
      </span>
      {ready ? (
        <FontAwesomeIcon icon={faChevronRight} className="up-chevron" />
      ) : (
        <span className="up-soon">Soon</span>
      )}
    </button>
  );
};

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    ordersThisMonth: 0,
  });
  const [savedCount, setSavedCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!GET_USER_PATH) {
        setError(NOT_SET_MESSAGE);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}${GET_USER_PATH}`, {
          withCredentials: true,
        });
        setUser(response.data.user || response.data);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Please login to continue."
            : "Could not load your profile. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  //fetches the order statistics and cart data
  useEffect(() => {
    const loadProfileStats = async () => {
      try {
        const [ordersResponse, cartResponse, savedResponse] = await Promise.all(
          [
            axios.get(`${API_BASE}/api/orders/my-orders`, {
              withCredentials: true,
            }),
            axios.get(`${API_BASE}/api/cart`, {
              withCredentials: true,
            }),
            axios.get(`${API_BASE}/api/food/save`, {
              withCredentials: true,
            }),
          ],
        );

        setOrderStats(
          ordersResponse.data.stats || {
            totalOrders: 0,
            totalSpent: 0,
            ordersThisMonth: 0,
          },
        );

        const items = cartResponse.data.cart?.items || [];

        const totalQuantity = items.reduce(
          (total, item) => total + Number(item.quantity || 0),
          0,
        );

        setCartCount(totalQuantity);
        setSavedCount(savedResponse.data.savedFoods?.length || 0);
      } catch (error) {
        console.error("Unable to load profile statistics:", error);
      }
    };

    loadProfileStats();
  }, []);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setProfileError("");

    if (!editName.trim()) {
      setProfileError("Please enter your name.");
      return;
    }

    try {
      setSavingProfile(true);

      let updatedProfilePhoto = user.profilePhoto || "";

      // Step 1: Upload the selected photo to ImageKit
      if (selectedPhoto) {
        const formData = new FormData();
        formData.append("profilePhoto", selectedPhoto);

        const photoResponse = await axios.post(
          `${API_BASE}/api/auth/user/profile/photo`,
          formData,
          { withCredentials: true },
        );

        updatedProfilePhoto = photoResponse.data.profilePhoto;
      }

      // Step 2: Save the profile details
      const response = await axios.put(
        `${API_BASE}/api/auth/user/profile`,
        {
          name: editName.trim(),
          phone: editPhone.trim(),
          address: editAddress.trim(),
          profilePhoto: updatedProfilePhoto,
        },
        { withCredentials: true },
      );

      setUser((previousUser) => ({
        ...previousUser,
        ...response.data.user,
      }));

      setSelectedPhoto(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setProfileError(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    if (!LOGOUT_PATH) {
      setLogoutError(NOT_SET_MESSAGE);
      return;
    }

    setLoggingOut(true);
    setLogoutError("");

    try {
      await axios({
        method: LOGOUT_METHOD,
        url: `${API_BASE}${LOGOUT_PATH}`,
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      setLogoutError("Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="up-page">
        <div className="up-center">
          <span className="up-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
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
    );
  }

  const name = user.name || user.fullName || "User";

  /* Real values only. Missing data shows "–" instead of a made-up number. */
  const stats = [
    {
      long: "Orders placed",
      short: "Orders",
      value: orderStats.totalOrders,
    },
    {
      long: "Saved dishes",
      short: "Saved",
      value: savedCount,
    },
    {
      long: "Items in cart",
      short: "In cart",
      value: cartCount,
    },
  ];

  const tabs = [
    { label: "Home", icon: faHouse, to: "/" },
    ROUTES.search && {
      label: "Search",
      icon: faMagnifyingGlass,
      to: ROUTES.search,
    },
    { label: "Cart", icon: faCartShopping, to: ROUTES.cart },
    { label: "Profile", icon: faUser, active: true },
  ].filter(Boolean);

  return (
    <div className="up-page">
      <div className="up-banner" aria-hidden="true" />

      <button
        type="button"
        className="up-back"
        aria-label="Back to home"
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> <span>Home</span>
      </button>

      <span className="up-topbar-title" aria-hidden="true">
        Profile
      </span>

      <div className="up-card">
        {/* PROFILE HEADER */}

        {/* <div className="up-header">
                    <div className="up-avatar">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <div className="up-identity">
                        <h1 className="up-name">{name}</h1>
                        <p className="up-email">{user.email}</p>
                    </div>

                    <button
                        type="button"
                        className="up-edit"
                        onClick={() => editReady && navigate(ROUTES.edit)}
                        aria-disabled={!editReady}
                        title={editReady ? undefined : "Coming soon"}
                    >
                        <FontAwesomeIcon icon={faPen} />
                        <span>Edit<span className="up-edit-more"> profile</span></span>
                    </button>
                </div> */}

        {/* PROFILE HEADER / EDIT PROFILE */}

        {isEditing ? (
          <form className="up-header up-edit-form" onSubmit={handleSaveProfile}>
            <div className="up-identity" style={{ flex: 1, minWidth: 0 }}>
              <h1 className="up-name">Edit Profile</h1>
              <p className="up-email">{user.email}</p>

              <label htmlFor="up-edit-name">Full Name</label>
              <input
                id="up-edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                maxLength={60}
                required
              />

              <label htmlFor="up-edit-phone">Phone Number</label>
              <input
                id="up-edit-phone"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Enter your phone number"
              />

              <label htmlFor="up-edit-address">Address</label>
              <textarea
                id="up-edit-address"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Enter your delivery address"
                rows={3}
              />

              <label htmlFor="up-edit-photo">Profile Photo</label>
              <input
                id="up-edit-photo"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
              />

              {selectedPhoto && (
                <p className="up-photo-selected">
                  Selected: {selectedPhoto.name}
                </p>
              )}

              {profileError && (
                <p role="alert" className="up-profile-error">
                  {profileError}
                </p>
              )}

              <div className="up-confirm-actions">
                <button
                  type="submit"
                  className="up-edit"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="up-confirm-cancel"
                  onClick={() => {
                    setEditName(name);
                    setEditPhone(user.phone || "");
                    setEditAddress(user.address || "");
                    setSelectedPhoto(null);
                    setProfileError("");
                    setIsEditing(false);
                  }}
                  disabled={savingProfile}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="up-header">
            <div className="up-avatar">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="up-avatar-image"
                />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="up-identity">
              <h1 className="up-name">{name}</h1>
              <p className="up-email">{user.email}</p>
            </div>

            <button
              type="button"
              className="up-edit"
              onClick={() => {
                setEditName(name);
                setEditPhone(user.phone || "");
                setEditAddress(user.address || "");
                setSelectedPhoto(null);
                setProfileError("");
                setIsEditing(true);
              }}
            >
              <FontAwesomeIcon icon={faPen} />
              <span>
                Edit<span className="up-edit-more"> profile</span>
              </span>
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="up-stats">
          {stats.map((item) => (
            <div className="up-stat" key={item.short}>
              <strong className="up-stat-value">{item.value}</strong>

              <span className="up-stat-label up-label-long">{item.long}</span>

              <span className="up-stat-label up-label-short">{item.short}</span>
            </div>
          ))}
        </div>

        {logoutError && (
          <div className="up-alert">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{logoutError}</span>
          </div>
        )}

        {/* DESKTOP ACTIONS (2 x 2 grid + footer) */}

        <div className="up-desktop-only">
          <div className="up-grid">
            <ActionRow
              icon={faReceipt}
              title="My Orders"
              sub="Track and reorder"
              to={ROUTES.orders}
              navigate={navigate}
            />
            <ActionRow
              icon={faBookmark}
              title="Saved Food"
              sub="View your saved food"
              to={ROUTES.saved}
              navigate={navigate}
            />
            <ActionRow
              icon={faCartShopping}
              title="My Cart"
              sub="Review items before checkout"
              to={ROUTES.cart}
              navigate={navigate}
            />
            <ActionRow
              icon={faLocationDot}
              title="Addresses"
              sub="Manage delivery spots"
              to={ROUTES.addresses}
              navigate={navigate}
            />
          </div>

          <div className="up-footer">
            {SUPPORT_HREF && (
              <p className="up-help">
                Need help? <a href={SUPPORT_HREF}>Contact support</a>
              </p>
            )}

            {!confirmLogout && (
              <button
                type="button"
                className="up-logout-btn"
                onClick={() => setConfirmLogout(true)}
              >
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </button>
            )}
          </div>
        </div>

        {/* MOBILE ACTIONS (grouped list) */}

        <div className="up-mobile-only">
          <p className="up-group-label">ACCOUNT</p>
          <div className="up-list">
            <ActionRow
              icon={faReceipt}
              title="My Orders"
              sub="Track and reorder"
              to={ROUTES.orders}
              navigate={navigate}
            />
            <ActionRow
              icon={faBookmark}
              title="Saved Food"
              sub="Your favourites"
              to={ROUTES.saved}
              navigate={navigate}
            />
            <ActionRow
              icon={faLocationDot}
              title="Addresses"
              sub="Manage delivery spots"
              to={ROUTES.addresses}
              navigate={navigate}
            />
          </div>

          <p className="up-group-label">MORE</p>
          <div className="up-list">
            <ActionRow
              icon={faCircleQuestion}
              title="Help & support"
              sub="We are here to help"
              to={ROUTES.help}
              navigate={navigate}
            />

            {!confirmLogout && (
              <button
                type="button"
                className="up-action up-logout"
                onClick={() => setConfirmLogout(true)}
              >
                <span className="up-action-icon">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </span>
                <span className="up-action-text">
                  <strong>Logout</strong>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* LOGOUT CONFIRMATION (shared by both layouts) */}

        {confirmLogout && (
          <div
            className="up-confirm"
            role="alertdialog"
            aria-labelledby="up-confirm-title"
          >
            <p id="up-confirm-title">Log out of Plateful?</p>
            <div className="up-confirm-actions">
              <button
                type="button"
                className="up-confirm-cancel"
                onClick={() => setConfirmLogout(false)}
                disabled={loggingOut}
                autoFocus
              >
                Stay
              </button>
              <button
                type="button"
                className="up-confirm-yes"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Yes, log out"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM TAB BAR */}

      <nav className="up-tabbar" aria-label="Main">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className="up-tab"
            aria-current={tab.active ? "page" : undefined}
            onClick={() => !tab.active && navigate(tab.to)}
          >
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
export default UserProfile;
