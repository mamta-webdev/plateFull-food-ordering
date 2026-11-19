import "../styles/auth.css";
import "../styles/theme.css";
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast";
import API_BASE from "../config.js/api"

function FoodPartnerLogin() {
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post(`${API_BASE}/api/auth/food-partner/login`,{
      email, password
    },{
      withCredentials: true
    }).then(response=>{
      console.log(response.data)
      navigate("/food-partner/dashboard")
    }).catch(error => {
    const message =
        error.response?.data?.message ||
        "Invalid email or password. Please try again."

    toast.error(message)
})
  }
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>PlateFull</h1>
          <p>Grow your food business with us.</p>
        </div>

        <div className="auth-role-toggle" role="navigation" aria-label="Account type">
          <Link to="/user/login">Customer</Link>
          <Link to="/food-partner/login" className="active" aria-current="page">Food Partner</Link>
        </div>

        <div className="auth-header">
          <h2>Welcome back, Partner</h2>
          <p>Login to manage your food business.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>

          <button className="auth-button" type="submit">
            Login
          </button>

        </form>

        <div className="auth-switch">
          New to PlateFull?{" "}
          <a href="/food-partner/register">
            Register
          </a>
        </div>

        <div className="partner-link">
          Looking to order food?{" "}
          <a href="/user/login">
            Login as User
          </a>
        </div>

      </div>
    </div>
  );
}

export default FoodPartnerLogin;