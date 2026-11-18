const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
    {
        food:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "food",
            required: true
        },
        quantity:{
            type:Number,
            required: true,
            min:1
        },
        price:{
            type:Number,
            required: true,
            min:0,
        }
    },
    {_id: false}
);

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        foodPartner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodPartner",
            required: true
        },
        items:{
            type: [orderItemSchema],
            required: true,
            validate:{
                validator: (items) => items.length > 0,
                message: "An order must contain atleast one item.",
            }
        },
        deliveryAddress:{
            type:String,
            required: true,
            trim: true,
        },
        deliveryInstructions:{
            type: String,
            trim: true,
            default: "",
        },
        phone:{
            type: String,
            required: true,
            trim: true,
        },
        totalAmount:{
            type: Number,
            required: true,
            min:0,
        },
        status:{
            type: String,
            enum:[
                "placed",
                "confirmed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled",
            ],
            default:"placed",
        },
        paymentMethod:{
            type: String,
            enum:[ "COD", "ONLINE"],
            default: 'COD'
        },
        paymentStatus:{
            type:String,
            enum:["pending","paid","failed","refunded"],
            default: "pending",
        },
    },
    { timestamps: true}
);
module.exports = mongoose.model("Order", orderSchema)