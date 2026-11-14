const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    foodPartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner",
        required: true,
    },
    items:[
        {
            food:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "food",
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            price:{
                type: Number,
                required: true,
                min:0
            }
        }
    ]
},{
    timestamps: true
})

const cartModel = mongoose.model("cart", cartSchema)
module.exports = cartModel