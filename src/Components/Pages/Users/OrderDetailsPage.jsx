import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api, { BASE_URL } from '../../../api/axios';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await Api.get(`/orders/${id}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300";
        // Handle both string paths and objects with url property
        const path = typeof imagePath === 'object' ? imagePath.url : imagePath;
        return path.replace("http://localhost:5000", BASE_URL);
    };

    if (loading) return <div className="text-center py-5">Loading Details...</div>;
    if (!order) return <div className="text-center py-5">Order not found.</div>;

    return (
        <div className="container py-4" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
            {/* Back Button */}
            <button className="btn btn-link text-decoration-none mb-3 p-0 text-dark fw-bold" onClick={() => navigate(-1)}>
                <FaArrowLeft className="me-2" /> Back to Orders
            </button>

            <div className="row">
                {/* Left Side: Order Items */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header bg-white py-3 border-bottom-0">
                            <h5 className="mb-0 fw-bold">Order Items ({order.items?.length})</h5>
                        </div>
                        <div className="card-body p-0">
                            {order.items?.map((item, index) => (
                                <div key={item._id} className={`p-3 d-flex gap-4 align-items-center ${index !== order.items.length - 1 ? 'border-bottom' : ''}`}>
                                    <img 
                                        src={getImageUrl(item.product?.image?.[0])} 
                                        alt={item.product?.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/100"; }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{item.product?.name}</h6>
                                        <p className="text-muted small mb-1">Brand: {item.product?.brand}</p>
                                        <p className="text-muted small mb-2">Quantity: {item.quantity}</p>
                                        <h6 className="text-primary">₹{item.product?.price?.toLocaleString()}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary & Status */}
                <div className="col-md-4">
                    {/* Status Card */}
                    <div className="card shadow-sm border-0 mb-3 p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                            <FaBox className="text-primary" />
                            <span className="text-uppercase fw-bold text-primary small">Order Status</span>
                        </div>
                        <h4 className="text-capitalize mb-0">{order.status}</h4>
                        <hr />
                        <div className="d-flex justify-content-between text-muted small">
                            <span><FaCalendarAlt className="me-1" /> Ordered on:</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Order ID & Address */}
                    <div className="card shadow-sm border-0 mb-3 p-3">
                        <h6 className="fw-bold"><FaMapMarkerAlt className="me-2 text-danger" /> Shipping Address</h6>
                        <p className="text-muted small mb-0 mt-2">
                            {/* Assuming address is populated or handled as a string/object */}
                            {typeof order.address === 'object' ? order.address.fullAddress : "Standard Shipping"}
                        </p>
                        <div className="mt-3 pt-3 border-top">
                            <p className="small text-muted mb-1">Order ID:</p>
                            <code className="text-dark">{order._id}</code>
                        </div>
                    </div>

                    {/* Final Price */}
                    <div className="card shadow-sm border-0 p-3 bg-white">
                        <h6 className="fw-bold mb-3">Total Amount Paid</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Payment Method:</span>
                            <span className="fw-bold small">COD</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                            <h5 className="mb-0">Total:</h5>
                            <h5 className="mb-0 text-success fw-bold">₹{order.price?.toLocaleString()}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;