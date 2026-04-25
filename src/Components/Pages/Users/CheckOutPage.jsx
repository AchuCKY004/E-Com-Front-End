// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { CartContext } from '../../../Context/CartContext';
// import Api from '../../../api/axios';
// import { toast } from 'react-toastify';
// import AddressSection from './AddressSection';
// import { FaCreditCard, FaTruck, FaShoppingBag } from 'react-icons/fa';

// const Checkout = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Context data for Cart
//     const { cartItems: contextItems = [], cartTotal: contextTotal = 0, clearCart } = useContext(CartContext) || {};

//     const [items, setItems] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [isSingleOrder, setIsSingleOrder] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState("COD");

//     // Address state - storing the string as per backend requirement
//     const [selectedAddressId, setSelectedAddressId] = useState(null);
//     const [selectedAddress, setSelectedAddress] = useState("");
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (location.state?.singleProduct) {
//             // Single Product Mode
//             const single = location.state.singleProduct;
//             setItems([single]);
//             setTotal(single.productId.price * single.quantity);
//             setIsSingleOrder(true);
//         } else {
//             // Cart Mode
//             setItems(contextItems);
//             setTotal(contextTotal);
//             setIsSingleOrder(false);
//         }
//     }, [location.state, contextItems, contextTotal]);

//     const handlePlaceOrder = async () => {
//         // Validation check for address string
//         if (!selectedAddress || selectedAddress.trim() === "") {
//             return toast.error("Please select a delivery address");
//         }

//         setLoading(true);
//         try {
//             const endpoint = isSingleOrder ? '/orders/create-order' : '/orders/place/cart';

//             // Constructing payload with address as a STRING
//             const payload = isSingleOrder
//                 ? {
//                     items: [{ product: items[0].productId._id, quantity: items[0].quantity }],
//                     address: selectedAddress,
//                     price: total,
//                     paymentMethod: paymentMethod.toLowerCase()
//                 }
//                 : {
//                     address: selectedAddress,
//                     paymentMethod: paymentMethod.toLowerCase(),
               
//                 };

//             const { data } = await Api.post(endpoint, payload);

//             console.log("Using Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
//             console.log("Order ID from Backend:", data.order.razorpayOrderId);


//             // CASE 1: Cash on Delivery
//             if (paymentMethod === "COD") {
//                 toast.success("Order placed successfully! 🎉");
//                 if (!isSingleOrder) clearCart();
//                 navigate('/orders');
//             }

//             // CASE 2: Online Payment
//             else {
//                 const options = {
//                     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//                     amount: data.order.price * 100, // Amount in paisa
//                     currency: "INR",
//                     name: "Cybapp Store",
//                     description: "Order Payment",
//                     order_id: data.order.razorpayOrderId,
//                     handler: async function (response) {
//                         try {
//                             await Api.post('/orders/verifypayment', {
//                                 razorpay_order_id: response.razorpay_order_id,
//                                 razorpay_payment_id: response.razorpay_payment_id,
//                                 razorpay_signature: response.razorpay_signature,
//                             });
//                             toast.success("Payment Successful!");
//                             if (!isSingleOrder) clearCart();
//                             navigate('/orders');
//                         } catch (err) {
//                             toast.error("Payment verification failed. Please contact support.");
//                         }
//                     },
//                     prefill: {
//                         email: "cky4849@gmail.com", // Updated based on your user data
//                     },
//                     theme: { color: "#0d6efd" },
//                 };

//                 const rzp = new window.Razorpay(options);
//                 rzp.open();

//                 // Handle modal closure without payment
//                 rzp.on('payment.failed', function (response) {
//                     toast.error("Payment Failed: " + response.error.description);
//                 });
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Could not process order");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (items.length === 0 && !loading) {
//         return (
//             <div className="container mt-5 pt-5 text-center">
//                 <FaShoppingBag size={50} className="text-muted mb-3" />
//                 <h3>Your checkout is empty</h3>
//                 <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
//                     Continue Shopping
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="container py-4">
//             <h3 className="fw-bold mb-4">Checkout {isSingleOrder && "(Direct Purchase)"}</h3>
//             <div className="row g-4">
//                 <div className="col-lg-8">
//                     {/* Pass setter for the address string */}
//                     <AddressSection
//                         selectedAddressId={selectedAddressId}
//                         setSelectedAddressId={setSelectedAddressId}
//                         setSelectedAddress={setSelectedAddress}
//                     />

//                     <div className="card border-0 shadow-sm p-4 mt-4">
//                         <h5 className="fw-bold mb-3"><FaCreditCard className="me-2 text-primary" /> Payment Method</h5>
//                         <div className="form-check border p-3 rounded mb-2">
//                             <input
//                                 type="radio"
//                                 name="payment"
//                                 id="cod"
//                                 className="form-check-input"
//                                 checked={paymentMethod === "COD"}
//                                 onChange={() => setPaymentMethod("COD")}
//                             />
//                             <label htmlFor="cod" className="form-check-label fw-bold">Cash on Delivery (COD)</label>
//                         </div>
//                         <div className="form-check border p-3 rounded">
//                             <input
//                                 type="radio"
//                                 name="payment"
//                                 id="online"
//                                 className="form-check-input"
//                                 checked={paymentMethod === "ONLINE"}
//                                 onChange={() => setPaymentMethod("ONLINE")}
//                             />
//                             <label htmlFor="online" className="form-check-label fw-bold">Online Payment (Razorpay)</label>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-lg-4">
//                     <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
//                         <h5 className="fw-bold mb-4">Order Summary</h5>
//                         <div className="mb-3">
//                             {items.map((item, idx) => (
//                                 <div key={item.productId?._id || idx} className="d-flex justify-content-between mb-2 small">
//                                     <span className="text-muted">{item.productId?.name} (x{item.quantity})</span>
//                                     <span className="fw-bold">₹{(item.productId?.price * item.quantity).toLocaleString()}</span>
//                                 </div>
//                             ))}
//                         </div>
//                         <hr />
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Subtotal</span>
//                             <span>₹{total.toLocaleString()}</span>
//                         </div>
//                         <div className="d-flex justify-content-between mb-2 text-success">
//                             <span>Delivery</span>
//                             <span>FREE</span>
//                         </div>
//                         <div className="d-flex justify-content-between mt-3 mb-4 h5 fw-bold text-dark">
//                             <span>Total Amount</span>
//                             <span>₹{total.toLocaleString()}</span>
//                         </div>
//                         <button
//                             className="btn btn-warning w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
//                             onClick={handlePlaceOrder}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <span className="spinner-border spinner-border-sm"></span>
//                             ) : (
//                                 <><FaTruck /> CONFIRM ORDER</>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Checkout;

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../../Context/CartContext';
import Api from '../../../api/axios';
import { toast } from 'react-toastify';
import AddressSection from './AddressSection';
import { FaCreditCard, FaTruck, FaShoppingBag } from 'react-icons/fa';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems: contextItems = [], cartTotal: contextTotal = 0, clearCart } = useContext(CartContext) || {};

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isSingleOrder, setIsSingleOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.singleProduct) {
            const single = location.state.singleProduct;
            setItems([single]);
            setTotal(single.productId.price * single.quantity);
            setIsSingleOrder(true);
        } else {
            setItems(contextItems);
            setTotal(contextTotal);
            setIsSingleOrder(false);
        }
    }, [location.state, contextItems, contextTotal]);

    // --- LOGIC 1: Single Item Order (Direct) ---
    const handleSingleOrder = async () => {
        const payload = {
            items: [{ product: items[0].productId._id, quantity: items[0].quantity }],
            address: selectedAddress,
            price: total,
            paymentMethod: paymentMethod.toLowerCase()
        };
        const { data } = await Api.post('/orders/create-order', payload);
        return data;
    };

    // --- LOGIC 2: Cart Items Order ---
    const handleCartOrder = async () => {
        const payload = {
            address: selectedAddress,
            paymentMethod: paymentMethod.toLowerCase()
        };
        const { data } = await Api.post('/orders/place/cart', payload);
        return data;
    };

const handlePlaceOrder = async () => {
    if (!selectedAddress || selectedAddress.trim() === "") {
        return toast.error("Please select a delivery address");
    }

    setLoading(true);
    try {
        const endpoint = isSingleOrder ? '/orders/create-order' : '/orders/place/cart';
        
        // Payload based on your backend requirements
        const payload = isSingleOrder
            ? {
                items: [{ product: items[0].productId._id, quantity: items[0].quantity }],
                address: selectedAddress,
                price: total,
                paymentMethod: paymentMethod.toLowerCase()
            }
            : {
                address: selectedAddress,
                paymentMethod: paymentMethod.toLowerCase()
                // Total price is calculated by backend for cart orders
            };

        const { data } = await Api.post(endpoint, payload);

        // CASE 1: Cash on Delivery
        if (paymentMethod === "COD") {
            toast.success("Order placed successfully! 🎉");
            // clearCart removed as it's not in your context
            navigate('/orders');
            return; 
        }

        // CASE 2: Online Payment (Razorpay)
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.razorpayOrder.amount, 
            currency: "INR",
            name: "Cybapp Store",
            description: "Order Payment",
            order_id: data.order.razorpayOrderId,
            handler: async function (response) {
                try {
                    const verifyPayload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const verifyRes = await Api.post('/orders/verifypayment', verifyPayload);
                    
                    if (verifyRes.data.success) {
                        toast.success("Payment Verified & Order Placed!");
                        // Navigation with a slight delay to let the toast show
                        setTimeout(() => navigate('/orders'), 1000);
                    }
                } catch (err) {
                    console.error("Verification Error:", err);
                    const errorMsg = err.response?.data?.message || "Payment verification failed";
                    toast.error(errorMsg);
                    setLoading(false);
                }
            },
            prefill: { email: "cky4849@gmail.com" },
            theme: { color: "#0d6efd" },
            modal: {
                ondismiss: function() {
                    setLoading(false); // Re-enable button if user closes modal
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Order Creation Error:", error);
        toast.error(error.response?.data?.message || "Could not process order");
        setLoading(false);
    }
};

    if (items.length === 0 && !loading) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <FaShoppingBag size={50} className="text-muted mb-3" />
                <h3>Your checkout is empty</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">Checkout {isSingleOrder ? "(Direct)" : "(Cart)"}</h3>
            <div className="row g-4">
                <div className="col-lg-8">
                    <AddressSection
                        selectedAddressId={selectedAddressId}
                        setSelectedAddressId={setSelectedAddressId}
                        setSelectedAddress={setSelectedAddress}
                    />

                    <div className="card border-0 shadow-sm p-4 mt-4">
                        <h5 className="fw-bold mb-3"><FaCreditCard className="me-2 text-primary" /> Payment Method</h5>
                        <div className="form-check border p-3 rounded mb-2">
                            <input type="radio" name="payment" id="cod" className="form-check-input"
                                checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                            <label htmlFor="cod" className="form-check-label fw-bold">Cash on Delivery (COD)</label>
                        </div>
                        <div className="form-check border p-3 rounded">
                            <input type="radio" name="payment" id="online" className="form-check-input"
                                checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
                            <label htmlFor="online" className="form-check-label fw-bold">Online Payment (Razorpay)</label>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-4">Order Summary</h5>
                        <div className="mb-3">
                            {items.map((item, idx) => (
                                <div key={item.productId?._id || idx} className="d-flex justify-content-between mb-2 small">
                                    <span className="text-muted">{item.productId?.name} (x{item.quantity})</span>
                                    <span className="fw-bold">₹{(item.productId?.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-3 mb-4 h5 fw-bold text-dark">
                            <span>Total Amount</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <button className="btn btn-warning w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                            onClick={handlePlaceOrder} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : <><FaTruck /> CONFIRM ORDER</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;