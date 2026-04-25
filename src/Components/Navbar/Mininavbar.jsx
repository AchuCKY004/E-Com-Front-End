// import React, { useState, useEffect } from 'react';
// import { FaBox, FaHeart, FaShoppingBag } from "react-icons/fa";


// function MiniNavbar({ activeTab, setActiveTab }) {


//     const tabs = [
//         { key: "products", label: "Products", icon: <FaShoppingBag />, path: "/dashboard" },
//         { key: "orders", label: "Orders", icon: <FaBox />, path: "/orders" },
//         { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },

//     ];

//     return (

//         <div className=" text-dark justify-content-between align-items-center ">
//             <ul className="list-unstyled d-flex justify-content-center align-items-center gap-5 border-top border-bottom py-2">
//                 {
//                     tabs.map((tab) => (
//                         <li key={tab.key}
//                             onClick={() => setActiveTab(tab.key)}
//                             style={{ cursor: "pointer" }}
//                             className={`d-flex flex-column align-items-center ${activeTab === tab.key ? "text-primary" : ""
//                                 }`}>
//                             {tab.icon}
//                             <span>{tab.label}</span>
//                         </li>
//                     ))
//                 }
//             </ul>

//         </div>
//     );

// }
// export default MiniNavbar;

import React from 'react';
import { FaBox, FaHeart, FaShoppingBag } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // Import these

function MiniNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { key: "products", label: "Products", icon: <FaShoppingBag />, path: "/dashboard" },
        { key: "orders", label: "Orders", icon: <FaBox />, path: "/orders" },
        { key: "wishlist", label: "Wishlist", icon: <FaHeart />, path: "/wishlist" },
    ];

    return (
        <div className="text-dark justify-content-between align-items-center">
            <ul className="list-unstyled d-flex justify-content-center align-items-center gap-5 border-top border-bottom py-2 bg-white">
                {tabs.map((tab) => (
                    <li 
                        key={tab.key}
                        onClick={() => navigate(tab.path)} // Use navigate instead of setActiveTab
                        style={{ cursor: "pointer" }}
                        className={`d-flex flex-column align-items-center ${
                            location.pathname === tab.path ? "text-primary fw-bold" : "text-muted"
                        }`}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                        <span style={{ fontSize: '12px', marginTop: '4px' }}>{tab.label}</span>
                        
                        {/* Optional: Add a little blue underline for the active tab like Flipkart */}
                        {location.pathname === tab.path && (
                            <div style={{ 
                                height: '2px', 
                                width: '100%', 
                                backgroundColor: '#2874f0', 
                                marginTop: '2px' 
                            }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MiniNavbar;