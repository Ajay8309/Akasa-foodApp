const pool = require("../config/index");

const createCartDb = async (userId) => {
    const { rows: cart } = await pool.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id`,  
        [userId]
    );
    
    return cart[0];  
};


const getCartDb = async (cart_id) => {
    const results = await pool.query(
        `SELECT products.*, cart_items.quantity, 
                round((products.price * cart_items.quantity)::numeric, 2) as subtotal 
         FROM cart_items 
         JOIN products ON cart_items.product_id = products.product_id 
         WHERE cart_items.cart_id = $1`,
        [cart_id]
    );
    return results.rows;
};

// Adding product to the cart
const addItemDb = async ({ cart_id, product_id, quantity }) => {
    const product = await pool.query(`SELECT stock_quantity FROM products WHERE product_id = $1`, [product_id]);
    
    if (product.rows[0].stock_quantity < quantity) {
        throw new Error("Not enough stock available");
    }

    await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3) 
         ON CONFLICT (cart_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
         RETURNING *`,
        [cart_id, product_id, quantity]
    );

    await pool.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1 
         WHERE product_id = $2 AND stock_quantity >= $1`,
        [quantity, product_id]
    );

    const updatedStock = await pool.query(`SELECT stock_quantity FROM products WHERE product_id = $1`, [product_id]);
    
    if (updatedStock.rows[0].stock_quantity === 0) {
        await pool.query(`UPDATE products SET available = false WHERE product_id = $1`, [product_id]);
    }

    const results = await pool.query(
        `SELECT products.*, cart_items.quantity, 
                round((products.price * cart_items.quantity)::numeric, 2) as subtotal 
         FROM cart_items 
         JOIN products ON cart_items.product_id = products.product_id 
         WHERE cart_items.cart_id = $1`,
        [cart_id]
    );
    return results.rows;
};

// Deleting an item from cart
const deleteItemDb = async ({ cart_id, product_id }) => {
    const { rows: item } = await pool.query(
        `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
        [cart_id, product_id]
    );

    if (item[0]) {
        await pool.query(
            `UPDATE products 
             SET stock_quantity = stock_quantity + $1 
             WHERE product_id = $2`,
            [item[0].quantity, product_id]
        );
    }

    return item[0];
};

// Increasing item quantity in the cart
const increaseItemQuantityDb = async ({ cart_id, product_id }) => {
    const product = await pool.query(`SELECT stock_quantity FROM products WHERE product_id = $1`, [product_id]);

    if (product.rows[0].stock_quantity <= 0) {
        throw new Error("Not enough stock available");
    }

    await pool.query(
        `UPDATE cart_items 
         SET quantity = quantity + 1 
         WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
        [cart_id, product_id]
    );

    await pool.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - 1 
         WHERE product_id = $1 AND stock_quantity > 0`,
        [product_id]
    );

    const results = await pool.query(
        `SELECT products.*, cart_items.quantity, 
                round((products.price * cart_items.quantity)::numeric, 2) as subtotal 
         FROM cart_items 
         JOIN products ON cart_items.product_id = products.product_id 
         WHERE cart_items.cart_id = $1`,
        [cart_id]
    );
    return results.rows;
};

// Decreasing item quantity in the cart
const decreaseItemQuantityDb = async ({ cart_id, product_id }) => {
    const { rows: item } = await pool.query(
        `UPDATE cart_items 
         SET quantity = quantity - 1 
         WHERE cart_id = $1 AND product_id = $2 AND quantity > 0 RETURNING *`,
        [cart_id, product_id]
    );

    if (item[0]) {
        await pool.query(
            `UPDATE products 
             SET stock_quantity = stock_quantity + 1 
             WHERE product_id = $1`,
            [product_id]
        );
    }

    const results = await pool.query(
        `SELECT products.*, cart_items.quantity, 
                round((products.price * cart_items.quantity)::numeric, 2) as subtotal 
         FROM cart_items 
         JOIN products ON cart_items.product_id = products.product_id 
         WHERE cart_items.cart_id = $1`,
        [cart_id]
    );
    return results.rows;
};

// Empty the cart
const emptyCartDb = async (cart_id) => {
    const { rows: items } = await pool.query(
        `DELETE FROM cart_items WHERE cart_id = $1 RETURNING *`,
        [cart_id]
    );

    for (const item of items) {
        await pool.query(
            `UPDATE products 
             SET stock_quantity = stock_quantity + $1 
             WHERE product_id = $2`,
            [item.quantity, item.product_id]
        );
    }

    return items;
};

module.exports = {
    createCartDb,
    getCartDb,
    addItemDb,
    increaseItemQuantityDb,
    decreaseItemQuantityDb,
    emptyCartDb,
    deleteItemDb,
};
