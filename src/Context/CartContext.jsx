// import { createContext, useEffect, useState } from "react";
// import Api from "../api/axios";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cartItems, setCartItems] = useState([]);
//     const [cartCount, setCartCount] = useState(0);




//     const fetchCartCount = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         try {
//             const response = await Api.get("/cart/items");
//             setCartItems(response.data.cartitems);
//             setCartCount(response.data.cartitems.length);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         fetchCartCount();
//     }, []);

//     return (
//         <CartContext.Provider value={{ fetchCartCount, cartCount, cartItems }}>
//             {children}
//         </CartContext.Provider>
//     );
// }


import { createContext, useEffect, useState, useMemo } from "react";
import Api from "../api/axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCartItems = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await Api.get("/cart/items");
            const items = response?.data?.cartitems || [];
            setCartItems(items);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await Api.post("/cart/add", { productId, quantity });
            fetchCartItems();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return removeFromCart(productId);
        try {
            await Api.put(`/cart/items/${productId}`, { quantity: newQuantity });
            await fetchCartItems();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await Api.delete(`/cart/items/${productId}`);
            await fetchCartItems();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

   

    const cartCount = useMemo(() => {
          return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    }, [cartItems]);
 
    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, items) => {
            const price = items.productId.price || items.price || 0 ;
            return total + (price * (items.quantity || 0));
        }, 0);
    }, [cartItems]);


    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            isLoading,
            fetchCartItems,
            addToCart,
            updateQuantity,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
