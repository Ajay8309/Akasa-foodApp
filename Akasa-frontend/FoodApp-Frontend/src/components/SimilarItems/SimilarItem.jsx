import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SimilarItem.css';

const SimilarItems = ({ product, addToWishlist }) => {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(product.price);

    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        addToWishlist(product);
    };

    return (
        <div className="itemContainer">
            <button className="wishlist" onClick={toggleFavorite}>
                <FontAwesomeIcon icon={faHeart} style={{ color: isFavorite ? 'red' : 'gray' }} />
            </button>
            <Link to={`/products/${product.product_id}`} className="itemLink">
                <img
                    className="productImg"
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    title={product.name}
                />
                <div className="cardBody">
                    <h2 className="productName">{product.name}</h2>
                    <p className="price">{formattedPrice}</p>
                    {/* <p className="description">{product.description}</p> */}
                </div>
            </Link>
        </div>
    );
};

export default SimilarItems;
