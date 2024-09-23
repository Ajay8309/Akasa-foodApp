import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/UserContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import {ProductProvider} from "./context/ProductContext.jsx"
import {WishlistProvider} from "./context/WishlistContext.jsx"
import {ReviewProvider} from "./context/ReviewContext.jsx"
import {HelmetProvider} from "react-helmet-async"
import {OrderProvider} from "./context/OrderContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
              <OrderProvider>
             <UserProvider>
      <ProductProvider>
       <ReviewProvider>
        <CartProvider>
          <WishlistProvider>
             <App />
          </WishlistProvider>
        </CartProvider>
       </ReviewProvider>
      </ProductProvider>
             </UserProvider>
              </OrderProvider>
            </HelmetProvider>
  </StrictMode>,
)
