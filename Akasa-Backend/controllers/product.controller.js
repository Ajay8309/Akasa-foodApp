const pool = require("../config");
const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
    const {page = 1} = req.query;

    const products = await productService.getAllProducts(page);
    res.json(products);
};


const createProduct = async (req, res) => {
    const newProduct = await productService.addProduct(req.body);
    res.status(200).json(newProduct);
};

const getProductsByCategory = async (req, res) => {
    const categoryName = req.params.categoryName;
    const product = await productService.getProductsByCategory(categoryName);
    res.status(200).json(product);
};

const getProductById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const product = await productService.getProductById(id);
    res.status(200).json(product);
};

const updateProduct = async (req, res) => {
    const {name, price, description, image_url, category_name, stock_quantity, weight} = req.body;
    const {id} = req.params;

    const updatedProduct = await productService.updateProduct({ 
        name, 
        weight, 
        description, 
        image_url,
        id, 
        category_name,
        price, 
        stock_quantity
    });
    res.status(200).json(updatedProduct);
};

module.exports = {
    getAllProducts,
    createProduct, 
    getProductsByCategory, 
    getProductById, 
    updateProduct
};