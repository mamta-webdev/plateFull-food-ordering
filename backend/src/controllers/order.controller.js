const orderModel = require("../models/Order.model")
const cartModel = require("../models/Cart.model");
const foodModel = require("../models/foodItem.model");

async function checkout(req, res) {
    try {
        const userId = req.user._id;
        console.log("CHECKOUT API HIT");
        const { deliveryAddress, phone, instructions } = req.body;

        // 1. Validate delivery details
        if (
            typeof deliveryAddress !== "string" ||
            !deliveryAddress.trim() ||
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return res.status(400).json({
                message: "Delivery address and phone are required",
            });
        }

        // 2. Fetch the user's cart from the database
        const cart = await cartModel.findOne({ user: userId });

        if (!cart || !cart.items.length) {
            return res.status(400).json({
                message: "Your cart is empty",
            });
        }

        // 3. Fetch current food data and calculate the total
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const food = await foodModel.findById(item.food);

            if (!food || !food.isAvailable) {
                return res.status(400).json({
                    message: `Food is unavailable: ${food?.name || "Unknown item"}`,
                });
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    message: "Invalid item quantity",
                });
            }

            orderItems.push({
                food: food._id,
                quantity,
                price: food.price,
            });

            totalAmount += food.price * quantity;
        }
        const deliveryFee = totalAmount >= 299 ? 0 : 30;
        totalAmount += deliveryFee;


        // 4. Verify the cart belongs to one restaurant
        const foodPartnerId = cart.foodPartner;

        if (
            orderItems.length === 0 ||
            !foodPartnerId
        ) {
            return res.status(400).json({
                message: "Invalid cart or restaurant",
            });
        }

        // 5. Create the order
        const order = await orderModel.create({
            user: userId,
            foodPartner: foodPartnerId,
            items: orderItems,
            deliveryAddress: deliveryAddress.trim(),
            deliveryInstructions: instructions?.trim() || "",
            phone: phone.trim(),
            totalAmount,
            status: "placed",
            paymentMethod: "COD",
            paymentStatus: "pending",
        });

        // 6. Clear the cart after successfully creating the order
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Checkout error:", error);

        return res.status(500).json({
            message: "Unable to place order",
        });
    }
}


async function getMyOrders(req, res) {
    try {
        const userId = req.user._id;

        const orders = await orderModel
            .find({ user: userId })
            .populate("items.food")
            .sort({ createdAt: -1 });

        const totalOrders = orders.length;

        const totalSpent = orders
            .filter(order => order.status !== "cancelled")
            .reduce((sum, order) => sum + order.totalAmount, 0);

        const ordersThisMonth = orders.filter(order => {
            const date = new Date(order.createdAt);
            const now = new Date();

            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        }).length;

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders,
            stats: {
                totalOrders,
                totalSpent,
                ordersThisMonth
            }
        });
    } catch (error) {
        console.error("Get my orders error:", error);

        return res.status(500).json({
            message: "Unable to fetch your orders"
        });
    }
}

module.exports = { checkout, getMyOrders };
