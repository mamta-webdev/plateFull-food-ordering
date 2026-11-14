const mongoose = require("mongoose")

const foodPartnerSchema = new mongoose.Schema({
    businessName:{
        type:String,
        required: true
    },
    ownerName:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    profileImage:{
        type:String,
        default:""
    }
    
})

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema)
module.exports = foodPartnerModel