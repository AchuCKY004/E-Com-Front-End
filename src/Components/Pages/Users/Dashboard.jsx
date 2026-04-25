// import React, { useState } from "react";
// import ProductCard from "./ProductCard.jsx";
// import Orders from "./Orders.jsx";
// import Wishlist from "./Wishlist.jsx";

// function Dashboard() {
//   // You can still manage the active tab state here if 
//   // you pass setActiveTab to the MiniNavbar in the Layout, 
//   // or use a shared state/URL search params.
//   const [activeTab, setActiveTab] = useState("products");

//   const content = {
//     products: <ProductCard />,
//     orders: <Orders />,
//     wishlist: <Wishlist />,
//   };

//   return (
//     <div className="mt-3">
//       {content[activeTab]}
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect, useContext } from "react";
import Api from "../../../api/axios";
import ProductCard from "./ProductCard.jsx";
import { CartContext } from "../../../Context/CartContext.jsx";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchCartItems }  = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Api.get("/products");
                // Based on your JSON, we assume response.data is the array
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        fetchCartItems();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading Products...</div>;

    return (
        <div className="row g-4">
            {products.map((item) => (
                <div key={item._id} className="col-12 col-md-6 col-lg-4">
                    <ProductCard product={item} />
                </div>
            ))}
        </div>
    );
}

export default Dashboard;