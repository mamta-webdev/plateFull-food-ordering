const jwt = require("jsonwebtoken")
const foodPartnerModel = require("../models/foodPartner.model")
const userModel = require("../models/user.model")


async function authFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.foodPartnerToken
    if(!token){
        return res.status(401).json({
            message: "Please login first"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded._id)
        req.foodPartner = foodPartner            //req.foodPartner means we are creating a foodPartner object in our request object
        next()
    }catch(err){
         return res.status(401).json({
            message: "User not authorized"
         })
    }


}


async function authUserMiddleware(req,res,next){
    const token = req.cookies.userToken
    if(!token){
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById({_id: decoded._id})
        req.user = user
        next()
    }catch(err){
        return res.status(401).json({
            message: "User not authorized"
        })
    }

}

module.exports = {
    authFoodPartnerMiddleware,authUserMiddleware
}