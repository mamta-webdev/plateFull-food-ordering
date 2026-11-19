const foodmodel = require("../models/foodItem.model")
const storageService = require("../services/storage.service")
const likeModel = require("../models/likes.model")
const foodModel = require("../models/foodItem.model")
const saveModel = require("../models/save.model")
const commentModel = require("../models/Comment.model")


async function createFood(req,res){
    console.log(req.foodPartner)
    // console.log(req.file)
    const fileUploadResult = await storageService.uploadFiles(req.file.buffer, "baked-cookies")
    // console.log(fileUploadResult)
    // console.log(req.body)

    const foodItem = await foodmodel.create({
        name: req.body.name,
        description: req.body.description,
        price:Number(req.body.price),
        videoUrl: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "Food created successfully",
        food : foodItem
    })
}

async function getFoodItems(req, res) {

    console.log("DATABASE:", foodmodel.db.name);
console.log("COLLECTION:", foodmodel.collection.name);

    const foodItems = await foodmodel.find({})

    const foodItemsWithComments = await Promise.all(
        foodItems.map(async (food) => {

            const commentCount = await commentModel.countDocuments({
                food: food._id
            })

            return {
                ...food.toObject(),
                commentCount
            }

        })
    )

    res.status(200).json({
        message: "food Items Fetched successfully",
        foodItems: foodItemsWithComments
    })
}
async function likeFood(req, res) {

    const { foodId } = req.body

    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({

        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {

        await likeModel.deleteOne({

            user: user._id,
            food: foodId
        })

        const food = await foodModel.findOneAndUpdate(
            {
                _id: foodId,
                likeCount: { $gt: 0 }
            },
            {
                $inc: { likeCount: -1 }
            },
            {
                new: true
            }
        )

        return res.status(200).json({

            message: "Food unliked successfully",
            like: false,
            likeCount: food ? food.likeCount : 0

        })
    }

    await likeModel.create({
        user: user._id,
        food: foodId
    })

    const food = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: 1 } },
        { new: true }
    )

    return res.status(201).json({

        message: "Food liked successfully",
        like: true,
        likeCount: food.likeCount
    })
}

async function saveFood(req, res) {

    const { foodId } = req.body

    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {

        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        return res.status(200).json({
            message: "food unsaved successfully",
            saved: 0
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    return res.status(201).json({
        message: "Food saved successfully",
        saved: 1
    })
}

async function getSavedFood(req,res){
    console.log("REQ.USER:", req.user)
    console.log("USER _id:", req.user?._id)
    console.log("USER id:", req.user?.id)
    const user = req.user
    const savedFoods = await saveModel.find({user:user._id}).populate('food')

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({
            message:"No Saved Foods Found.."
        })
    }

    res.status(200).json({
        message:"Retrived saved foods successfully..",
        savedFoods,
    })
}

async function addComment(req,res){
    console.log("REQ BODY:", req.body)
    const { foodId, comment } = req.body
    const  user  = req.user

    if(!comment || comment.trim() === ""){
        return res.status(400).json({
            message:"Comment cannot be empty"
        })
    }

    const newComment = await commentModel.create({
        user: user._id,
        food: foodId,
        comment: comment
    })
    return res.status(201).json({
        message: "Comment added successfully",
        comment : newComment
    })
}

async function getComment(req,res){
    const { foodId } = req.params

    const comments = await commentModel.find({
        food: foodId,
    }).populate("user","name")

    return res.status(200).json({
        message: "comment created successfully",
        comments
    })
}

async function updateFood(req,res){
    const {foodId} = req.params
    const {name, description } = req.body

    const food = await foodModel.findOne({
        _id: foodId,
        foodPartner: req.foodPartner._id
    })

    if(!food){
        return res.status(404).json({
            message: "Food not found or you are not authorized"
        })
    }

    food.name = name
    food.description = description

    await food.save()

    return res.status(200).json({
        message: "Food Updated successfully",
        food
    })
}

async function deleteFood(req,res){
    const {foodId} = req.params
    
    const food = await foodModel.findOne({
        _id: foodId,
        foodPartner: req.foodPartner._id
    })
    if(!food){
        return res.status(404).json({
            message:"Food not found or you are not authorized"
        })
    }
    await foodModel.deleteOne({
        _id: foodId
    })
    await commentModel.deleteMany({
        food: foodId
    })
    await saveModel.deleteMany({
        food: foodId
    })
    await likeModel.deleteMany({
        food:foodId
    })
    return res.status(200).json({
        message: "Food deleted successfully."
    })
}

module.exports = {
    createFood,getFoodItems,likeFood,saveFood,getSavedFood,addComment,getComment,updateFood, deleteFood
}