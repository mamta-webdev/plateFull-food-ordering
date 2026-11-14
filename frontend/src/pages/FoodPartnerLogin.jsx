import "../styles/auth.css";
import "../styles/theme.css";
import axios from "axios"
import { useNavigate } from "react-router-dom"
function FoodPartnerLogin() {
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("http://localhost:3000/api/auth/food-partner/login",{
      email, password
    },{
      withCredentials: true
    }).then(response=>{
      console.log(response.data)
      navigate("/food-partner/dashboard")
    }).catch(error=>{
      console.log("Status:", error.response?.status)
      console.log("Backend message:", error.response?.data)
    })
  }
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>Plateful</h1>
          <p>Grow your food business with us.</p>
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