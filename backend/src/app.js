const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const foodRoutes = require("./routes/food.routes")
const cors = require("cors")
const foodPartnerRoutes = require("./routes/foodPartner.routes")
const cartRoutes = require("./routes/cart.routes")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", (req,res)=>{
    res.send("Hello world")
})

app.use("/api/auth", authRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/food-partner", foodPartnerRoutes)
app.use("/api/cart", cartRoutes)

module.exports = app