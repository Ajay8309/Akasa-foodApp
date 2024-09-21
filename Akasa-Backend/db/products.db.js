const pool = require("../config/index");


const getAllProductsDb = async ({ limit, offset }) => {
    const { rows: products } = await pool.query(
        `
        SELECT 
            products.product_id,
            products.name,
            products.price,
            products.description,
            products.image_url,
            products.stock_quantity,
            products.weight,
            products.added_at,
            categories.category_id,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories ON products.category_id = categories.category_id
        ORDER BY products.added_at DESC
        LIMIT $1 OFFSET $2;
        `,
        [limit, offset]
    );
    return products;
};

// Helper function to get category by name
const getCategoryByNameDb = async (category_name) => {
    const { rows: category } = await pool.query(
        `SELECT category_id FROM categories WHERE LOWER(name) = LOWER($1)`,
        [category_name]
    );
    return category[0]; // Returns undefined if no category is found
};

// Helper function to create a new category
const createCategoryDb = async (category_name) => {
    const { rows: newCategory } = await pool.query(
        `
        INSERT INTO categories (name) 
        VALUES ($1) 
        RETURNING category_id, name;
        `,
        [category_name]
    );
    return newCategory[0]; // Returns the newly created category
};

const createProductDb = async ({ name, price, description, image_url, category_name, stock_quantity, weight }) => {
    let category_id;

    const existingCategory = await getCategoryByNameDb(category_name);
    if (existingCategory) {
        category_id = existingCategory.category_id;
    } else {
        const newCategory = await createCategoryDb(category_name);
        category_id = newCategory.category_id;
    }

    const { rows: product } = await pool.query(
        `
        INSERT INTO products (name, price, description, image_url, category_id, stock_quantity, weight)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING product_id, name, price, description, image_url, category_id, stock_quantity, weight, added_at;
        `,
        [name, price, description, image_url, category_id, stock_quantity, weight]
    );
    return product[0]; 
};

const getProductsByCategoryDb = async (category_name) => {
    // Get the category ID by the category name
    const existingCategory = await getCategoryByNameDb(category_name);

    if (!existingCategory) {
        throw new Error(`Category '${category_name}' does not exist.`);
    }

    // Query to get products by category_id
    const { rows: products } = await pool.query(
        `
        SELECT 
            products.product_id,
            products.name,
            products.price,
            products.description,
            products.image_url,
            products.stock_quantity,
            products.weight,
            products.added_at,
            categories.category_id,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories ON products.category_id = categories.category_id
        WHERE categories.category_id = $1
        ORDER BY products.added_at DESC;
        `,
        [existingCategory.category_id]
    );

    return products;
};

const getProductDb = async (product_id) => {
    const { rows: product } = await pool.query(
        `
        SELECT 
            products.product_id,
            products.name,
            products.price,
            products.description,
            products.image_url,
            products.stock_quantity,
            products.weight,
            products.added_at,
            categories.category_id,
            categories.name AS category_name,
            reviews.review_id,
            reviews.user_id,
            reviews.rating,
            reviews.content, 
            reviews.review_date AS review_created_at
        FROM products
        LEFT JOIN categories ON products.category_id = categories.category_id
        LEFT JOIN reviews ON products.product_id = reviews.product_id
        WHERE products.product_id = $1
        `,
        [product_id]
    );
    
    return product;
};

const updateProductDb = async ({ product_id, name, price, description, image_url, category_name, stock_quantity, weight }) => {
    let category_id;

    const existingCategory = await getCategoryByNameDb(category_name);
    if (existingCategory) {
        category_id = existingCategory.category_id;
    } else {
        const newCategory = await createCategoryDb(category_name);
        category_id = newCategory.category_id;
    }

    const { rows: updatedProduct } = await pool.query(
        `
        UPDATE products 
        SET 
            name = COALESCE($2, name), 
            price = COALESCE($3, price), 
            description = COALESCE($4, description), 
            image_url = COALESCE($5, image_url), 
            category_id = COALESCE($6, category_id), 
            stock_quantity = COALESCE($7, stock_quantity), 
            weight = COALESCE($8, weight)
        WHERE product_id = $1
        RETURNING product_id, name, price, description, image_url, category_id, stock_quantity, weight, added_at;
        `,
        [product_id, name, price, description, image_url, category_id, stock_quantity, weight]
    );
    
    return updatedProduct[0];
};




module.exports = {
    getAllProductsDb,
    createProductDb,
    getCategoryByNameDb,
    createCategoryDb, 
    getProductsByCategoryDb, 
    getProductDb, 
    updateProductDb
};