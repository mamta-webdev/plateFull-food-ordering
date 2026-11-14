const express = require("express")
const cartController = require("../controllers/cart.controller")
const authMiddleware = require("../middleware/auth.Middleware")

const router = express.Router()

router.post("/add", authMiddleware.authUserMiddleware, cartController.addToCart)
router.get("/",authMiddleware.authUserMiddleware,cartController.getCart)
router.put("/update", authMiddleware.authUserMiddleware, cartController.updateCartItem);
router.delete("/remove",authMiddleware.authUserMiddleware, cartController.removeFromCart)
module.exports  = router
