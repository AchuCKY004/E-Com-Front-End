import React, { useContext } from 'react';
import { CartContext } from '../../../Context/CartContext';
import { BASE_URL } from '../../../api/axios';
import { FaMinus, FaPlus, FaShieldAlt } from 'react-icons/fa';
import { Link ,useNavigate } from 'react-router-dom';


const Cart = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
      if (typeof path === "object" && path.url) {
    return path.url.replace("http://localhost:5000", BASE_URL);
  }
    if (typeof path === 'string') {
      return path.replace("http://localhost:5000", BASE_URL);
    }
    return "https://via.placeholder.com/300";
  };

    // Calculate total savings
    const totalSavings = cartItems.reduce((acc, item) =>
        acc + ((item.productId?.mrp - item.productId?.price) * item.quantity), 0
    );
    // // Memoize or calculate savings safely
    // const totalSavings = cartItems.reduce((acc, item) => {
    //     const mrp = item.productId?.mrp || 0;
    //     const price = item.productId?.price || 0;
    //     return acc + ((mrp - price) * item.quantity);
    // }, 0);

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '100px' }}>
            <div className="container pt-4">
                <div className="row g-3">
                    {/* Left Side */}
                    <div className="col-lg-8">
                        {/* Address Bar */}
                        <div className="bg-white p-3 d-flex justify-content-between align-items-center shadow-sm mb-2 rounded-1">
                            <span style={{ fontSize: '14px' }}>From Saved Addresses</span>
                            <button className="btn btn-outline-primary btn-sm fw-bold" style={{ fontSize: '12px' }} onClick={() => navigate("/address")}>
                                Add Delivery Address
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="bg-white shadow-sm rounded-1 text-center py-5">

                                <h4 className="fw-bold">Empty Cart</h4>
                                <p className="text-muted">You have no items in your Cart.</p>
                                <Link to="/dashboard" className="btn btn-primary px-5 mt-2">Shop Now</Link>
                            </div>
                        ) : (
                            cartItems.map((item) => {
                                const product = item.productId;
                                if (!product) return null;
                                return (
                                    <div key={item.productId?._id} className="bg-white shadow-sm rounded-1 mb-3">
                                        <div className="p-3 d-flex gap-4">
                                            {/* Image & Quantity */}
                                            <div className="text-center">
                                                <img
                                                    src={getImageUrl(item.productId?.image)}
                                                    alt=""
                                                    style={{ width: '112px', height: '112px', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}

                                                />
                                                <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                    <button className="btn btn-sm border rounded-circle" onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                                                    <input type="text" className="form-control form-control-sm text-center bg-white p-0" value={item.quantity} style={{ width: '40px', fontWeight: 'bold' }} readOnly />
                                                    <button className="btn btn-sm border rounded-circle" onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1" style={{ fontSize: '16px', fontWeight: '400' }}>{item.productId?.name}</h6>
                                                <p className="text-muted small mb-2">Seller: {item.productId?.brand}</p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-success fw-bold small">{Math.round(((item.productId?.mrp - item.productId?.price) / item.productId?.mrp) * 100)}% Off</span>
                                                    <span className="text-muted text-decoration-line-through small">₹{(item.productId?.mrp * item.quantity).toLocaleString()}</span>
                                                    <span className="h5 fw-bold mb-0">₹{(item.productId?.price * item.quantity).toLocaleString()}</span>

                                                </div>
                                                <div className="mt-3">
                                                    <Link to={`/product/${product._id}`} className="btn btn-outline-secondary btn-sm px-3">
                                                        View Details
                                                    </Link></div>


                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex border-top">
                                            <button className="btn flex-grow-1 py-3 fw-bold text-uppercase border-end rounded-0 hover-gray" style={{ fontSize: '14px' }}>Save for later</button>
                                            <button className="btn flex-grow-1 py-3 fw-bold text-uppercase border-end rounded-0 hover-gray" onClick={() => removeFromCart(item.productId._id)} style={{ fontSize: '14px' }}>Remove</button>
                                            <button className="btn flex-grow-1 py-3 fw-bold text-uppercase rounded-0 hover-gray" onClick={() => removeFromCart(item.productId._id)} style={{ fontSize: '14px' }}>Buy this now</button>
                                        </div>
                                    </div>
                                );
                            })



                        )}

                    </div>

                    {/* Right Side (Sidebar) */}
                    <div className="col-lg-4">
                        <div className="price-details-card sticky-desktop bg-white shadow-sm rounded-1  position-fixed" style={{ zIndex: 100, width: "350px" }}>
                            <div className="p-3 border-bottom">
                                <span className=" price-details-title text-muted fw-bold text-uppercase small">Price Details</span>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Price ({cartCount} items)</span>
                                    <span>₹{(cartTotal + totalSavings).toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Discount</span>
                                    <span className="text-success">- ₹{totalSavings.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Delivery Charges</span>
                                    <span className="text-success">FREE</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold border-top border-dashed pt-3 mt-3" style={{ fontSize: '18px' }}>
                                    <span>Total Amount</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="savings-highlight mt-3 p-2 rounded-1" style={{ backgroundColor: '#fafff5', border: '1px dashed #c0e1b1' }}>
                                    <p className="text-success fw-bold small mb-0">
                                        You'll save ₹{totalSavings.toLocaleString()} on this order
                                    </p>
                                </div>
                            </div>
                            <br />
                            <div className="mt-3 d-flex align-items-center gap-2 text-muted p-2">
                                <FaShieldAlt size={30} />
                                <span style={{ fontSize: '12px', lineHeight: '1.2' }}>
                                    Safe and secure payments. Easy returns. 100% Authentic products.
                                </span>
                            </div>
                            {/* Sticky Order Footer */}
                            <div className="p-3 d-flex justify-content-end sticky-bottom bg-white border-top shadow-lg" style={{ bottom: 0, zIndex: 100 }}>
                                <button className="btn fw-bold py-2 px-5" style={{ backgroundColor: '#fb641b', color: '#fff', borderRadius: '2px', fontSize: '16px' }} onClick={() => navigate("/checkout")}>
                                    PLACE ORDER
                                </button>
                            </div>

                        </div>
                        

                        {/* Trust Tag */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;