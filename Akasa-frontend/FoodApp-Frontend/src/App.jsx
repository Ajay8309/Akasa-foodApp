import React, { Profiler } from 'react'
import { Suspense } from 'react'
import Spinner from "./components/Spinner/spinner";
import {Toaster} from "react-hot-toast"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Login, Signup, LandingPage,ProductList, ProductDetails, Cart, Profile, Checkout, Wishlist, Order, OrderDetails} from './pages'
// import Layout from './layout/layout';
// import ProtectedRoute from "./routes/protected.route"


const App = () => {
  return (
    <BrowserRouter>
     {/* <Suspense
        fallback={    
          <Layout>
            <Spinner size={100} />
          </Layout>
        }
      ></Suspense> */}
     <Toaster position="top-right" />
      
    <Routes>

      {/* <ProtectedRoute> */}
      <Route path="/signup" element = {<Signup/>}/>
      <Route path="/login" element = {<Login/>}/>
      {/* </ProtectedRoute> */}
      <Route index element={<LandingPage/>} /> 
      {/* Landing page  */}
      <Route path='/products' element={<ProductList />} />

      <Route path="/products/:id" element={<ProductDetails/>}/>
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element = {<Profile/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/order" element={<Order/>}/>
      <Route path="/order/:id" element={<OrderDetails/>}/>
{/*       
      // <Route path="/reset-password" element={<ResetPassword />} />  */}

    </Routes>
    </BrowserRouter>
  )
}

export default App