CREATE TABLE public.users
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    roles VARCHAR(10)[] DEFAULT '{customer}'::VARCHAR[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.categories
(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE public.products
(
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category_id INTEGER REFERENCES public.categories (category_id) ON DELETE SET NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    weight REAL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.cart
(
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES public.users (user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE public.cart_items
(
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES public.cart (cart_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products (product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, product_id)
);

CREATE TABLE public.orders
(
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users (user_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,  -- e.g., 'Processing', 'Delivered', 'Cancelled'
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_amount REAL NOT NULL,
    tracking_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(50)
);


CREATE TABLE public.order_items
(
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES public.orders (order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products (product_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);


CREATE TABLE public.wishlist
(
    wishlist_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users (user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE public.wishlist_items
(
    wishlist_item_id SERIAL PRIMARY KEY,
    wishlist_id INTEGER REFERENCES public.wishlist (wishlist_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products (product_id) ON DELETE SET NULL,
    UNIQUE (wishlist_id, product_id)
);

CREATE TABLE public.reset_tokens
(
    token_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(200) NOT NULL,
    used BOOLEAN DEFAULT false NOT NULL,
    expiration TIMESTAMP
);

CREATE TABLE public.reviews
(
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users (user_id) ON DELETE SET NULL,
    product_id INTEGER REFERENCES public.products (product_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
