

// import React, { useState, useEffect } from 'react';
// import Api from '../../../api/axios';
// import { toast } from 'react-toastify';
// import {
//     FaMapMarkerAlt, FaPlus, FaCheckCircle,
//     FaHome, FaInfoCircle, FaEdit, FaTrash
// } from 'react-icons/fa';

// const AddressSection = ({ selectedAddressId, setSelectedAddressId }) => {
//     const [addresses, setAddresses] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingId, setEditingId] = useState(null);

//     const [formData, setFormData] = useState({
//         address: '',
//         pincode: '',
//         landmark: '',
//         isPrimary: false
//     });

//     const fetchAddresses = async () => {
//         try {
//             const res = await Api.get('/address');
//             const list = res.data.address?.addressess || [];
//             setAddresses(list);

//             // Auto-select logic: Primary first, otherwise the first in list
//             if (list.length > 0 && typeof setSelectedAddressId === 'function' && !selectedAddressId) {
//                 const primary = list.find(a => a.isPrimary) || list[0];
//                 setSelectedAddressId(primary._id);
//             }
//         } catch (err) {
//             console.error("Fetch Error:", err);
//             if (err.response?.status === 404) toast.error("Address API not found");
//         }
//     };

//     useEffect(() => {
//         fetchAddresses();
//     }, []);

//     const handleEditClick = (address) => {
//         setEditingId(address._id);
//         setFormData({
//             address: address.address,
//             pincode: address.pincode,
//             landmark: address.landmark,
//             isPrimary: address.isPrimary || false
//         });
//         setShowForm(true);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             if (editingId) {
//                 // UPDATE existing address
//                 await Api.put(`/address/${editingId}`, formData);
//                 toast.success("Address updated successfully!");
//             } else {
//                 // CREATE new address
//                 await Api.post('/address', formData);
//                 toast.success("Address added!");
//             }

//             resetForm();
//             fetchAddresses();
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Operation failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setShowForm(false);
//         setEditingId(null);
//         setFormData({ address: '', pincode: '', landmark: '', isPrimary: false });
//     };

//     const handleDelete = async (e, addressId) => {
//         e.stopPropagation(); // Prevent the card selection onClick from firing
//         if (window.confirm("Are you sure you want to delete this address?")) {
//             try {
//                 // Passing data object for Axios DELETE
//                 await Api.delete("/address", {
//                     data: { addressId: addressId }
//                 });

//                 toast.success("Address deleted");

//                 if (selectedAddressId === addressId) {
//                     setSelectedAddressId(null);
//                 }
//                 fetchAddresses();
//             } catch (error) {
//                 toast.error(error.response?.data?.message || "Delete failed");
//             }
//         }
//     };

//     return (
//         <div className="card border-0 shadow-sm p-4 bg-white mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0 text-dark">
//                     <FaMapMarkerAlt className="text-danger me-2" /> Delivery Address
//                 </h5>
//                 {!showForm && (
//                     <button className="btn btn-primary btn-sm px-3 fw-bold shadow-sm" onClick={() => setShowForm(true)}>
//                         <FaPlus className="me-1" /> ADD NEW
//                     </button>
//                 )}
//             </div>

//             {showForm && (
//                 <div className="bg-light p-4 rounded mb-4 border border-primary-subtle shadow-sm">
//                     <h6 className="fw-bold mb-3 text-primary">
//                         {editingId ? "Edit Delivery Location" : "Add New Delivery Location"}
//                     </h6>
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label className="small fw-bold text-muted">Full Address</label>
//                             <input type="text" className="form-control" placeholder="House No, Building, Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
//                         </div>
//                         <div className="row g-3 mb-3">
//                             <div className="col-md-6">
//                                 <label className="small fw-bold text-muted">Pincode</label>
//                                 <input type="number" className="form-control" placeholder="6-digit PIN" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} required />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="small fw-bold text-muted">Landmark</label>
//                                 <input type="text" className="form-control" placeholder="E.g. Near School" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} required />
//                             </div>
//                         </div>

//                         {/* Primary Address Toggle */}
//                         <div className="form-check mb-3">
//                             <input
//                                 className="form-check-input"
//                                 type="checkbox"
//                                 id="isPrimary"
//                                 checked={formData.isPrimary}
//                                 onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
//                             />
//                             <label className="form-check-label small text-muted fw-bold" htmlFor="isPrimary">
//                                 Set as default address
//                             </label>
//                         </div>

//                         <div className="d-flex gap-2">
//                             <button type="submit" className="btn btn-primary px-4" disabled={loading}>
//                                 {loading ? "Saving..." : editingId ? "Update Address" : "Save Address"}
//                             </button>
//                             <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             )}

//             <div className="row g-3">
//                 {addresses.length > 0 ? addresses.map((item) => (
//                     <div className="col-md-6" key={item._id}>
//                         <div
//                             className={`card h-100 p-3 cursor-pointer border-2 transition-all ${selectedAddressId === item._id ? 'border-primary bg-primary-subtle shadow-sm' : 'border-light-subtle'}`}
//                             onClick={() => setSelectedAddressId?.(item._id)}
//                             style={{ cursor: 'pointer', transition: '0.2s' }}
//                         >
//                             <div className="d-flex justify-content-between">
//                                 <div className="w-100">
//                                     <div className='d-flex justify-content-between align-items-start mb-2'>
//                                         <div className="d-flex align-items-center gap-2">
//                                             <FaHome className={selectedAddressId === item._id ? "text-primary" : "text-muted"} />
//                                             <span className={`badge ${item.isPrimary ? 'bg-success' : 'bg-secondary'} opacity-75`}>
//                                                 {item.isPrimary ? 'Default' : 'Saved'}
//                                             </span>
//                                         </div>
//                                         <div className="d-flex gap-1">
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
//                                                 className="btn btn-sm btn-outline-primary border-0"
//                                             >
//                                                 <FaEdit />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => handleDelete(e, item._id)}
//                                                 className="btn btn-sm btn-outline-danger border-0"
//                                             >
//                                                 <FaTrash />
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <p className="fw-bold mb-1 text-dark text-break">{item.address}</p>
//                                     <p className="small text-muted mb-1 text-break"><FaInfoCircle size={12} className="me-1" />{item.landmark}</p>
//                                     <p className="small fw-bold mb-0 text-break">PIN: {item.pincode}</p>
//                                 </div>
//                                 {selectedAddressId === item._id && <FaCheckCircle className="text-primary h4 ms-2" />}
//                             </div>
//                         </div>
//                     </div>
//                 )) : (
//                     <div className="col-12 text-center py-5 border rounded bg-light border-dashed">
//                         <p className="text-muted mb-0">No saved addresses found.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AddressSection;

import React, { useState, useEffect } from 'react';
import Api from '../../../api/axios';
import { toast } from 'react-toastify';
import {
    FaMapMarkerAlt, FaPlus, FaCheckCircle,
    FaHome, FaInfoCircle, FaEdit, FaTrash
} from 'react-icons/fa';

// ADDED: setSelectedAddress to the destructured props
const AddressSection = ({ selectedAddressId, setSelectedAddressId, setSelectedAddress }) => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        address: '',
        pincode: '',
        landmark: '',
        isPrimary: false
    });

    // Helper function to format the address object into a single string for the backend
    const formatAddressString = (item) => {
        return `${item.address}, ${item.landmark}, PIN: ${item.pincode}`;
    };

    const fetchAddresses = async () => {
        try {
            const res = await Api.get('/address');
            const list = res.data.address?.addressess || [];
            setAddresses(list);

            // Auto-select logic: Primary first, otherwise the first in list
            if (list.length > 0 && !selectedAddressId) {
                const primary = list.find(a => a.isPrimary) || list[0];
                handleSelect(primary); // Use handleSelect to set both ID and String
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 404) toast.error("Address API not found");
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // NEW: Centralized selection handler
    const handleSelect = (item) => {
        if (typeof setSelectedAddressId === 'function') {
            setSelectedAddressId(item._id);
        }
        if (typeof setSelectedAddress === 'function') {
            setSelectedAddress(formatAddressString(item));
        }
    };

    const handleEditClick = (address) => {
        setEditingId(address._id);
        setFormData({
            address: address.address,
            pincode: address.pincode,
            landmark: address.landmark,
            isPrimary: address.isPrimary || false
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await Api.put(`/address/${editingId}`, formData);
                toast.success("Address updated successfully!");
            } else {
                await Api.post('/address', formData);
                toast.success("Address added!");
            }

            resetForm();
            fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ address: '', pincode: '', landmark: '', isPrimary: false });
    };

    const handleDelete = async (e, addressId) => {
        e.stopPropagation(); 
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await Api.delete("/address", {
                    data: { addressId: addressId }
                });

                toast.success("Address deleted");

                if (selectedAddressId === addressId) {
                    setSelectedAddressId(null);
                    setSelectedAddress(""); // Clear string as well
                }
                fetchAddresses();
            } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
            }
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark">
                    <FaMapMarkerAlt className="text-danger me-2" /> Delivery Address
                </h5>
                {!showForm && (
                    <button className="btn btn-primary btn-sm px-3 fw-bold shadow-sm" onClick={() => setShowForm(true)}>
                        <FaPlus className="me-1" /> ADD NEW
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-light p-4 rounded mb-4 border border-primary-subtle shadow-sm">
                    <h6 className="fw-bold mb-3 text-primary">
                        {editingId ? "Edit Delivery Location" : "Add New Delivery Location"}
                    </h6>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="small fw-bold text-muted">Full Address</label>
                            <input type="text" className="form-control" placeholder="House No, Building, Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="small fw-bold text-muted">Pincode</label>
                                <input type="number" className="form-control" placeholder="6-digit PIN" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="small fw-bold text-muted">Landmark</label>
                                <input type="text" className="form-control" placeholder="E.g. Near School" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} required />
                            </div>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isPrimary"
                                checked={formData.isPrimary}
                                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                            />
                            <label className="form-check-label small text-muted fw-bold" htmlFor="isPrimary">
                                Set as default address
                            </label>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="row g-3">
                {addresses.length > 0 ? addresses.map((item) => (
                    <div className="col-md-6" key={item._id}>
                        <div
                            className={`card h-100 p-3 cursor-pointer border-2 transition-all ${selectedAddressId === item._id ? 'border-primary bg-primary-subtle shadow-sm' : 'border-light-subtle'}`}
                            // UPDATED: Use the new handleSelect function
                            onClick={() => handleSelect(item)} 
                            style={{ cursor: 'pointer', transition: '0.2s' }}
                        >
                            <div className="d-flex justify-content-between">
                                <div className="w-100">
                                    <div className='d-flex justify-content-between align-items-start mb-2'>
                                        <div className="d-flex align-items-center gap-2">
                                            <FaHome className={selectedAddressId === item._id ? "text-primary" : "text-muted"} />
                                            <span className={`badge ${item.isPrimary ? 'bg-success' : 'bg-secondary'} opacity-75`}>
                                                {item.isPrimary ? 'Default' : 'Saved'}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                                                className="btn btn-sm btn-outline-primary border-0"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, item._id)}
                                                className="btn btn-sm btn-outline-danger border-0"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="fw-bold mb-1 text-dark text-break">{item.address}</p>
                                    <p className="small text-muted mb-1 text-break"><FaInfoCircle size={12} className="me-1" />{item.landmark}</p>
                                    <p className="small fw-bold mb-0 text-break">PIN: {item.pincode}</p>
                                </div>
                                {selectedAddressId === item._id && <FaCheckCircle className="text-primary h4 ms-2" />}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5 border rounded bg-light border-dashed">
                        <p className="text-muted mb-0">No saved addresses found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressSection;