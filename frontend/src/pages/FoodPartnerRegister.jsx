import "../styles/auth.css";
import "../styles/theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FoodPartnerRegister() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const ownerName = e.target.ownerName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const profileImage = e.target.profileImage.files[0];

    const formdata = new FormData();

    formdata.append("businessName", businessName);
    formdata.append("ownerName", ownerName);
    formdata.append("email", email);
    formdata.append("password", password);

    if (profileImage) {
      formdata.append("profileImage", profileImage);
    }
    const response = await axios
      .post("http://localhost:3000/api/auth/food-partner/register", formdata, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/create-food");
      })
      .catch((error) => {
        console.log("There was an error registering", error);
      });
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>PlateFull</h1>
          <p>Bring your food to more people.</p>
        </div>

        <div className="auth-header">
          <h2>Become a Food Partner</h2>
          <p>Create your partner account and grow your business.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter business name"
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Enter owner name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" name="profileImage" accept="image/*" required />
          </div>

          <button className="auth-button" type="submit">
            Create Partner Account
          </button>
        </form>

        <div className="auth-switch">
          Already a partner? <a href="/food-partner/login">Login</a>
        </div>

        <div className="partner-link">
          Want to order food? <a href="/user/register">Register as User</a>
        </div>
      </div>
    </div>
  );
}

export default FoodPartnerRegister;
