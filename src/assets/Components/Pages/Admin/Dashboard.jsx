import React, { useState, useEffect } from "react";
import Api from "../../../api/axios";
import { FiDollarSign, FiShoppingCart, FiUsers, FiBox, FiTrendingUp } from "react-icons/fi";

const DashboardHome = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        users: 0,
        products: 0
    });

    const fetchDashboardData = async () => {
        try {
            // We can fetch all data at once using Promise.all
            const [orderRes, userRes, prodRes] = await Promise.all([
                Api.get("/admin/order"),
                Api.get("/admin/users"),
                Api.get("/admin/products")
            ]);

            const orders = orderRes.data || [];
            const users = userRes.data.filtereduser || [];
            const products = prodRes.data.products || [];

            // Calculate total revenue from orders
            const totalRevenue = orders.reduce((acc, curr) => acc + curr.price, 0);

            setStats({
                revenue: totalRevenue,
                orders: orders.length,
                users: users.length,
                products: products.length
            });
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    return (
        <div className="container-fluid py-4">
            <h4 className="fw-bold mb-4">Dashboard Overview</h4>
            
            <div className="row g-4">
                {/* Revenue Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50 small mb-1">Total Revenue</h6>
                                    <h3 className="mb-0 fw-bold">₹{stats.revenue.toLocaleString()}</h3>
                                </div>
                                <FiDollarSign size={30} className="text-white-50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted small mb-1">Total Orders</h6>
                                    <h3 className="mb-0 fw-bold">{stats.orders}</h3>
                                </div>
                                <FiShoppingCart size={30} className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted small mb-1">Total Users</h6>
                                    <h3 className="mb-0 fw-bold">{stats.users}</h3>
                                </div>
                                <FiUsers size={30} className="text-success" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted small mb-1">Active Products</h6>
                                    <h3 className="mb-0 fw-bold">{stats.products}</h3>
                                </div>
                                <FiBox size={30} className="text-warning" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder for Chart Section */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm p-4" style={{minHeight: '300px'}}>
                        <h6 className="fw-bold mb-3"><FiTrendingUp className="me-2"/> Sales Analytics</h6>
                        <p className="text-muted small text-center mt-5">Charts will be integrated here using Chart.js or Recharts.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4" style={{minHeight: '300px'}}>
                        <h6 className="fw-bold mb-3">Recent Status</h6>
                        <ul className="list-unstyled">
                            <li className="mb-3 d-flex justify-content-between border-bottom pb-2">
                                <span className="small">New Order Placed</span>
                                <span className="badge bg-soft-primary text-primary small">Just Now</span>
                            </li>
                            {/* Map your last 3 orders here */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;