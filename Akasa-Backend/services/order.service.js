const {
    createOrderDb, 
    getAllOrdersDb, 
    getOrderDb,
    getAllDb, 
    updateOrderStatusDb, 
} = require("../db/order.db");

const { ErrorHandler } = require("../helpers/error");

class orderService {
    getAll = async (page) => {
        const limit = 12;
        const offset = (page - 1) * limit;
        console.log("Inside get all service");

        try {
            return await getAllDb({ limit, offset });
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }

    createOrder = async (data) => {
        try {
            console.log("Somewhere here in create order");
            return await createOrderDb(data);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };

    getAllOrders = async (user_id, page) => {
        const limit = 5;
        const offset = (page - 1) * limit;
        try {
            return await getAllOrdersDb({ user_id, limit, offset });
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };

     getOrderById = async ({ id, user_id }) => {
        try {
            const order = await getOrderDb({ id, user_id });
            if (order) {
                return order;
            } else {
                throw new ErrorHandler(404, "Order does not exist");
            }
        } catch (error) {
            throw new ErrorHandler(error.statusCode || 500, error.message);
        }
    };
    

    async updateOrderStatus(order_id, status) {
        try {
            order_id = parseInt(order_id, 10);
            if (isNaN(order_id)) {
                throw new ErrorHandler(400, "Invalid order ID");
            }

            const result = await updateOrderStatusDb({ order_id, status });
            return result;
        } catch (error) {
            throw new ErrorHandler(error.statusCode || 500, error.message);
        }
    }
}

module.exports = new orderService();
