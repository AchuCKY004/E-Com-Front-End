
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Api, { BASE_URL } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import {
    FiEye,
    FiSearch,
    FiDollarSign,
    FiTrendingUp,
    FiShoppingBag,
    FiRefreshCw
} from "react-icons/fi";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [filterType, setFilterType] = useState("daily");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

const fetchData = async (start = "", end = "") => {
    try {
        setLoading(true);

        const params = {};

        if (start) params.startdate = start;
        if (end) params.enddate = end;


        if (filterType === "daily") params.daily = true;
        if (filterType === "weekly") params.weekly = true;
        if (filterType === "monthly") params.monthly = true;

        const [ordersRes, analyticsRes] = await Promise.all([
            Api.get("/admin/order", { params }),
            Api.get("/admin/order/analytics", { params })
        ]);

        const ordersData = ordersRes.data.orders || ordersRes.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        if (analyticsRes.data?.success) {
            setAnalytics(analyticsRes.data.data);
        } else {
            setAnalytics(null);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch data");
        setOrders([]);
        setAnalytics(null);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        fetchData(dateRange.start, dateRange.end);
    }, [filterType]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/50";
        const url = typeof imagePath === "object" ? imagePath.url : imagePath;
        return url.replace("http://localhost:5000", BASE_URL);
    };


    const handleClearFilter = () => {
        setDateRange({ start: "", end: "" });
        setFilterType("daily");
        fetchData();
        toast.info("Showing all orders");
    };

    // ✅ SEARCH SAFE
    const filteredOrders = orders.filter(order =>
        order._id?.includes(searchTerm) ||
        order.user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            {/* 🔍 FILTER */}
            <div className="card border-0 shadow-sm mb-4 p-3">
                <div className="row g-3 align-items-end">

                    <div className="col-md-3">
                        <label className="small fw-bold text-muted">Start Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateRange.start}
                            onChange={(e) =>
                                setDateRange({ ...dateRange, start: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="small fw-bold text-muted">End Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateRange.end}
                            onChange={(e) =>
                                setDateRange({ ...dateRange, end: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-4 d-flex gap-2">
                        <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => fetchData(dateRange.start, dateRange.end)}
                        >
                            APPLY FILTER
                        </button>

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleClearFilter}
                        >
                            <FiRefreshCw />
                        </button>
                    </div>

                    <div className="col-md-2">
                        <div className="btn-group w-100">
                            {["daily", "weekly", "monthly"].map((type) => (
                                <button
                                    key={type}
                                    className={`btn btn-sm ${filterType === type ? "btn-dark" : "btn-outline-dark"
                                        }`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* 📊 STATS */}
            {analytics && (
                <div className="row g-3 mb-4">

                    <div className="col-md-4">
                        <div className="card bg-primary text-white p-3 shadow-sm">
                            <h6>Total Revenue</h6>
                            <h3>₹{analytics?.totals?.totalRevenue?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-success text-white p-3 shadow-sm">
                            <h6>Total Orders</h6>
                            <h3>{analytics?.totals?.totalOrders || 0}</h3>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-info text-white p-3 shadow-sm">
                            <h6>Top Selling Units</h6>
                            <h3>{analytics?.topProducts?.[0]?.totalSold || 0}</h3>
                        </div>
                    </div>

                </div>
            )}

            {/* 📦 PRODUCT SALES */}
            {analytics?.productwisesales?.length > 0 && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header fw-bold">Product-wise Sales</div>

                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.productwisesales.map(item => (
                                    <tr key={item._id}>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{item.totalSold}</td>
                                        <td>₹{item.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 📋 ORDERS */}
            <div className="card shadow-sm">

                <div className="d-flex justify-content-between p-3">
                    <h5>Orders ({filteredOrders.length})</h5>

                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Search..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-5)}</td>
                                        <td>{order.user?.email || "N/A"}</td>
                                        <td>₹{order.price?.toLocaleString()}</td>

                                        <td>
                                            <span className={`badge ${order.status === "delivered"
                                                ? "bg-success"
                                                : "bg-warning text-dark"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td>
                                            {/* <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <FiEye />
                                            </button> */}
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate(`/admin/order/${order._id}`)}
                                            >
                                                <FiEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No Orders Found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    );
};

// export default OrderManagement;
export default AdminOrders;