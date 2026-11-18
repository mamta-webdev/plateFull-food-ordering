const cartModel = require("../models/Cart.model")
const foodModel = require("../models/foodItem.model")

async function addToCart(req,res){
    try{
        const userId = req.user._id
        const {foodId} = req.body;
        const quantity = Number(req.body.quantity) || 1
    if(!foodId){
        return res.status(400).json({
            message: "FoodId is required"
        })
    }
    if(!Number.isInteger(quantity) || quantity < 1){
        return res.status(400).json({
            message: "Quantity must be atleast 1"
        })
    }

    const food = await foodModel.findById(foodId)
    if(!food){
        return res.status(404).json({
            message: "Food not found"
        })
    }
    const foodPartnerId = food.foodPartner

    let cart = await cartModel.findOne({user:userId})
    console.log("=== CART DEBUG ===");
console.log("Cart exists:", !!cart);
console.log("Cart items count:", cart?.items?.length);
console.log("Cart food partner:", cart?.foodPartner?.toString());
console.log("Requested food partner:", foodPartnerId?.toString());

    //If the user doesn't have a cart, create one. If the user already has a cart, update it.
    if(!cart){
        cart = await cartModel.create({
            user: userId,
            foodPartner: foodPartnerId,
            items:[{
                food: food._id,
                quantity,
                price: food.price
            }]
        })
    } else {
    // Apply restaurant restriction only when cart has items
    if (
        cart.items.length > 0 &&
        cart.foodPartner?.toString() !== foodPartnerId.toString()
    ) {
        return res.status(400).json({
            message: "Your cart already contains food from another restaurant. Please clear your cart before adding food from this restaurant.",
            code: "DIFFERENT_RESTAURANT"
        });
    }

    // If the cart is empty, associate it with the new restaurant
    if (cart.items.length === 0) {
        cart.foodPartner = foodPartnerId;
    }
    const existingItem = cart.items.find(
        item => item.food.toString() === foodId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            food: food._id,
            quantity,
            price: food.price
        });
    }

    await cart.save();
}

    return res.status(200).json({
        message: "Food added to cart successfully",
        cart
    })
} catch(error){
    console.log("add to cart error",error);
    return res.status(500).json({
        message: "Unable to add food to cart"
    })
}
}

async function getCart(req,res){
    try{
        const userId = req.user._id
        const cart = await cartModel.findOne({user: userId}).populate("items.food").populate("foodPartner")

        if(!cart){
            return res.status(200).json({
                message: "Cart is empty",
                cart:null
            })
        }
        return res.status(200).json({
            message: "Cart fetched successfully",
            cart
        })
    } catch(error){
        console.log("get cart error:",error)

        return res.status(500).json({
            message: "error Fetching cart",
            error: error.message
        })
    }
}


async function updateCartItem(req, res) {
    try {
        const userId = req.user.id;
        const { cartItemId, quantity } = req.body;

        if (!cartItemId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Valid cart item ID and quantity are required",
            });
        }

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const cartItem = cart.items.id(cartItemId);

        if (!cartItem) {
            return res.status(404).json({
                message: "Item not found in cart",
            });
        }

        cartItem.quantity = quantity;

        await cart.save();

        const updatedCart = await cartModel
            .findOne({ user: userId })
            .populate("items.food")
            .populate("foodPartner");

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Update cart item error:", error);

        return res.status(500).json({
            message: "Failed to update cart quantity",
        });
    }
}

async function removeFromCart(req, res) {
    try {
        const userId = req.user._id;
        const { cartItemId } = req.body;

        if (!cartItemId) {
            return res.status(400).json({
                message: "Cart item ID is required"
            });
        }

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemExists = cart.items.some(
            item => item._id.toString() === cartItemId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        cart.items.pull({ _id: cartItemId });
        await cart.save();

        return res.status(200).json({
            message: "Food removed from cart successfully",
            cart
        });

    } catch (error) {
        console.log("remove from cart error", error);

        return res.status(500).json({
            message: "Unable to remove food from cart"
        });
    }
}


module.exports = {addToCart, getCart, updateCartItem, removeFromCart}