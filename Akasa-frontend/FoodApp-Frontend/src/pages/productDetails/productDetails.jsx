import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductService from '../../services/product.service';
import Layout from '../../layout/layout';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import s from "../ProductDetails/ProductDetails.module.css"
import { useReview } from '../../context/ReviewContext';
import { TrendingUp, RefreshCw, Truck } from 'react-feather';
import ReactStars from 'react-rating-stars-component';
import { useProduct } from "../../context/ProductContext";
// import SimilarItems from '../../components/SimilarItems';
import Slider from 'react-slick'; 
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import FixedProductDetails from '../../components/FixedProductDetails';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist } = useWishlist();
  const { reviews, addReview, setProductId } = useReview();
  const { products } = useProduct();

  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [showFixedProductDetails, setShowFixedProductDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await ProductService.getProduct(id);
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else {
          console.error('No product found');
        }
        setProductId(id);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product, 1);
  };

  const handleAddToWishlist = async (selectedProduct) => {
    await addToWishlist(selectedProduct);
  };

  const handleAddReview = async () => {
    try {
      await addReview(id, newReviewRating, newReviewContent);
      setNewReviewRating(1);
      setNewReviewContent('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const productDetailsContainer = document.querySelector(`.${s.productDetailsContainer}`);
      const isVisible = productDetailsContainer ? isElementInViewport(productDetailsContainer) : false;
      setShowFixedProductDetails(!isVisible);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log(product.name);

  return (
    <Layout loading={isLoading}>
      {product && (
        <div className={s.productDetailsContainer}>
          <div className={s.productInfoContainer}>
            <div className={s.productDetailsImage}>
              <img src={product.image_url} alt={product.name} />
            </div>

            <div className={s.productDetailsInfo}>
              <div className={s.titleName}>
                <div className={s.nameStarComponent}>
                  <h2>{product.name}</h2>
                  <div className={s.wishlistStarContainer}>
                    <ReactStars
                      count={5}
                      size={21}
                      edit={false}
                      value={+product?.avg_rating}
                      activeColor="#ffd700"
                    />
                    <span>{product.review_count} Review</span>
                  </div>
                </div>

                <button onClick={() => handleAddToWishlist(product)}>
                  <FaHeart className={s.wishlistIcon} />
                </button>
              </div>
              <span className={s.underlineName}></span>

              <p>{product.description}</p>
              <p className={s.productPrice}>
                Price: <span className={s.priceSpan}> {formattedPrice(product.price)}</span> <br />
                <span className={s.taxContent}>Price is inclusive of all taxes</span>
              </p>

              {/* Add weight, ingredients, and nutritional info for food items */}
              {/* <p className={s.weight}>
                Net Weight: <span className={s.weightSpan}>{product.weight}gms</span>
              </p>
              <p className={s.ingredients}>
                Ingredients: <span className={s.ingredientsSpan}>{product.ingredients.join(', ')}</span>
              </p>
              <p className={s.nutrition}>
                Nutritional Information: <span className={s.nutritionSpan}>{product.nutrition}</span>
              </p> */}

              <div className={s.productButtons}>
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>

              <span className={s.hr}></span>

              <p className={s.txt1}>
                <TrendingUp size={19} /> <span className={s.txtSpan}>Freshness Guaranteed</span>
              </p>
              <p className={s.txt1}>
                <Truck size={19} /> <span className={s.txtSpan}>Free Shipping on orders above ₹500</span>
              </p>
              <span className={s.hr}></span>
            </div>
          </div>

          <span className={s.hr2}></span>

          <div className={s.AddreviewContainer}>
            <div>{+product?.avg_rating}.0</div>
            <ReactStars
              classNames={s.stars}
              count={5}
              size={28}
              edit={false}
              value={+product?.avg_rating}
              activeColor="#ffd700"
            />
            <div>{product.review_count} Reviews</div>
          </div>
          <button
            className={s.addReviewButton}
            onClick={() => setIsReviewFormVisible(!isReviewFormVisible)}
          >
            Add Review
          </button>

          <span className={s.hr2}></span>

          <div className={`${s.reviewForm} ${isReviewFormVisible ? s.show : ''}`}>
            <h4>Add Your Review</h4>
            {/* Review form */}
            <textarea
              value={newReviewContent}
              onChange={(e) => setNewReviewContent(e.target.value)}
              placeholder="Write your review..."
            />
            <ReactStars
              count={5}
              size={28}
              value={newReviewRating}
              onChange={(newRating) => setNewReviewRating(newRating)}
              activeColor="#ffd700"
            />
            <button onClick={handleAddReview}>Submit Review</button>
          </div>

          {/* Similar items section */}
          {/* <div className={s.similarItemsSection}>
            <h4>Similar Products</h4>
            <Slider {...settings}>
              {products
                .filter((prod) => prod.category_name === product.category_name)
                .map((similarProduct) => (
                  <div key={similarProduct.id}>
                    <img src={similarProduct.image_url} alt={similarProduct.name} />
                    <p>{similarProduct.name}</p>
                    <p>{formattedPrice(similarProduct.price)}</p>
                  </div>
                ))}
            </Slider>
          </div> */}
{/* 
          {showFixedProductDetails && (
            <FixedProductDetails
              product={product}
              formattedPrice={formattedPrice}
              handleAddToCart={handleAddToCart}
            />
          )} */}


        </div>
      )}
    </Layout>
  );
};

export default ProductDetails;
