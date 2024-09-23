import React, { useState, useEffect, useRef } from 'react';
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useWishlist } from "../../context/WishlistContext";
import { LogOut, ShoppingCart, User, Heart } from "react-feather";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Nav.module.css"; // Importing the module
import { FaSearch, FaPizzaSlice, FaHamburger, FaIceCream, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import Healthy from "../../assets/menu-1.png";
import menu2 from "../../assets/menu-2.png";
import menu3 from "../../assets/menu-3.png";
import menu4 from "../../assets/menu-4.png";
import menu5 from "../../assets/menu-5.png";

import { useProduct } from '../../context/ProductContext';

const Nav = () => {
  const { cartTotal } = useCart();
  const { wishlistTotal } = useWishlist();
  const { isLoggedIn, userData, logout } = useUser(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isThirdNavFixed, setIsThirdNavFixed] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const lowerNavRef = useRef(null);
  const navigate = useNavigate();
  const { setPage, getProductByCategory, getProductsByName } = useProduct();

  const handleScroll = () => {
    setIsThirdNavFixed(window.scrollY > 120);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      getProductsByName(searchQuery);
      navigate('/products'); // Navigate to products page after search
      setSearchQuery(''); // Clear search input after search
    }
  };

  const handleCategory = (name) => {
    setPage(1);
    getProductByCategory(name);
    setActiveLink(name);
  };

  const scrollNav = (direction) => {
    const scrollAmount = 200;
    lowerNavRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.upperNav}>
        <Link to="/" className={styles.Logo}>
          <h1>TasteBud</h1>
        </Link>
        
        <div className={styles.searchBox}>
          <form onSubmit={handleSearch}>
            <input
              type='text'
              className={styles.searchInput}
              placeholder='Search for food, dishes...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.search}>
              <FaSearch className={styles.searchBtn} />
            </button>
          </form>
        </div>

        <ul className={styles.links}>
          {!isLoggedIn && (
            <>
              <li className={styles.logLink}>
                <Link to="/login" className={styles.loginLink}>
                  <span>Login</span>
                </Link>
              </li>
              <li className={styles.cartLink}>
                <Link to="/cart">
                  <button className={styles.cartBtn}>
                    <ShoppingCart className={styles.cartImg} />
                    <div className={styles.cartTotal}>{cartTotal}</div>
                  </button>
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <>
              <li className={styles.wishlistLink}>
                <Link to="/wishlist">
                  <button className={styles.wishlistBtn}>
                    <Heart className={styles.heartImg} />
                    <div className={styles.wishlistTotal}>{wishlistTotal}</div>
                  </button>
                </Link>
              </li>
              <li className={styles.cartLink}>
                <Link to="/cart">
                  <button className={styles.cartBtn}>
                    <ShoppingCart className={styles.cartImg} />
                    <div className={styles.cartTotal}>{cartTotal}</div>
                  </button>
                </Link>
              </li>
              <li className={styles.AccountLink}>
                <button
                  className={styles.AccountBtn}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={styles.AccountText}>Account</span>
                  <User className={styles.userImg} />
                </button>
                <div className={`${styles.AccountBox} ${isDropdownOpen ? styles.open : ''}`}>
                  <div className={styles.name}>
                    <p>{userData?.fullname?.split(" ").join(" ")}</p>
                    <p>@{userData?.username}</p>
                  </div>
                  <div className={styles.profile}>
                    <Link to="/profile" className={styles.underline}>Profile</Link>
                  </div>
                  <div className={styles.orders}>
                    <Link to="/order" className={styles.underline}>Orders</Link>
                  </div>
                  <div className={styles.logout}>
                    <Link to="/login" onClick={() => logout()} className={styles.underline}>Logout</Link>
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Lower Nav */}
      <div className={styles.lowerNavContainer}>
        <button className={styles.scrollButton} onClick={() => scrollNav('left')}>
          <FaChevronLeft />
        </button>

        <ul className={styles.lowerNavLinks} ref={lowerNavRef}>
          <Link to="/products" className={styles.directLinks}>
            <li className={`${styles.link} ${activeLink === 'All' ? styles.active : ''}`}>
              <img src={Healthy} alt="All" className={styles.categoryImage} />
              <div>All</div>
            </li>
          </Link>
          <Link to="/products" className={styles.directLinks}>
            <li className={`${styles.link} ${activeLink === 'Burgers' ? styles.active : ''}`} onClick={() => handleCategory('Burgers')}>
              <img src={menu2} alt="Burgers" className={styles.categoryImage} />
              <div>Burgers</div>
            </li>
          </Link>
          <Link to="/products" className={styles.directLinks}>
            <li className={`${styles.link} ${activeLink === 'Pizza' ? styles.active : ''}`} onClick={() => handleCategory('Pizza')}>
              <img src={menu3} alt="Pizza" className={styles.categoryImage} />
              <div>Pizza</div>
            </li>
          </Link>
          <Link to="/products" className={styles.directLinks}>
            <li className={`${styles.link} ${activeLink === 'Desserts' ? styles.active : ''}`} onClick={() => handleCategory('Desserts')}>
              <img src={menu4} alt="Desserts" className={styles.categoryImage} />
              <div>Desserts</div>
            </li>
          </Link>
          <Link to="/products" className={styles.directLinks}>
            <li className={`${styles.link} ${activeLink === 'Other' ? styles.active : ''}`} onClick={() => handleCategory('Other')}>
              <img src={menu5} alt="Other" className={styles.categoryImage} />
              <div>Other</div>
            </li>
          </Link>
        </ul>

        <button className={styles.scrollButton} onClick={() => scrollNav('right')}>
          <FaChevronRight />
        </button>
      </div>
    </nav>
  );
};

export default Nav;
