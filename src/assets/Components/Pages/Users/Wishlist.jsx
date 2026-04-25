import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Api, { BASE_URL } from '../../../api/axios';
import { CartContext } from '../../../Context/CartContext';
import { FaTrash, FaStar, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState({});
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetchWishlist();
        window.scrollTo(0, 0);
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await Api.get('/wishlist/items');
            // Your API returns { products: [...] }
            setWishlistItems(response.data.products || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            // Updated to match the likely backend route format
            await Api.delete(`/wishlist/items/${productId}`);
            setWishlistItems(prev => prev.filter(item => item.productId?._id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const handleAddToCart = async (productId) => {
        setAddingToCart(prev => ({ ...prev, [productId]: true }));
        try {
            await addToCart(productId);
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (typeof path === "object" && path.url) {
    return path.url.replace("http://localhost:5000", BASE_URL);
      }
    return "https://via.placeholder.com/300";
  };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container pt-4" style={{ maxWidth: '1000px' }}>
                <div className="bg-white shadow-sm rounded-1 mb-3">
                    <div className="p-3 d-flex align-items-center justify-content-between">
                        <h5 className="mb-0 fw-bold">My Wishlist ({wishlistItems.length})</h5>
                    </div>
                </div>
                {/* <div className=""> */}
{/* bg-white shadow-sm rounded-1 */}

                    {wishlistItems.length === 0 ? (
                        <div className="bg-white shadow-sm rounded-1 text-center py-5">

                            <h4 className="fw-bold">Empty Wishlist</h4>
                            <p className="text-muted">You have no items in your wishlist.</p>
                            <Link to="/dashboard" className="btn btn-primary px-5 mt-2">Shop Now</Link>
                        </div>
                    ) : (
                         wishlistItems.map((item) => {
                            const product = item.productId;
                            if (!product) return null;

                            return (
                                <div key={item._id} className="bg-white  rounded-1 p-4 mb-3">
                                    <div className="d-flex gap-4 flex-column flex-md-row">
                                        <div className="text-center" style={{ minWidth: '150px' }}>
                                            <img
                                                src={getImageUrl(product?.image)}
                                                alt={product.name}
                                                style={{ width: '112px', height: '112px', objectFit: 'contain' }}
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/112"; }}
                                            />
                                        </div>

                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1 text-dark" style={{ fontSize: '18px' }}>{product.name}</h6>
                                                    <p className="text-muted small mb-2">{product.brand}</p>
                                                </div>
                                                <button
                                                    className="btn text-muted p-0"
                                                    onClick={() => removeFromWishlist(product._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                                    4.3 <FaStar size={10} />
                                                </span>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <span className="h4 fw-bold mb-0">₹{product.price?.toLocaleString()}</span>
                                                {product.mrp && (
                                                    <span className="text-muted text-decoration-line-through small">₹{product.mrp?.toLocaleString()}</span>
                                                )}
                                            </div>

                                            <div className="d-flex gap-3">
                                                <button
                                                    className="btn btn-primary btn-sm px-4 fw-bold d-flex align-items-center gap-2"
                                                    onClick={() => handleAddToCart(product._id)}
                                                    disabled={addingToCart[product._id]}
                                                >
                                                    {addingToCart[product._id] ? (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    ) : (
                                                        <FaShoppingCart />
                                                    )}
                                                    {addingToCart[product._id] ? 'ADDING...' : 'ADD TO CART'}
                                                </button>
                                                <Link to={`/product/${product._id}`} className="btn btn-outline-secondary btn-sm px-3">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                {/* </div> */}
            </div>
        </div>
    );
};

export default Wishlist;