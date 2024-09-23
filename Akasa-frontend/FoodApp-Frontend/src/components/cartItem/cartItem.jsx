import React from 'react';
import { Button } from "@windmill/react-ui";
import { useCart } from "../../context/CartContext";
import styles from "./cartItem.module.css"; 

const CartItem = ({ item }) => {
  const { decrement, increment, deleteItem, moveCartItemToWishlist } = useCart();

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const increase = () => {
    increment(item.product_id);
  };

  const decrease = () => {
    decrement(item.product_id);
    console.log("Decreased " + item.product_id);
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.imagetxtContainer}>
        <img src={item.image_url} alt={item.name} className={styles.productImage} />
        <div className={styles.productDetails}>
          <h3 className={styles.productName}>{item.name}</h3>
          <p className={styles.productPrice}>{formattedPrice(item.price)}</p>
          <div className={styles.quantityButtons}>
            <Button onClick={decrease} className={styles.decrementButton}>
              -
            </Button>
            <span className={styles.quantity}>{item.quantity}</span>
            <Button onClick={increase} className={styles.incrementButton}>
              +
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.cardItemButtons}>
        <Button onClick={() => deleteItem(item.product_id)} className={styles.removeButton}>
          Remove
        </Button>
        <Button onClick={() => moveCartItemToWishlist(item.product_id)}>
          Move to wishlist
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
