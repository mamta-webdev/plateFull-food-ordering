const foodPartnerModel = require("../models/foodPartner.model")
const foodModel = require("../models/foodItem.model")
const commentModel = require("../models/Comment.model")
const saveModel = require("../models/save.model")
const storageService = require("../services/storage.service")


async function getFoodPartnerById(req, res) {

    const { id } = req.params

    const foodPartner = await foodPartnerModel.findById(id)

    const foodItems = await foodModel.find({
        foodPartner: id
    })
    if(!foodPartner){
        return res.status(404).json({
            message:"food Partner not found"
        })
    }

    return res.status(200).json({
        message: "food Partner retrieved successfully",
        foodPartner,
        foodItems
    })
}

async function getMyProfile(req,res){
    const foodPartnerId = req.foodPartner._id
    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }

    const foodItems = await foodModel.find({
        foodPartner: foodPartnerId
    })

    const foodItemsWithStats = await Promise.all(
        foodItems.map(async (food) =>{
            const commentCount = await commentModel.countDocuments({food: food._id})
            const saveCount = await saveModel.countDocuments({food: food._id})

            return {
                ...food.toObject(),
                commentCount,
                saveCount
            }
        })
    )
    

    return res.status(200).json({
        message: "Food Partner Profile retrieved successfully",
        foodPartner,
        foodItem: foodItemsWithStats
    })
}

async function updateMyProfile(req,res){
    const foodPartnerId = req.foodPartner._id
    let profileImage = req.body.profileImage

    if(req.file){
        const result = await storageService.uploadFiles(
            req.file.buffer,
            `profile-${foodPartnerId}-${Date.now()}`
        )
        profileImage = result.url
    }
    const foodPartner = await foodPartnerModel.findByIdAndUpdate(
        foodPartnerId,
        {
            businessName: req.body.businessName,
            ownerName: req.body.ownerName,
            email: req.body.email,
            address: req.body.address,
            profileImage: profileImage
        },{
            new: true
        }
    )
    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }
    return res.status(200).json({
        message: "food Partner profile updated successfully",
        foodPartner
    })
}

async function logoutFoodPartner(req,res){
    res.clearCookie("foodPartnerToken",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/"
    })

    return res.status(200).json({
        message: "Food Partner Logged out successfully"
    })
}

module.exports={
    getFoodPartnerById,getMyProfile,updateMyProfile,logoutFoodPartner
}