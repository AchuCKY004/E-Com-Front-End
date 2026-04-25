import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../../api/axios";
import { toast } from "react-toastify";

const AdminOrderDetails = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");

    const statusOptions = [
        "orderplaced",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "returned"
    ];

    // ✅ Fetch Order Details
    const fetchOrder = async () => {
        try {
            const res = await Api.get(`/admin/order/${id}`);
            const data = res.data.order || res.data;

            setOrder(data);
            setStatus(data.status);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load order");
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    // ✅ Update Status
    const handleUpdateStatus = async () => {
        try {
            await Api.put(`/admin/order/${id}`, { status });
            toast.success("Status updated successfully");
            fetchOrder();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (!order) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container py-4">

            <h3 className="mb-4">Order Details</h3>

            <div className="card p-3 mb-3">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
                <p><strong>Total:</strong> ₹{order.price}</p>
                <p><strong>Status:</strong> {order.status}</p>
            </div>

            {/* 🛒 Products */}
            <div className="card p-3 mb-3">
                <h5>Products</h5>
                {order.products?.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between border-bottom py-2">
                        <span>{item.product?.name}</span>
                        <span>Qty: {item.quantity}</span>
                    </div>
                ))}
            </div>

            {/* 🔄 Status Update */}
            <div className="card p-3">
                <h5>Update Status</h5>

                <select
                    className="form-control mb-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {statusOptions.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-primary"
                    onClick={handleUpdateStatus}
                >
                    Update Status
                </button>
            </div>

        </div>
    );
};

export default AdminOrderDetails;