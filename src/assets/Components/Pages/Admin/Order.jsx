// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Api from "../../../api/axios";
// import { FiPackage, FiTruck, FiEye, FiClock, FiCheck } from "react-icons/fi";

// const OrderManagement = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const res = await Api.get("/admin/order");
//             // Assuming the response is an array or contains an array
//             setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
//         } catch (error) {
//             toast.error("Failed to load orders");
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchOrders(); }, []);

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'orderplaced': return <span className="badge bg-primary text-white">Order Placed</span>;
//             case 'shipped': return <span className="badge bg-info text-white">Shipped</span>;
//             case 'delivered': return <span className="badge bg-success text-white">Delivered</span>;
//             case 'cancelled': return <span className="badge bg-danger text-white">Cancelled</span>;
//             default: return <span className="badge bg-secondary text-white">{status}</span>;
//         }
//     };

//     return (
//         <div className="container-fluid py-4">
//             <div className="card shadow-sm border-0">
//                 <div className="card-header bg-white py-3">
//                     <h5 className="mb-0 fw-bold"><FiPackage className="me-2 text-primary" /> Order Management</h5>
//                 </div>
//                 <div className="card-body p-0">
//                     <div className="table-responsive">
//                         <table className="table table-hover align-middle mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th className="ps-4">Order ID</th>
//                                     <th>Customer Email</th>
//                                     <th>Items</th>
//                                     <th>Total Price</th>
//                                     <th>Status</th>
//                                     <th className="text-end pe-4">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr><td colSpan="6" className="text-center py-5">Loading Orders...</td></tr>
//                                 ) : orders.map((order) => (
//                                     <tr key={order._id}>
//                                         <td className="ps-4 fw-bold small text-muted">
//                                             #{order._id.slice(-6).toUpperCase()}
//                                         </td>
//                                         <td>{order.user?.email || "N/A"}</td>
//                                         <td>
//                                             <div className="d-flex align-items-center">
//                                                 {/* Show first item image if available */}
//                                                 {order.items[0]?.product?.image && (
//                                                     <img 
//                                                         src={order.items[0].product.image} 
//                                                         alt="prod" 
//                                                         className="rounded me-2" 
//                                                         style={{width: '30px', height: '30px', objectFit: 'cover'}}
//                                                     />
//                                                 )}
//                                                 <span>
//                                                     {order.items[0]?.product?.name.substring(0, 20)}... 
//                                                     {order.items.length > 1 && <span className="text-primary"> (+{order.items.length - 1} more)</span>}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="fw-bold text-dark">₹{order.price.toLocaleString()}</td>
//                                         <td>{getStatusBadge(order.status)}</td>
//                                         <td className="text-end pe-4">
//                                             <button 
//                                                 className="btn btn-sm btn-outline-primary me-2"
//                                                 onClick={() => {/* Function to view full details in a Modal */}}
//                                             >
//                                                 <FiEye /> View
//                                             </button>
//                                             <select 
//                                                 className="form-select form-select-sm d-inline-block w-auto"
//                                                 style={{fontSize: '0.8rem'}}
//                                                 value={order.status}
//                                                 onChange={(e) => {/* Function to update status */}}
//                                             >
//                                                 <option value="orderplaced">Placed</option>
//                                                 <option value="shipped">Shipped</option>
//                                                 <option value="delivered">Delivered</option>
//                                                 <option value="cancelled">Cancelled</option>
//                                             </select>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderManagement;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Api, { BASE_URL } from "../../../api/axios";

import {
  FiPackage,
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiMapPin,
  FiCalendar
} from "react-icons/fi";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 1. Fetch Orders from your specific API path
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/admin/order");
      // Mapping the response data
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/50";
    // This replaces "http://localhost:5000" with "http://192.168.1.13:5000"
    return imagePath.replace("http://localhost:5000", BASE_URL);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Filter Orders (by Email or ID)
  const filteredOrders = orders.filter(order =>
    order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.includes(searchTerm)
  );

  // 3. Update Order Status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Adjust this URL based on your backend's update route
      await Api.patch(`/admin/order/status/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh table
      if (selectedOrder) setShowModal(false); // Close modal if open
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          <FiPackage className="me-2 text-primary" /> Order Management
        </h4>
        <div className="input-group w-25">
          <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by email or ID..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5">Loading...</td></tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4 small text-muted">#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.user?.email}</div>
                      <small className="text-muted"><FiMapPin size={12} /> {order.address}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </td>
                    <td className="fw-bold">₹{order.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge rounded-pill ${order.status === 'delivered' ? 'bg-success' :
                          order.status === 'orderplaced' ? 'bg-primary' : 'bg-warning'
                        }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openDetails(order)}
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 bg-light">
                <h5 className="modal-title fw-bold">Order Details</h5>
                {/* <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button> */}
              </div>
              <div className="modal-body p-4">
                <div className="row mb-4">
                  <div className="col-md-7">
                    <h6 className="text-muted small text-uppercase fw-bold">Shipping Information</h6>
                    <p className="mb-1"><strong>Email:</strong> {selectedOrder.user.email}</p>
                    <p className="mb-0"><strong>Address:</strong> {selectedOrder.address}</p>
                  </div>
                  <div className="col-md-5 text-md-end">
                    <h6 className="text-muted small text-uppercase fw-bold">Order Meta</h6>
                    <p className="mb-1"><FiCalendar className="me-1" /> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p className="fs-5 fw-bold text-primary mb-0">Total: ₹{selectedOrder.price.toLocaleString()}</p>
                  </div>
                </div>

                <h6 className="text-muted small text-uppercase fw-bold mb-3">Products</h6>
                <div className="list-group mb-4">
                  {selectedOrder.items.map((item, id) => (
                    <div key={id} className="list-group-item d-flex align-items-center gap-3 py-3 border-start-0 border-end-0">
                      <img
                        src={getImageUrl(item.product.image)}
                        alt="product"
                        style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                      />

                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold">{item.product.name}</h6>
                        <div className="small text-muted mt-1">
                          <span className="me-2">RAM: {item.product.ram}</span>
                          <span className="me-2">Storage: {item.product.storage}</span>
                          <span>CPU: {item.product.processor}</span>
                        </div>
                        <div className="mt-1 fw-bold text-success small">
                          ₹{item.product.price.toLocaleString()} x {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-light p-3 rounded d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Update Order Status:</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => handleStatusUpdate(selectedOrder._id, "shipped")}
                    >
                      <FiTruck className="me-1" /> Ship
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusUpdate(selectedOrder._id, "delivered")}
                    >
                      <FiCheckCircle className="me-1" /> Deliver
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleStatusUpdate(selectedOrder._id, "cancelled")}
                    >
                      <FiXCircle className="me-1" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;