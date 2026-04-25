// import React, { useEffect, useState, useContext } from "react";
// import Api from "../../../api/axios";
// import icon from '../../../assets/iconn.png';
// import { toast } from "react-toastify";
// import { CartContext } from "../../../Context/CartContext";


// function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { fetchCartCount } = useContext(CartContext);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await Api.get("/products");
//       setProducts(response.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addtoCart = async (productId) => {
//     try {
//       const response = await Api.post("/cart/add", {
//         productId: productId,
//         quantity: 1,
//       });
//       fetchCartCount();
//       toast.success("Item added to Cart");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (loading) return <p>Loading Products......</p>

//   return (
//     <div className="container mt-4">
//       <div className="row g-3">
//         {products.map((items) => (
//           <div className="col-4 col-md-2 col-lg-3 mt-3" key={items._id}>

//             <div className="product-card h-100 shadow-lg p-2 onClick={() => navigate(`/product/${items._id}`)} "style={{ cursor: 'pointer' }}>

//               <img
//                 src={items.imageUrl || icon}
//                 alt={items.name}
//                 className="img-fluid"
//                 style={{ height: "150px", objectFit: "contain" }}
//               />

//               <h6 className="mt-2 text-truncate">{items.name}</h6>

//               <p className="fw-bold mb-1">₹{items.price}</p>

//               <p
//                 className="text-muted"
//                 style={{
//                   fontSize: "12px",
//                   height: "30px",
//                   overflow: "hidden",
//                 }}
//               >
//                 {items.description}
//               </p>

//               <button className="btn btn-primary btn-sm mt-auto" onClick={() => addtoCart(items._id)}>
//                 Add to Cart
//               </button>


//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Products;

// import React, { useEffect, useState, useContext } from "react";
// import Api from "../../../api/axios";
// import icon from '../../../assets/iconn.png';
// import { toast } from "react-toastify";
// import { CartContext } from "../../../Context/CartContext";
// import { useNavigate } from "react-router-dom"; 

// function Products() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]); // lowercase 'p'
//   const [loading, setLoading] = useState(true);
//   const { fetchCartCount } = useContext(CartContext);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await Api.get("/products");
//       setProducts(response.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addtoCart = async (productId) => {
//     try {
//       await Api.post("/cart/add", {
//         productId: productId,
//         quantity: 1,
//       });
//       fetchCartCount();
//       toast.success("Item added to Cart");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (loading) return <p className="text-center mt-5">Loading Products......</p>;

//   return (
//     <div className="container mt-4">
//       <div className="row g-3">
//         {/* FIX: Use products (the state) instead of Products (the function) */}
//         {products.map((items) => (
//           <div className="col-6 col-md-4 col-lg-3 mt-3" key={items._id}>
//             <div 
//               className="product-card h-100 shadow-lg p-3 d-flex flex-column" 
//               onClick={() => navigate(`/product/${items._id}`)} 
//               style={{ cursor: 'pointer', borderRadius: '15px' }}
//             >
//               <img
//                 src={items.imageUrl?.replace("localhost", "192.168.1.8") || icon}
//                 alt={items.name}
//                 className="img-fluid mb-2"
//                 style={{ height: "150px", objectFit: "contain" }}
//               />

//               <h6 className="mt-2 text-truncate fw-bold">{items.name}</h6>
//               <p className="fw-bold mb-1 text-primary">₹{items.price.toLocaleString()}</p>

//               <p className="text-muted small" style={{ height: "40px", overflow: "hidden" }}>
//                 {items.description}
//               </p>

//               <button 
//                 className="btn btn-primary btn-sm mt-auto w-100" 
//                 onClick={(e) => {
//                   e.stopPropagation(); // Prevents navigating to details when clicking button
//                   addtoCart(items._id);
//                 }}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Products;

import React, { useContext, useState } from 'react';
import { CartContext } from '../../../Context/CartContext';
import Api, { BASE_URL } from '../../../api/axios';
import { Link } from 'react-router-dom';


const ProductCard = ({ product }) => {
  const { fetchCartCount } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);



  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return "https://via.placeholder.com/50";
  //   // This replaces "http://localhost:5000" with "http://192.168.1.13:5000"
  //   return imagePath.replace("http://localhost:5000", BASE_URL);
  // };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;

      if (typeof path === "object" && path.url) {
        return path.url.replace("http://localhost:5000", BASE_URL);
      }

    // if (typeof path === 'string') {
    //   return path.replace("http://localhost:5000", BASE_URL);
    // }
    return "https://via.placeholder.com/300";
  };

  const isOutOfStock = (product?.quantity || 0) <= 0;

  return (

    <div className="card h-100 shadow-sm border-0">
      <Link to={`/product/${product._id}`} className="text-decoration-none">
      <div className="text-center p-3">
        <img
          src={getImageUrl(product?.image)}
          className="card-img-top img-fluid "
          alt={product?.name}
          style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}

        />
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-bold text-dark mb-0" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 1, // Limits name to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70%' // Ensures badge has space
            }}>{product?.name}</h6>
          <span className={`badge rounded-pill ${isOutOfStock ? 'bg-danger' : 'bg-success'}`}>
            {isOutOfStock ? 'Sold Out' : 'In Stock'}
          </span>
        </div>

        <p className="card-text text-muted small flex-grow-1  "style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 1, // Limits name to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70%' // Ensures badge has space
            }}>
          {product?.description?.substring(0, 60)}...
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-baseline mb-3">
            <span className="h5 fw-bold text-primary mb-0">₹{product?.price}</span>
            {!isOutOfStock && (
              <small className="text-muted">{product?.quantity} left</small>
            )}
          </div>

  
        </div>
      </div>
      </Link>
    </div>
  );
};

export default ProductCard;