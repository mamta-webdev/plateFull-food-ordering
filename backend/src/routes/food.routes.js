const express = require("express")
const foodController = require("../controllers/food.Controller")
const authMiddleware = require("../middleware/auth.Middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router()

/**  POST /api/food/  [protected] -------this api will add a food item in our database and only foodPartner can add food items , users can only order food items can't add*/
router.post("/", authMiddleware.authFoodPartnerMiddleware, upload.single("video"),foodController.createFood)

/* GET /api/food/  [protected]*/ 
router.get("/", foodController.getFoodItems)

/* POST /api/food/like */
router.post("/like",authMiddleware.authUserMiddleware, foodController.likeFood)

/*Post /api/food/save */
router.post("/save",authMiddleware.authUserMiddleware,foodController.saveFood)

/* GET /api/food/save */
router.get("/save",authMiddleware.authUserMiddleware, foodController.getSavedFood)


/* POST /api/food/addComment */
router.post("/add-comment",authMiddleware.authUserMiddleware, foodController.addComment)

/* GET /api/food/getComment */
router.get("/get-comment/:foodId",foodController.getComment)

/*PUT /api/food/update */
router.put("/update/:foodId",authMiddleware.authFoodPartnerMiddleware,foodController.updateFood)

/* POST /api/food/delete */
router.delete("/delete/:foodId",authMiddleware.authFoodPartnerMiddleware, foodController.deleteFood)


module.exports = router