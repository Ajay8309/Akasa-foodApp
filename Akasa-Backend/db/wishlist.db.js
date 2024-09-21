const pool = require("../config/index");

// Create a new wishlist for a user
const createWishlistDb = async (userId) => {
    const { rows: wishlist } = await pool.query(
        `INSERT INTO wishlist (user_id) VALUES ($1) RETURNING wishlist_id`,
        [userId]
    );
    return wishlist[0];
};

// Fetch the wishlist and associated product details for a user
const getWishlistDb = async (wishlist_id) => {
    const results = await pool.query(
        `
        SELECT
            wishlist_items.*,
            products.*,
            categories.name AS category_name
        FROM
            wishlist_items
        JOIN
            products ON wishlist_items.product_id = products.product_id
        LEFT JOIN
            categories ON products.category_id = categories.category_id
        WHERE
            wishlist_items.wishlist_id = $1
        `,
        [wishlist_id]
    );

    return results.rows;
};

// Add an item to the wishlist, preventing duplicates
const addItemToWishlistDb = async ({ wishlist_id, product_id }) => {
    await pool.query(
        `
        INSERT INTO wishlist_items (wishlist_id, product_id)
        VALUES ($1, $2) 
        ON CONFLICT (wishlist_id, product_id) DO NOTHING
        `,
        [wishlist_id, product_id]
    );

    const results = await pool.query(
        `
        SELECT
            p.*,
            c.name AS category_name
        FROM
            wishlist_items wi
        JOIN
            products p ON wi.product_id = p.product_id
        LEFT JOIN
            categories c ON p.category_id = c.category_id
        WHERE
            wi.wishlist_id = $1
            AND wi.product_id = $2
        `,
        [wishlist_id, product_id]
    );

    return results.rows;
};

// Remove an item from the wishlist
const deleteItemFromWishlistDb = async ({ wishlist_id, product_id }) => {
    const { rows: results } = await pool.query(
        `
        DELETE FROM wishlist_items 
        WHERE wishlist_id = $1 AND product_id = $2 
        RETURNING *
        `,
        [wishlist_id, product_id]
    );
    return results[0];
};

// Move an item from the wishlist to the cart
const addWishlistItemToCartDb = async ({ cart_id, product_id, quantity }) => {
    await pool.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3) 
        ON CONFLICT (cart_id, product_id) 
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *
        `,
        [cart_id, product_id, quantity]
    );

    const results = await pool.query(
        `
        SELECT 
            products.*, 
            cart_items.quantity, 
            round((products.price * cart_items.quantity)::numeric, 2) as subtotal 
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.product_id 
        WHERE cart_items.cart_id = $1
        `,
        [cart_id]
    );
    return results.rows;
};

// Check if an item is already in the wishlist
const isInWishlistDb = async ({ wishlist_id, product_id }) => {
    const { rows } = await pool.query(
        `
        SELECT EXISTS (
            SELECT 1 
            FROM wishlist_items 
            WHERE wishlist_id = $1 AND product_id = $2
        ) AS is_in_wishlist
        `,
        [wishlist_id, product_id]
    );
    return rows[0].is_in_wishlist;
};

module.exports = {
    createWishlistDb,
    getWishlistDb,
    addItemToWishlistDb,
    deleteItemFromWishlistDb,
    addWishlistItemToCartDb,
    isInWishlistDb,
};
