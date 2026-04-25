import React, { useEffect, useState } from 'react';
import Api from '../../../api/axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../api/axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // Holds search results
    const [searchQuery, setSearchQuery] = useState(""); // Holds input text
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await Api.get('/orders/myorders');
                const data = response.data || [];
                setOrders(data);
                setFilteredOrders(data); // Show all orders initially
            } catch (error) {
                console.error("Error fetching orders", error);
                setOrders([]);
                setFilteredOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Logic for the Search Bar
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter((order) => {
                // Search by Product Names inside the order
                const matchesProduct = order.items?.some(item =>
                    item.product?.name?.toLowerCase().includes(query)
                );
                // Also allow searching by Order ID
                const matchesId = order._id.toLowerCase().includes(query);

                return matchesProduct || matchesId;
            });
            setFilteredOrders(filtered);
        }
    };

    // Logic for the Empty State Button
    const handleEmptyStateAction = () => {
        if (searchQuery) {
            // "Refresh" the view by clearing search
            setSearchQuery("");
            setFilteredOrders(orders);
        } else {
            // Navigate away
            navigate('/dashboard');
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300";
        const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;

        if (typeof path === 'string') {
            return path.replace("http://localhost:5000", BASE_URL);
        }
        return "https://via.placeholder.com/300";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="input-group shadow-sm bg-white rounded">
                        <span className="input-group-text bg-white border-0">
                            <FaSearch className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control shadow-none border-0 py-2"
                            placeholder="Search by product name or order ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center bg-white p-5 shadow-sm rounded border">
                    <div className="mb-3">
                        <FaSearch size={50} className="text-light-emphasis" />
                    </div>
                    <h4>{searchQuery ? "No matching orders found" : "No orders found"}</h4>
                    <p className="text-muted">
                        {searchQuery
                            ? "Try checking for typos or search for a different product."
                            : "It looks like you haven't placed any orders yet."}
                    </p>
                    <button
                        className={`btn mt-2 px-4 ${searchQuery ? "btn-outline-primary" : "btn-primary"}`}
                        onClick={handleEmptyStateAction}
                    >
                        {searchQuery ? "Clear Search" : "Start Shopping"}
                    </button>
                </div>
            ) : (
                filteredOrders.map((order) => (
                    <div key={order._id} className="order-card bg-white shadow-sm mb-3 p-3 rounded border transition-hover">
                        <div className="row align-items-center">

                            {/* Products Section */}
                            <div className="col-md-4">
                                {order.items?.map((item) => (
                                    <div key={item._id} className="d-flex gap-3 mb-2 align-items-center">
                                        <img
                                            src={getImageUrl(item.product?.image?.[0]?.url)}
                                            alt={item.product?.name}
                                            className="rounded"
                                            style={{ width: '70px', height: '70px', objectFit: 'contain', border: '1px solid #eee' }}
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/70"; }}
                                        />
                                        <div>
                                            <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                                                {item.product?.name}
                                            </div>
                                            <div className="text-muted small">Quantity: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Section */}
                            <div className="col-md-2 fw-bold text-center">
                                ₹{order.price?.toLocaleString()}
                            </div>

                            {/* Status Section */}
                            <div className="col-md-3 text-center text-md-start">
                                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                    <div
                                        className="rounded-circle"
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: order.status === 'Delivered' ? '#388e3c' : '#2874f0'
                                        }}
                                    ></div>
                                    <span className="fw-bold">{order.status || 'Processing'}</span>
                                </div>
                                <div className="small text-muted mt-1 ps-3">
                                    {order.status === 'Delivered'
                                        ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`
                                        : 'Arriving soon'}
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="col-md-3 text-end">
                                <button
                                    className="btn text-primary fw-bold"
                                    onClick={() => navigate(`/order-details/${order._id}`)}
                                >
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