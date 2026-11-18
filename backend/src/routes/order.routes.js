const express = require("express")
const orderController = require("../controllers/order.controller")
const authMiddleware = require("../middleware/auth.Middleware")

const router = express.Router()

router.post("/checkout",authMiddleware.authUserMiddleware, orderController.checkout)
router.get(
    "/my-orders",
    authMiddleware.authUserMiddleware,
    orderController.getMyOrders
);


module.exports = router;