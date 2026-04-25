import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Api from "../../../api/axios";
import { FiUser, FiMail, FiShield, FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await Api.get("/admin/users");
            // Mapping the 'userDetails' key from your response
            setUsers(res.data?.filtereduser || []);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleBlock = async (user) => {
        // FIX: Check the 'role' property specifically
        const isCurrentlyBlocked = user.role === "blocked";

        // If they are blocked, we want to unblock them. Otherwise, block them.
        const action = isCurrentlyBlocked ? "unblock" : "block";

        if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`)) return;

        try {
            setLoading(true);

            const url = isCurrentlyBlocked
                ? `/admin/users/unblock/${user._id}`
                : `/admin/users/block/${user._id}`;

            const res = await Api.put(url);

            // Accept any 200-level success status
            if (res.status >= 200 && res.status < 300) {
                toast.success(res.data.message);
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container-fluid py-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <FiUser className="me-2 text-primary" /> User Management
                    </h5>
                    <div className="input-group w-25">
                        <span className="input-group-text bg-light border-end-0"><FiSearch /></span>
                        <input
                            type="text"
                            className="form-control bg-light border-start-0"
                            placeholder="Search email or username..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">User Info</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Verification</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5">Loading Users...</td></tr>
                                ) : filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-sm me-3 bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#e7f1ff' }}>
                                                    {user.firstname[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{user.firstname} {user.lastname}</div>
                                                    <small className="text-muted">@{user.username}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><FiMail className="me-1 text-muted" /> {user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' :
                                                    user.role === 'blocked' ? 'bg-secondary' : 'bg-info'
                                                }`}>
                                                <FiShield className="me-1" /> {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {user.isVerified ? (
                                                <span className="text-success small fw-bold"><FiCheckCircle /> Verified</span>
                                            ) : (
                                                <span className="text-warning small fw-bold"><FiXCircle /> Pending</span>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className={`btn btn-sm ${user.role === 'blocked' ? 'btn-success' : 'btn-outline-danger'}`}
                                                onClick={() => handleToggleBlock(user)}
                                                disabled={loading}
                                            >
                                                {user.role === 'blocked' ? "Unblock" : "Block"}
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;