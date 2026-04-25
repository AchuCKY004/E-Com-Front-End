import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterPage from "../Pages/Register.jsx";
import LoginPage from "../Pages/Loginpage.jsx";
import OtpPage from "../Pages/OtpPage.jsx";


import Dashboard from "../Pages/Users/Dashboard.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import Cart from '../Pages/Users/Cart.jsx';
import Wishlist from "../Pages/Users/Wishlist.jsx";
import Orders from "../Pages/Users/Orders.jsx"
import ProtectedRoutes from "../Routes/ProtectedRoutes.jsx";
import ProductCard from "../Pages/Users/ProductCard.jsx";
import ProductDetails from "../Pages/Users/ProductDetails.jsx";
import { CartProvider } from '../../Context/CartContext.jsx';
import UserLayout from "../Pages/Users/Layout.jsx";
import AddressSection from "../Pages/Users/AddressSection.jsx";
import Checkout from "../Pages/Users/CheckOutPage.jsx";



import AdminDashboard from "../Pages/Admin/Dashboard.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import AddProduct from "../Pages/Admin/AddProduct.jsx";
import Layout from "../Pages/Admin/SideBar.jsx";
import ProductList from "../Pages/Admin/ProductList.jsx";
import EditProduct from "../Pages/Admin/EditProducts.jsx";
import AdminOrders from "../Pages/Admin/Order.jsx";
import CategoryManagement from "../Pages/Admin/Category.jsx";
import UserManagement from "../Pages/Admin/UserManagement.jsx";
import Notifications from "../Pages/Admin/Notification.jsx";


function AppRoutes() {
    return (
        <BrowserRouter>
            {/* <CartProvider> */}

            <Routes>
                <Route path="/" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/otp" element={<OtpPage />} />


                <Route path="/navbar" element={<Navbar />} />
                <Route path="/products" element={<ProductCard />} />
                <Route path="/address" element={<AddressSection />} />

                <Route element={<CartProvider><UserLayout /></CartProvider>}>
                    <Route path="/cart" element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
                    <Route path="/checkout" element={<ProtectedRoutes><Checkout /></ProtectedRoutes>} />
                    <Route path="/product/:id" element={<ProtectedRoutes><ProductDetails /></ProtectedRoutes>} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/dashboard" element={<ProtectedRoutes><CartProvider><Dashboard /></CartProvider></ProtectedRoutes>} />
                </Route>


                <Route path="/admin/dashboard" element={<AdminRoutes><Layout><AdminDashboard /> </Layout></AdminRoutes>} />
                <Route path="/admin/add-product" element={<AdminRoutes><Layout><AddProduct /> </Layout></AdminRoutes>} />
                <Route path="/admin/product-list" element={<AdminRoutes><Layout><ProductList /></Layout></AdminRoutes>} />
                <Route path="/admin/edit-product/:id" element={<AdminRoutes><Layout><EditProduct /></Layout></AdminRoutes>} />
                <Route path="/admin/orders" element={<AdminRoutes><Layout><AdminOrders /></Layout></AdminRoutes>} />
                <Route path="/admin/category" element={<AdminRoutes><Layout><CategoryManagement /></Layout></AdminRoutes>} />
                <Route path="/admin/users" element={<AdminRoutes><Layout><UserManagement /></Layout></AdminRoutes>} />
                <Route path="/admin/notifications" element={<AdminRoutes><Layout><Notifications /></Layout></AdminRoutes>} />


                <Route path="*" element={<h1>Page Not Found</h1>} />

            </Routes>
            {/* </CartProvider> */}
        </BrowserRouter>
    )
}

export default AppRoutes;



// // Create a simple wrapper component
// const UserCartWrapper = ({ children }) => (
//   <CartProvider>
//     {children}
//   </CartProvider>
// );

// // Then in your routes:
// <Route path="/cart" element={<ProtectedRoutes><UserCartWrapper><Cart /></UserCartWrapper></ProtectedRoutes>} />