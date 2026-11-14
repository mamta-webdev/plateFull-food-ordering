import "../styles/auth.css";
import "../styles/theme.css";
import axios from 'axios'
import {useNavigate } from "react-router-dom"

function UserRegister() {

  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value


    const response = await axios.post('http://localhost:3000/api/auth/user/register',{
      name, email, password
    },{
      withCredentials: true
    })
    console.log(response.data)
    navigate("/")
  }
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>PlateFull</h1>
          <p>Good food, good mood.</p>
        </div>

        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Join Plateful and discover great food around you.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
            />
          </div>

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
              name= "password"
              placeholder="Create a password"
            />
          </div>

          <button className="auth-button" type="submit">
            Create Account
          </button>

        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <a href="/user/login">Login</a>
        </div>

        <div className="partner-link">
          Want to join plateful as a food partner?{" "}
          <a href="/food-partner/register">
            Register as Food Partner
          </a>
        </div>

      </div>
    </div>
  );
}

export default UserRegister;