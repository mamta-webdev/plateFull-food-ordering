const express = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.Middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router()

//user auth api's
router.post("/user/register",authController.registerUser)
router.post("/user/login", authController.loginUser)
router.get("/user/logout",authController.logoutUser)
router.get("/user/profile",authMiddleware.authUserMiddleware, authController.getMyProfile)

//food-partner auth api's
router.post("/food-partner/register", upload.single("profileImage"), authController.registerfoodPartner)
router.post("/food-partner/login", authController.loginfoodPartner)
router.post("/food-partner/logout", authController.logoutfoodPartner)

module.exports = router