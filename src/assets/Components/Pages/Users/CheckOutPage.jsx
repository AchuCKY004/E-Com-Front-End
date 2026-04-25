import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../Context/CartContext';
import Api from '../../../api/axios';
import { toast } from 'react-toastify';
import AddressSection from './AddressSection';
import { FaCreditCard, FaTruck, FaShoppingBag } from 'react-icons/fa';

const Checkout = () => {
    // 1. Destructure the correct names from Context
    const { cartItems = [], cartTotal = 0, clearCart } = useContext(CartContext) || {};

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            return toast.error("Please select a delivery address");
        }

        setLoading(true);
        try {
            const orderPayload = {
                address: selectedAddressId,
                paymentMethod: "COD"
            };

            const response = await Api.post('/orders/place/cart', orderPayload);

            if (response.status === 201 || response.status === 200) {
                toast.success("Order placed successfully! 🎉");
                if (clearCart) clearCart(); // Clear local state after success
                navigate('/orders'); // Usually plural in most setups
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    // 2. Update the empty check to use cartItems
    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <FaShoppingBag size={50} className="text-muted mb-3" />
                <h3>Your cart is empty</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="container  ">
            <h3 className="fw-bold mb-4">Checkout</h3>
            <div className="row g-4">
                {/* Left Column: Address Selection */}
                <div className="col-lg-8">
                    <AddressSection
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                    />

                    <div className="card border-0 shadow-sm p-4 mt-4">
                        <h5 className="fw-bold mb-3"><FaCreditCard className="me-2 text-primary" /> Payment Method</h5>
                        <div className="border p-3 rounded bg-light d-flex align-items-center">
                            <input type="radio" checked readOnly name="payment" id="cod" className="me-2" />
                            <label htmlFor="cod" className="mb-0 fw-bold">Cash on Delivery (COD)</label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-4">Order Summary</h5>

                        <div className="mb-3">
                            {cartItems.map(item => (
                                <div key={item.productId?._id} className="d-flex justify-content-between mb-2 small">
                                    <span className="text-muted">{item.productId?.name} (x{item.quantity})</span>
                                    <span className="fw-bold">₹{(item.productId?.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 text-success">
                            <span>Delivery</span>
                            <span>FREE</span>
                        </div>

                        <div className="d-flex justify-content-between mt-3 mb-4 h5 fw-bold text-dark">
                            <span>Total Amount</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>

                        <button
                            className="btn btn-warning w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                                <><FaTruck /> CONFIRM ORDER</>
                            )}
                        </button>
                        <p className="text-center text-muted small mt-3">
                            Secure Checkout | 7 Day Returns
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;