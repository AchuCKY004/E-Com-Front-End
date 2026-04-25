// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import Api from "../../../api/axios";
// import { FiEdit2, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";

// const CategoryManagement = () => {
//     const location = useLocation();
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [btnLoading, setBtnLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     // Form State
//     const [categoryName, setCategoryName] = useState("");
//     const [editId, setEditId] = useState(null);

//     const fetchCategories = async () => {
//         try {
//             setLoading(true);
//             const res = await Api.get("/admin/category");

//             // Log this! Check your browser console to see exactly what 'res.data' is.
//             console.log("Full API Response:", res.data);

//             // This logic covers all bases:
//             const data = res.data?.cate || [];

//             setCategories(data);
//         } catch (error) {
//             console.error("Fetch Error:", error);
//             toast.error("Failed to load categories");
//             setCategories([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();

//         // Catch edit request from other pages (like AddProduct)
//         if (location.state && location.state.editCat) {
//             const { _id, name } = location.state.editCat;
//             setEditId(_id);
//             setCategoryName(name);
//             // Clear state so it doesn't re-edit on refresh
//             window.history.replaceState({}, document.title);
//         }
//     }, [location]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!categoryName.trim()) return toast.warning("Name is required");

//         try {
//             setBtnLoading(true);
//             if (editId) {
//                 await Api.put(`/admin/category/${editId}`, { name: categoryName });
//                 toast.success("Category updated");
//             } else {
//                 await Api.post("/admin/category", { name: categoryName });
//                 toast.success("Category added");
//             }
//             setCategoryName("");
//             setEditId(null);
//             fetchCategories();
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Operation failed");
//         } finally {
//             setBtnLoading(false);
//         }
//     };

//     const handleEdit = (cat) => {
//         setEditId(cat._id);
//         setCategoryName(cat.name);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await Api.delete(`/admin/category/${id}`);
//             toast.success("Category deleted");
//             fetchCategories();
//         } catch (error) {
//             toast.error("Delete failed");
//         }
//     };

//     // Filter categories based on search
//     const filteredCategories = categories.filter((cat) =>
//         cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="container-fluid py-4">
//             <div className="row g-4">
//                 {/* LEFT SIDE: Category List */}
//                 <div className="col-md-8">
//                     <div className="card shadow-sm border-0">
//                         <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
//                             <h5 className="mb-0 fw-bold d-flex align-items-center">
//                                 <FiLayers className="me-2 text-info" /> All Categories
//                             </h5>
//                             <div className="input-group input-group-sm w-50">
//                                 <span className="input-group-text bg-light border-end-0">
//                                     <FiSearch className="text-muted" />
//                                 </span>
//                                 <input
//                                     type="text"
//                                     className="form-control bg-light border-start-0"
//                                     placeholder="Search categories..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <div className="card-body p-0">
//                             <div className="table-responsive">
//                                 <table className="table table-hover align-middle mb-0">
//                                     <thead className="table-light">
//                                         <tr>
//                                             <th className="ps-4">#</th>
//                                             <th>Category Name</th>
//                                             <th>ID</th>
//                                             <th className="text-end pe-4">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
//                                         ) : filteredCategories.length === 0 ? (
//                                             <tr><td colSpan="4" className="text-center py-5 text-muted">No categories found.</td></tr>
//                                         ) : (
//                                             filteredCategories.map((cat, index) => (
//                                                 <tr key={cat._id}>
//                                                     <td className="ps-4 text-muted">{index + 1}</td>
//                                                     <td className="fw-semibold text-dark">{cat.name}</td>
//                                                     <td className="text-muted small" style={{ fontSize: '0.75rem' }}>{cat._id}</td>
//                                                     <td className="text-end pe-4">
//                                                         <button
//                                                             className="btn btn-sm btn-outline-primary me-2 border-0"
//                                                             onClick={() => handleEdit(cat)}
//                                                             title="Edit"
//                                                         >
//                                                             <FiEdit2 />
//                                                         </button>
//                                                         <button
//                                                             className="btn btn-sm btn-outline-danger border-0"
//                                                             onClick={() => handleDelete(cat._id)}
//                                                             title="Delete"
//                                                         >
//                                                             <FiTrash2 />
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT SIDE: Add/Edit Form */}
//                 <div className="col-md-4">
//                     <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
//                         <div className={`card-header text-white py-3 ${editId ? 'bg-warning' : 'bg-primary'}`}>
//                             <h5 className="mb-0 fw-bold">
//                                 {editId ? "Edit Category" : "Add New Category"}
//                             </h5>
//                         </div>
//                         <div className="card-body">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-3">
//                                     <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
//                                         Category Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control form-control-lg"
//                                         placeholder="e.g. Laptops"
//                                         value={categoryName}
//                                         onChange={(e) => setCategoryName(e.target.value)}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="d-grid gap-2">
//                                     <button
//                                         type="submit"
//                                         className={`btn btn-lg fw-bold ${editId ? 'btn-warning text-dark' : 'btn-primary'}`}
//                                         disabled={btnLoading}
//                                     >
//                                         {btnLoading ? "Processing..." : editId ? "UPDATE" : "SAVE CATEGORY"}
//                                     </button>

//                                     {editId && (
//                                         <button
//                                             type="button"
//                                             className="btn btn-link btn-sm text-decoration-none text-muted"
//                                             onClick={() => { setEditId(null); setCategoryName(""); }}
//                                         >
//                                             Cancel Edit
//                                         </button>
//                                     )}
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CategoryManagement;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../../api/axios";
import { FiEdit2, FiTrash2, FiSearch, FiLayers, FiLock } from "react-icons/fi";

const CategoryManagement = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [categoryName, setCategoryName] = useState("");
    const [editId, setEditId] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await Api.get("/admin/category");
            const data = res.data?.cate || [];
            setCategories(data);
        } catch (error) {
            toast.error("Failed to load categories");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        if (location.state && location.state.editCat) {
            const { _id, name } = location.state.editCat;
            setEditId(_id);
            setCategoryName(name);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return toast.warning("Name is required");

        try {
            setBtnLoading(true);
            if (editId) {
                await Api.put(`/admin/category/${editId}`, { name: categoryName });
                toast.success("Category updated");
            } else {
                await Api.post("/admin/category", { name: categoryName });
                toast.success("Category added");
            }
            setCategoryName("");
            setEditId(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setCategoryName(cat.name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (cat) => {
        if (!window.confirm(`Are you sure you want to delete "${cat.name}"?`)) return;

        try {
            const res = await Api.delete(`/admin/category/${cat._id}`);

            // CHECK THE MESSAGE: 
            // If the message contains "Cannot delete" or "associated", it failed.
            if (res.data.message.includes("Cannot delete") || res.data.message.includes("associated")) {
                return toast.error(res.data.message);
            }

            // If we get here, it actually deleted
            toast.success("Category deleted");
            fetchCategories();

        } catch (error) {
            // This only runs if the server crashes or returns a 4xx/5xx error
            const errorMessage = error.response?.data?.message || "Delete failed";
            toast.error(errorMessage);
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <div className="row g-4">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                <FiLayers className="me-2 text-info" /> All Categories
                            </h5>
                            <div className="input-group input-group-sm w-50">
                                <span className="input-group-text bg-light border-0">
                                    <FiSearch className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0 shadow-none "
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">#</th>
                                            <th>Category Name</th>
                                            <th>ID</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
                                        ) : filteredCategories.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5 text-muted">No categories found.</td></tr>
                                        ) : (
                                            filteredCategories.map((cat, index) => {
                                                // Assuming backend might send a count, otherwise we just handle via error catch
                                                const hasData = cat.productCount > 0;

                                                return (
                                                    <tr key={cat._id}>
                                                        <td className="ps-4 text-muted">{index + 1}</td>
                                                        <td className="fw-semibold text-dark">{cat.name}</td>
                                                        <td className="text-muted small" style={{ fontSize: '0.75rem' }}>{cat._id}</td>
                                                        <td className="text-end pe-4">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2 border-0"
                                                                onClick={() => handleEdit(cat)}
                                                                title="Edit"
                                                            >
                                                                <FiEdit2 />
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger border-0"
                                                                onClick={() => handleDelete(cat)}
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
                        <div className={`card-header text-white py-3 ${editId ? 'bg-warning' : 'bg-primary'}`}>
                            <h5 className="mb-0 fw-bold">
                                {editId ? "Edit Category" : "Add New Category"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="e.g. Laptops"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className={`btn btn-lg fw-bold ${editId ? 'btn-warning text-dark' : 'btn-primary'}`}
                                        disabled={btnLoading}
                                    >
                                        {btnLoading ? "Processing..." : editId ? "UPDATE" : "SAVE CATEGORY"}
                                    </button>

                                    {editId && (
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm text-decoration-none text-muted"
                                            onClick={() => { setEditId(null); setCategoryName(""); }}
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;