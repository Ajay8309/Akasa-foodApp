const {
    getAllProductsDb, 
    createProductDb, 
    getProductsByCategoryDb, 
    getProductDb, 
    updateProductDb
} = require("../db/products.db");

const { ErrorHandler } = require("../helpers/error");


class productService {
    getAllProducts = async (page) => {
        const limit = 12;
        const offset = (page - 1) * limit;
    
        try {
          return await getAllProductsDb({ limit, offset });
        } catch (error) {
          throw new ErrorHandler(error.statusCode, error.message);
        }
      };

      addProduct = async (data) => {
        try {
          console.log(data);
          return await createProductDb(data);
        } catch (error) {
          throw new ErrorHandler(error.statusCode, error.message);
        }
      };

      getProductsByCategory = async (categoryName) => {
        try {
          const product = await getProductsByCategoryDb(categoryName);
          if(!product) {
            throw new ErrorHandler(404, "Product not found");
          }
          return product;
        } catch (error) {
          throw new ErrorHandler(error.statusCode, error.message);
        }
      }


      getProductById = async (id) => {
        try {
          const product = await getProductDb(id);
          console.log("product services product by id" + product)
          if (!product) {
            throw new ErrorHandler(404, "Product not found");
          }
          return product;
        } catch (error) {
          throw new ErrorHandler(error.statusCode, error.message);
        }
      };

      updateProduct = async (data) => {
        try {
            console.log(data);
    
            const product = await getProductDb(data.id);
      
            if (!product) {
                throw new ErrorHandler(404, "Product not found");
            }
      
            console.log("Existing Product:", product);
            console.log("Updated Data:", data);
    
            const updatedData = {
                product_id: data.id,
                name: data.name || product.name, 
                price: data.price || product.price,
                description: data.description || product.description,
                image_url: data.image_url || product.image_url,
                category_name: data.category_name,
                stock_quantity: data.stock_quantity || product.stock_quantity,
                weight: data.weight || product.weight
            };
    
            await updateProductDb(updatedData);  
      
            const updatedProduct = await getProductDb(data.id);
      
            console.log("Updated Product:", updatedProduct);
      
            return updatedProduct;
        } catch (error) {
            console.error("Error during product update:", error);
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    

};

module.exports = new productService();
