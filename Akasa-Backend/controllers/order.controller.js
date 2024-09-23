const orderService = require("../services/order.service");
const cartService = require("../services/cart.service");


const getAll = async (req, res) => {
    const {page = 1} = req.query;
    console.log("Inside get all");

    const orders = await orderService.getAll(page);
    res.json(orders);
}

const createOrder = async (req, res) => {
    const { amount, itemTotal, paymentMethod, tracking_id } = req.body;  
    const user_id = req.user.id;
    const cartId = req.user.cart_id;

    try {
        const newOrder = await orderService.createOrder({
            cartId, 
            amount, 
            itemTotal, 
            user_id,
            paymentMethod, 
            tracking_id,  
        });

        await cartService.emptyCart(cartId);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
};


const getOrder = async (req, res) => {
    console.log("Get specific order by ID");
    const id = parseInt(req.params.id, 10);
    const user_id = req.user.id;

    try {
        const order = await orderService.getOrderById({ id, user_id });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};


const getAllOrders = async (req, res) => {
   
    // console.log(req.user);
    const {page = 1} = req.query;
    const user_id = req.user.id;
    // console.log("Get all orders", user_id);
    const orders = await orderService.getAllOrders(user_id, page);
    res.json(orders);
}

const updateOrderStatusController = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const updatedOrder = await orderService.updateOrderStatus(id, status);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    getAllOrders, 
    getOrder, 
    createOrder,
    getAll, 
    updateOrderStatusController
};