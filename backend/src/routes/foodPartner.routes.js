const express = require("express")
const multer = require("multer")

const foodPartnerController = require("../controllers/foodPartner.controller")
const foodModel = require("../models/foodItem.model")
const authMiddleware = require("../middleware/auth.Middleware")

const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage()
})

/* GET /api/food-partner/profile [profile used by food partners] */
router.get("/profile",authMiddleware.authFoodPartnerMiddleware, foodPartnerController.getMyProfile)

/* GET /api/food-partner/:id         [foodPartner profile used by normal users*/
router.get("/:id",authMiddleware.authUserMiddleware, foodPartnerController.getFoodPartnerById)

/*PUT /api/food-partner/profile */
router.put("/profile",authMiddleware.authFoodPartnerMiddleware,upload.single("profileImage"),
(req, res, next) => {
    console.log("🔥 MULTER ROUTE HIT")
    console.log("MULTER FILE:", req.file)
    console.log("MULTER BODY:", req.body)
    next()
},foodPartnerController.updateMyProfile)

/*POST /api/food-partner/logout */
router.post("/logout",foodPartnerController.logoutFoodPartner)

module.exports = router