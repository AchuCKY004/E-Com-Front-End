import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Api from "../../../api/axios";
import { FiCamera, FiSave, FiLock, FiUser, FiMail } from "react-icons/fi";

const AdminProfile = () => {
    const [admin, setAdmin] = useState({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        profileImage: ""
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // 1. Fetch current admin details (often from /api/admin/profile or /api/auth/me)
    const fetchProfile = async () => {
        try {
            const res = await Api.get("/admin/profile"); 
            setAdmin(res.data.adminDetails);
            setPreview(res.data.adminDetails.profileImage);
        } catch (error) {
            toast.error("Could not load profile");
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // 2. Handle Image Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Create local temporary URL
        }
    };

    // 3. Save Changes (Multipart for Image)
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstname", admin.firstname);
        formData.append("lastname", admin.lastname);
        if (selectedFile) formData.append("image", selectedFile);

        try {
            setLoading(true);
            await Api.put("/admin/update-profile", formData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-5">
                            <h4 className="fw-bold mb-4">Edit Profile</h4>
                            
                            <form onSubmit={handleUpdate}>
                                {/* Avatar Upload Section */}
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img 
                                            src={preview || "https://ui-avatars.com/api/?name=Admin"} 
                                            alt="Profile" 
                                            className="rounded-circle border"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        />
                                        <label htmlFor="file-upload" className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle shadow">
                                            <FiCamera />
                                        </label>
                                        <input id="file-upload" type="file" hidden onChange={handleImageChange} />
                                    </div>
                                    <p className="text-muted small mt-2">Click icon to change photo</p>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">First Name</label>
                                        <input type="text" className="form-control" value={admin.firstname} onChange={(e) => setAdmin({...admin, firstname: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Last Name</label>
                                        <input type="text" className="form-control" value={admin.lastname} onChange={(e) => setAdmin({...admin, lastname: e.target.value})} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Email Address</label>
                                        <input type="email" className="form-control bg-light" value={admin.email} disabled />
                                        <small className="text-muted">Email cannot be changed for security reasons.</small>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary mt-4 px-4" disabled={loading}>
                                    <FiSave className="me-2" /> {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;