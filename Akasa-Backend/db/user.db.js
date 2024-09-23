const pool = require("../config/index");

// Get all users with pagination
const getAllUsersDb = async ({ limit, offset }) => {
    const { rows: users } = await pool.query(
        `SELECT * FROM users LIMIT $1 OFFSET $2;`, 
        [limit, offset]
    );
    return users;
};

// Create a new user in the database
const createUserDb = async ({ username, password, email, fullname }) => {
    const { rows: user } = await pool.query(
        `
        INSERT INTO users (username, password, email, fullname)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, username, email, fullname;
        `,
        [username, password, email, fullname]
    );
    return user[0];
};

// Get user by ID with cart and wishlist information
const getUserByIdDb = async (id) => {
    const { rows: user } = await pool.query(
        `SELECT users.*, cart.cart_id AS cart_id, wishlist.wishlist_id AS wishlist_id 
         FROM users 
         LEFT JOIN cart ON cart.user_id = users.user_id 
         LEFT JOIN wishlist ON wishlist.user_id = users.user_id
         WHERE users.user_id = $1`,
        [id]
    );
    return user[0];
};

// Get user by username
const getUserByUsernameDb = async (username) => {
    const { rows: user } = await pool.query(
        `SELECT users.*, cart.cart_id AS cart_id 
         FROM users 
         LEFT JOIN cart ON cart.user_id = users.user_id 
         WHERE LOWER(users.username) = LOWER($1)`,
        [username]
    );
    return user[0];
};

// Get user by email with cart and wishlist information
const getUserByEmailDb = async (email) => {
    const { rows: user } = await pool.query(
        `SELECT users.*, cart.cart_id AS cart_id, wishlist.wishlist_id AS wishlist_id 
         FROM users 
         LEFT JOIN cart ON cart.user_id = users.user_id 
         LEFT JOIN wishlist ON wishlist.user_id = users.user_id
         WHERE LOWER(users.email) = LOWER($1)`,
        [email]
    );
    return user[0];
};

// Update user information
const updateUserDb = async ({
    username,
    email,
    fullname,
    id,
    address,
    city,
    state,
    country,
}) => {
    try {
        const { rows: user } = await pool.query(
            `UPDATE users 
             SET username = $1, email = $2, fullname = $3, address = $4, 
                 city = $5, state = $6, country = $7 
             WHERE user_id = $8 
             RETURNING username, email, fullname, address, city, state, country`,
            [username, email, fullname, address, city, state, country, id]
        );
        console.log("Update successful, returned data:", user[0]);
        return user[0];
    } catch (error) {
        console.error("Database update error:", error);
        throw new ErrorHandler(500, "Database update failed");
    }
};


// Delete user from the database
const deleteUserDb = async (id) => {
    const { rows: user } = await pool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`,
        [id]
    );
    return user[0];
};

// Change user's password
const changeUserPasswordDb = async (hashedPassword, email) => {
    return await pool.query(
        `UPDATE users SET password = $1 WHERE email = $2`,
        [hashedPassword, email]
    );
};

module.exports = {
    getAllUsersDb,
    getUserByIdDb,
    getUserByEmailDb,
    updateUserDb,
    createUserDb,
    deleteUserDb,
    getUserByUsernameDb,
    changeUserPasswordDb,
};

// Updated SQL Schema for users:

/*
CREATE TABLE public.users
(
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    google_id VARCHAR(100) UNIQUE,
    roles VARCHAR(10)[] DEFAULT '{customer}'::VARCHAR[] NOT NULL,
    address VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
*/
