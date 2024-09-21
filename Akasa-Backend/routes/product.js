const router = require("express").Router();

const {
    getAllProducts, 
    createProduct, 
    getProductsByCategory, 
    getProductById, 
    updateProduct, 
    deleteProduct

} = require("../controllers/product.controller");

const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");


router
    .route("/")
    .get(getAllProducts)  
    .post(verifyToken, createProduct);

router
    .route("/category/:categoryName")
    .get(getProductsByCategory);    

router
    .route("/:id")
    .get(getProductById)
    .put(verifyToken, updateProduct)
    // .delete(verifyToken, deleteProduct);    

// router
//     .route("/:id/reviews")
//     .get(verifyToken, getProductReviews)
//     .post(verifyToken, createproductReviews)
//     .put(verifyToken, updateProductReview);    


module.exports = router;
