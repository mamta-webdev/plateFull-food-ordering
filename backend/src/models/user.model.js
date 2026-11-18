const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    address: {
        type: String,
        trim: true,
        default: ""
    },
    profilePhoto: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel