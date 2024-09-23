const pool = require("../config/index");



// Get All Orders with Product and User Details
const getAllDb = async ({ limit, offset }) => {
    const { rows } = await pool.query(`
    SELECT 
        o.order_id,
        o.status,
        o.order_date,
        o.total_amount,
        o.tracking_id,
        o.payment_method,
        array_agg(json_build_object(
            'product_name', p.name,
            'product_description', p.description,
            'product_price', p.price,
            'product_image_url', p.image_url,
            'quantity', oi.quantity
        )) AS products,
        u.fullname AS user_fullname,
        u.email AS user_email,
        u.username AS user_username
    FROM 
        orders o
    INNER JOIN 
        order_items oi ON o.order_id = oi.order_id
    INNER JOIN 
        products p ON oi.product_id = p.product_id
    INNER JOIN 
        users u ON o.user_id = u.user_id
    GROUP BY 
        o.order_id, u.fullname, u.email, u.username
    ORDER BY 
        o.order_id
    LIMIT $1 OFFSET $2;
    `, [limit, offset]);

    return rows;
};


// Create New Order and Add Products from Cart to Order
const createOrderDb = async ({
    cartId,
    itemTotal,  // This will now be calculated in the query
    user_id, 
    ref,
    paymentMethod,
}) => {
    if (!user_id) {
        throw new Error("userId cannot be null");
    }

    const tracking_id = ref;

    const { rows: order } = await pool.query(
        `
        WITH calculated_amount AS (
            SELECT SUM(ci.quantity * p.price) AS total_amount
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1
        )
        INSERT INTO orders(user_id, status, total_amount, tracking_id, payment_method)
        VALUES ($2, 'Processing', (SELECT total_amount FROM calculated_amount), $3, $4)
        RETURNING *;
        `,
        [cartId, user_id, tracking_id, paymentMethod]
    );
    
    await pool.query(
        `
        INSERT INTO order_items(order_id, product_id, quantity)
        SELECT $1, product_id, quantity 
        FROM cart_items 
        WHERE cart_id = $2;
        `,
        [order[0].order_id, cartId]
    );

    return order[0];
};


// Get All Orders for a Specific User with Pagination
const getAllOrdersDb = async ({ user_id, limit, offset }) => {
    try {
        // Get the total count of orders for the user
        const { rowCount } = await pool.query(
            `
            SELECT * FROM orders WHERE user_id = $1;
            `,
            [user_id]
        );

        // Fetch orders with associated products
        const { rows } = await pool.query(
            `
            SELECT 
                o.order_id,
                o.status,
                o.order_date,
                o.total_amount,
                o.tracking_id,
                o.payment_method,
                array_agg(json_build_object(
                    'product_id', p.product_id,
                    'product_name', p.name,
                    'product_description', p.description,
                    'product_price', p.price,
                    'product_image_url', p.image_url,
                    'quantity', oi.quantity
                )) AS products
            FROM 
                orders o
            INNER JOIN 
                order_items oi ON oi.order_id = o.order_id
            INNER JOIN 
                products p ON p.product_id = oi.product_id
            WHERE 
                o.user_id = $1
            GROUP BY 
                o.order_id
            ORDER BY 
                o.order_id DESC
            LIMIT $2 OFFSET $3;
            `,
            [user_id, limit, offset]
        );

        return { items: rows, total: rowCount };
    } catch (error) {
        console.error('Error fetching orders with products:', error);
        throw error;
    }
};


// Get Specific Order Details by Order ID and User ID
const getOrderDb = async ({ id, userId }) => {
    try {
        const { rows } = await pool.query(
            `
            SELECT 
                o.order_id,
                o.status,
                o.order_date,
                o.total_amount,
                o.tracking_id,
                o.payment_method,
                array_agg(json_build_object(
                    'product_id', p.product_id,
                    'product_name', p.name,
                    'product_description', p.description,
                    'product_price', p.price,
                    'product_image_url', p.image_url,
                    'quantity', oi.quantity
                )) AS products
            FROM 
                orders o
            INNER JOIN 
                order_items oi ON oi.order_id = o.order_id
            INNER JOIN 
                products p ON p.product_id = oi.product_id
            WHERE 
                o.order_id = $1 AND o.user_id = $2
            GROUP BY 
                o.order_id;
            `,
            [id, userId]
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};


// Update Order Status
const updateOrderStatusDb = async ({ order_id, status }) => {
    try {
        const { rows } = await pool.query(
            `
            UPDATE orders 
            SET status = $2 
            WHERE order_id = $1 
            RETURNING *;
            `,
            [order_id, status]
        );
        return rows[0];
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status");
    }
};


// Exporting Functions for Use in Other Modules
module.exports = {
    createOrderDb,
    getAllOrdersDb,
    getOrderDb,
    getAllDb,
    updateOrderStatusDb
};
