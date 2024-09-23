import React from 'react';
import {
  Button,
} from "@windmill/react-ui";
import CartItem from "../../components/cartItem/cartItem";
import { useCart } from "../../context/CartContext";
import Layout from "../../layout/layout";
import { ShoppingCart } from "react-feather";
import { Link } from "react-router-dom";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cartData, isLoading, cartSubTotal } = useCart();

  console.log(cartData);

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (cartData?.items?.length === 0) {
    return (
      <Layout title="Cart" loading={isLoading}>
        <div className={`${styles.container} ${styles.emptyCart}`}>
          <h1>Food Cart</h1>
          <div className={styles.emptyCart}>
            <ShoppingCart className={styles.shoppingCartIcon} />
            <p>Cart is empty</p>
            <Button tag={Link} to="/" className={styles.continueShoppingBtn}>
              Continue Ordering
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout loading={isLoading || cartData === undefined}>
      <h1 className={styles.cartTitle}>Shopping Cart</h1>
      <div className={styles.container}>
        <div className={styles.cartItemCardWithScrollbar}>
          {cartData?.items?.map((item) => (
            <div key={item.product_id}>
              <CartItem item={item} />
            </div>
          ))}
        </div>

        <div className={styles.totalDetails}>
          Cart Total: {formattedPrice(cartSubTotal)}
        </div>

        <div className={styles.checkoutButton}>
          <Button tag={Link} to="/checkout" state={{ fromCartPage: true }}>
            Checkout
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
