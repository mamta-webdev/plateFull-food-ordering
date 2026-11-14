import "../styles/auth.css";
import "../styles/theme.css";
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

function UserLogin() {
  const navigate = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value
    const response = await axios.post("http://localhost:3000/api/auth/user/login",{
      email,password
    },{
      withCredentials : true
    }).then(response=>{
      console.log(response.data)
      navigate("/")
    }).catch(error=>{
      console.log("Status:", error.response?.status)
      console.log("Backend message:", error.response?.data)
    })

  }
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>PlateFull</h1>
          <p>Good food, good mood.</p>
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