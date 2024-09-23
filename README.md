# 🌟 Akasa Food Ordering Platform




## 📝 Introduction
This project is a full-stack food ordering platform built with **Node.js (Express)** for the backend, **React** for the frontend, and **PostgreSQL** as the database. It allows users to browse food items, manage a cart, place orders, and make payments through the **Razorpay** payment gateway. The platform ensures security via **JWT** and **bcrypt** for authentication and password management.


https://github.com/user-attachments/assets/f57bccdd-5af5-4936-ba48-e62166322135


## ⚡ Features
- **User Registration and Authentication:** Secure JWT-based authentication with bcrypt for password hashing.
- **Browse Food Items:** View items categorized by type (e.g., beverages, desserts), with options to filter and search by category.
- **Cart Management:** Users can add items to the cart, modify quantities, and access their cart across sessions.
- **Checkout with Razorpay:** Secure payment processing through Razorpay during checkout.
- **Order History & Tracking:** Users can view their past orders, track the status, and reorder with ease.
- **Wishlist:** Save food items for future purchases.
- **Reviews:** Customers can leave reviews and ratings on food items and view feedback from others.

## 📦 Installation Guide

## The platform ensures secure handling of user data and transactions through:

Password Hashing: User passwords are hashed using bcrypt, which also uses salts for additional security.
JWT Authentication: After login, users receive a JWT token for secure communication with the backend.
Razorpay Payment Gateway: Integrated for secure payment processing.





### Clone the Repository
```bash
git clone https://github.com/Ajay8309/Akasa-foodApp.git
cd Akasa-Backend
npm install
npm run dev

cd Akasa-Frontend/Akasa-foodapp
npm install
npm run dev

