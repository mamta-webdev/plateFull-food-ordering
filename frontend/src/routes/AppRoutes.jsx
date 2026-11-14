import React from "react"
import {BrowserRouter as Router, Route, Routes } from "react-router-dom"
import UserRegister from "../pages/UserRegister"
import UserLogin from "../pages/Userlogin"
import FoodPartnerRegister from "../pages/FoodPartnerRegister"
import FoodPartnerLogin from "../pages/FoodPartnerLogin"
import Home from "../pages/general/Home"
import CreateFood from "../pages/food-partner/CreateFood"
import Profile from "../pages/food-partner/Profile"
import SavedFood from "../pages/general/SavedFood"
import FoodPartnerDashboard from "../pages/food-partner/foodPartnerDashboard"
import UserProfile from "../pages/user/UserProfile"
import Cart from "../pages/general/Cart"

const AppRoutes = () =>{
    return (
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/profile" element={<UserProfile />}/>
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={ <FoodPartnerLogin />}/>
                <Route path="/" element={<Home />}/>
                <Route path="/create-food" element={<CreateFood />}/>
                <Route path="/food-partner/dashboard" element={<FoodPartnerDashboard />}/>
                <Route path="/food-partner/:id" element={<Profile />}/>
                <Route path="/saved" element={<SavedFood />}/>
                <Route path="/cart" element={<Cart />}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes;