import React, { useEffect, useState } from 'react';
import Api from '../../../api/axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { BASE_URL } from '../../../api/axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await Api.get('/orders/myorders');
                // Use a fallback to empty array to prevent .map() errors
                setOrders(response.data || []);
                console.log("orders", response.data);
            } catch (error) {
                console.error("Error fetching orders", error);

                setOrders([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

      const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300";
        const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    
        //   if (typeof path === "object" && path.url) {
        //     return path.url.replace("http://localhost:5000", BASE_URL);
        //   }
    
        if (typeof path === 'string') {
          return path.replace("http://localhost:5000", BASE_URL);
        }
        return "https://via.placeholder.com/300";
      };
    

    if (loading) {
        return <div className="text-center py-5">Loading your orders...</div>;
    }

    return (
        <div className="container py-4" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
            {/* Search/Filter Bar */}
            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="input-group shadow-sm">
                        <input type="text" className="form-control border-0 py-2" placeholder="Search your orders here" />
                        <button className="btn btn-primary px-4">
                            <FaSearch /> Search Orders
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty State Check */}
            {orders.length === 0 ? (
                <div className="text-center bg-white p-5 shadow-sm rounded">
                    <h4>No orders found</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/product')}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-card bg-white shadow-sm mb-3 p-3 rounded-1 border">
                        <div className="row align-items-center">
                            {/* Product List within Order */}
                            <div className="col-md-4">
                                {order.items?.map((item) => (
                                    <div key={item._id} className="d-flex gap-3 mb-2 align-items-center">
                                        <img 
                                            src={getImageUrl(item.product?.image?.[0]?.url)} 
                                            alt={item.product?.name} 
                                            style={{ width: '60px', height: '60px', objectFit: 'contain' }} 
                                                      onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}

                                        />
                                        <div>
                                            <div className="fw-bold text-truncate" style={{ maxWidth: '180px' }}>
                                                {item.product?.name}
                                            </div>
                                            <div className="text-muted small">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                
                            <div className="col-md-2 fw-bold text-center">
                                ₹{order.price?.toLocaleString()}
                            </div>

                            {/* Status with Dot Indicator */}
                            <div className="col-md-3 text-center text-md-start">
                                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                    {/* <span className={`status-dot ${order.status?.toLowerCase() || 'processing'}`}></span> */}
                                    <span className="fw-bold">{order.status || 'Processing'}</span>
                                </div>
                                <div className="small text-muted mt-1">
                                    {order.status === 'Delivered' ? 'Delivered on ' + new Date(order.updatedAt).toLocaleDateString() : 'Expected soon'}
                                </div>
                            </div>
 

                            <div className="col-md-3 text-end">
                                <button className="btn text-primary fw-bold hover-underline" onClick={() => navigate(`/order-details/${order._id}`)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;