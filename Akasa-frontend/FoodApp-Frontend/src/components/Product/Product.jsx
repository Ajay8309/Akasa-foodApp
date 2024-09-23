import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import styles from "./Product.module.css"; // Importing the CSS module
import { useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Product = ({ product, addToWishlist }) => {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(product.price);

    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        addToWishlist(product); // Pass product to the wishlist
    };

    return (
        <div className={styles.productCard}>
            <button className={styles.wishlist} onClick={toggleFavorite}>
                <FontAwesomeIcon icon={faHeart} style={{ color: isFavorite ? "red" : "gray" }} />
            </button>
            <Link to={`/products/${product.product_id}`} className={styles.productLink}>
                <img
                    className={styles.productImg}
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    title={product.name}
                />
                <div className={styles.cardBody}>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.price}>{formattedPrice}</p>
                    <p className={styles.description}>{product.description}</p> 
                </div>
            </Link>
        </div>
    );
};

export default Product;
