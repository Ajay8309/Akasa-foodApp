import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import { useProduct } from '../../context/ProductContext';
import SimilarItems from '../../components/SimilarItems/SimilarItem';
import Slider from 'react-slick';
import './LandingPage.css';

const LandingPage = () => {
  const { products } = useProduct();
  const [categories, setCategories] = useState([]);

  const validProducts = Array.isArray(products) ? products : [];

  const getCategoryImageSrc = (categoryName) => {
    // Add your category image logic here
  };

  useEffect(() => {
    if (validProducts.length > 0) {
      const getCategories = memoize(() => {
        return Array.from(new Set(validProducts.map(product => product.category_name)));
      });
      setCategories(getCategories());
    }
  }, [validProducts]);

  const pizzas = validProducts.filter(product => product.category_name.toLowerCase() === 'pizza');
  const Burgers = validProducts.filter(product => product.category_name.toLowerCase() === 'burgers');


  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Layout>
      <div className="bannerContainer">
        {/* <Slider {...bannerSettings}> */}
          <div>
            <img 
              src="https://img.pikbest.com/wp/202413/business-simple-geometric-food-restaurant-promotional-banner_6022754.jpg!w700wp" 
              alt="Restaurant Promotion" 
              className="bannerImage" 
            />
          </div>
        {/* </Slider> */}
      </div>

      <div className="giftedSection">
        <h1>Pizzas</h1>
        <h3>Checkout the Most Loved Pizzas</h3>
      </div>

      <div className="pizzasSection">
        <div className="pizzaCardsContainer">
          {pizzas.length > 0 ? (
            pizzas.map(pizza => (
              <div key={pizza.product_id} className="pizzaCard">
                <SimilarItems product={pizza} />
              </div>
            ))
          ) : (
            <p>No pizzas available at the moment.</p>
          )}
        </div>
      </div>

      <div className="giftedSection1">
        <h1>Order By Category</h1>
        <h3>Browse through your Favorite Categories</h3>
      </div>

      <div className="CategoryContainer">
        {categories.map(category => (
          <div key={category} className="categoryCard">
            <img src={getCategoryImageSrc(category)} alt={category} className="categoryImage" />
            <h2>{category}</h2>
          </div>
        ))}
      </div>

      <div className="giftedSection">
        <h1>Top Burgers</h1>
        <h3>Checkout the Most Selling Burgers</h3>
      </div>


      <div className="pizzasSection">
      <div className="pizzaCardsContainer">
          {Burgers.length > 0 ? (
            Burgers.map(Burger => (
              <div key={Burger.product_id} className="pizzaCard">
                <SimilarItems product={Burger} />
              </div>
            ))
          ) : (
            <p>No Burgers available at the moment.</p>
          )}
        </div>
      </div>



    </Layout>
  );
};

function memoize(fn) {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    if (!(stringifiedArgs in cache)) {
      cache[stringifiedArgs] = fn(...args);
    }
    return cache[stringifiedArgs];
  };
}

export default LandingPage;
