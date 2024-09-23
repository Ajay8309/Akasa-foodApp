import React from 'react';
import Layout from '../../layout/layout';
import { useWishlist } from '../../context/WishlistContext';
import { Trash2 } from 'react-feather';
import styles from './wishlist.module.css'; // Import CSS module

const Wishlist = () => {
  const { wishlistData, deleteItem, moveItemToCart } = useWishlist();

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleDeleteItem = (product_id) => {
    deleteItem(product_id);
  };

  const handleMoveItemToCart = (product_id) => {
    moveItemToCart(product_id);
  };

  return (
    <Layout>
      <div className={styles.gridContainer}>
        {wishlistData?.items?.map((prod) => (
          <div key={prod.product_id} className={styles.card}>
            <div className={styles.cardContent}>
              <img
                className={styles.productImg}
                src={prod.image_url}
                alt={prod.name}
                loading="lazy"
                decoding="async"
                title={prod.name}
              />
              <div className={styles.cardBody}>
                <h2 className={styles.productName}>{prod.name}</h2>
                <p className={styles.price}>{formattedPrice(prod.price)}</p>

                <div className={styles.actions}>
                  <button
                    className={styles.addToCartBtn}
                    onClick={() => handleMoveItemToCart(prod.product_id)}
                  >
                    Add to cart
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteItem(prod.product_id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Wishlist;
