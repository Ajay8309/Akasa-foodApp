import React, { useState, useEffect } from 'react';
import { Card } from "@windmill/react-ui";
import Product from "../../components/Product/Product";
import Spinner from "../../components/Spinner/spinner";
import { useProduct } from "../../context/ProductContext";
import { useWishlist } from "../../context/WishlistContext";
import Layout from "../../layout/Layout";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const { products, setPage } = useProduct(); // Getting products from ProductContext
  const { isInWishlist, addItem } = useWishlist(); // Getting wishlist functionalities
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [wishlistStatuses, setWishlistStatuses] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      checkIsInWishlistForProducts(products.map(prod => prod.product_id));
    }
  }, [products]);

  // Checks if each product is in the wishlist
  const checkIsInWishlistForProducts = async (productIds) => {
    if (!productIds) return; // Ensure productIds is defined
    const promises = productIds.map((productId) => isInWishlist(productId));
    const results = await Promise.all(promises);
    setWishlistStatuses(results);
  };

  const handleAddToWishlist = async (product) => {
    await addItem(product);
    // console.log();
    checkIsInWishlistForProducts(products.map(prod => prod.product_id)); 
  };

  const handleChange = (page) => {
    setCurrentPage(page);
    setPage(page); // Set the current page in ProductContext
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  // If products is null or not an array, show the Spinner
  if (!products || !Array.isArray(products)) {
    return (
      <Layout>
        <Spinner size={100} loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.productList}>
        {products.map((prod, index) => (
          <div key={prod.product_id} className={styles.productCard}>
            <Product
              product={prod}
              isInWishlistStatus={wishlistStatuses[index]} 
              addToWishlist={() => handleAddToWishlist(prod)} 
            />
          </div>
        ))}
      </div>
      <div className={styles.paginationContainer}>
        {/* 
          Uncomment and implement your pagination component if necessary
          <CustomPagination
            totalResults={20}
            resultsPerPage={12}
            currentPage={currentPage}
            onChange={handleChange}
          /> 
        */}
      </div>
    </Layout>
  );
};

export default ProductList;
