import "../styles/auth.css";
import "../styles/theme.css";
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import API_BASE from "../config.js/api"
import toast from "react-hot-toast";

function UserLogin() {
  const navigate = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value
    const response = await axios.post(`${API_BASE}/api/auth/user/login`,{
      email,password
    },{
      withCredentials : true
    }).then(response=>{
      console.log(response.data)
      navigate("/")
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
          <p>Good food, good mood.</p>
        </div>

        <div className="auth-role-toggle" role="navigation" aria-label="Account type">
          <Link to="/user/login" className="active" aria-current="page">Customer</Link>
          <Link to="/food-partner/login">Food Partner</Link>
        </div>

        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Login to continue ordering your favourite food.</p>
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
          Don't have an account?{" "}
          <a href="/user/register">Register</a>
        </div>

        <div className="partner-link">
          Are you a food partner?{" "}
          <a href="/food-partner/login">
            Login as Food Partner
          </a>
        </div>

      </div>
    </div>
  );
}

export default UserLogin;