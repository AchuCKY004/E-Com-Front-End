// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const AddProduct = () => {
//   const [loading, setLoading] = useState(false);
//   const [isManualSku, setIsManualSku] = useState(false); // New state to track manual input

//   const [product, setProduct] = useState({
//     name: "",
//     brand: "",
//     sku: "",
//     category: "Smartphones",
//     price: "",
//     mrp: "",
//     stock: "",
//     description: "",
//     processor: "",
//     ram: "",
//     storage: "",
//     battery: "",
//     warranty: "1 Year",
//   });

//   const [image, setImage] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // If the user manually edits the SKU field, stop auto-generation
//     if (name === "sku") {
//       setIsManualSku(true);
//     }

//     setProduct({ ...product, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   // AUTO-GENERATE SKU LOGIC
//   useEffect(() => {
//     // ONLY generate if the user hasn't manually typed something in the SKU field
//     if (!isManualSku && product.name.length > 2 && product.brand.length > 1) {
//       const brandPart = product.brand.substring(0, 3).toUpperCase();
//       const namePart = product.name.substring(0, 3).toUpperCase();
//       const randomPart = Math.floor(100 + Math.random() * 900);

//       const generatedSku = `${brandPart}-${namePart}-${randomPart}`;
//       setProduct(prev => ({ ...prev, sku: generatedSku }));
//     }
//   }, [product.name, product.brand, isManualSku]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     Object.keys(product).forEach((key) => formData.append(key, product[key]));
//     if (image) formData.append("image", image);

//     try {
//       await Api.post("/products/add", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Product added successfully!");

//       // Reset everything including manual override flag
//       setProduct({ name: "", brand: "", sku: "", category: "Smartphones", price: "", mrp: "", stock: "", description: "", processor: "", ram: "", storage: "", battery: "", warranty: "1 Year" });
//       setImage(null);
//       setIsManualSku(false); 
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="card shadow-sm border p-4">
//         <h3 className="mb-4 fw-bold text-dark">Add New Electronic Item</h3>

//         <form onSubmit={handleSubmit}>
//           <div className="row g-3">
//             <div className="col-md-5">
//               <label className="form-label fw-bold small text-uppercase text-muted">Product Name</label>
//               <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} placeholder="e.g. iPhone 15 Pro" required />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label fw-bold small text-uppercase text-muted">Brand</label>
//               <input type="text" name="brand" className="form-control" value={product.brand} onChange={handleChange} placeholder="e.g. Apple" required />
//             </div>

//             <div className="col-md-4">
//               <div className="d-flex justify-content-between">
//                 <label className="form-label small fw-bold text-muted">SKU</label>
//                 {isManualSku && (
//                   <button 
//                     type="button" 
//                     className="btn btn-link p-0 mb-1 text-decoration-none small" 
//                     style={{ fontSize: '0.7rem' }}
//                     onClick={() => setIsManualSku(false)}
//                   >
//                     Reset to Auto-generate
//                   </button>
//                 )}
//               </div>
//               <input 
//                 type="text" 
//                 name="sku" 
//                 className={`form-control fw-bold ${isManualSku ? 'border-primary' : 'bg-light text-primary'}`} 
//                 value={product.sku} 
//                 onChange={handleChange} 
//                 placeholder="Manually enter or auto-generate"
//               />
//             </div>

//             {/* ... rest of your code remains the same ... */}
//             <div className="col-md-4">
//               <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
//               <select name="category" className="form-select" value={product.category} onChange={handleChange}>
//                 <option value="Smartphones">Smartphones</option>
//                 <option value="Laptops">Laptops</option>
//                 <option value="Tablets">Tablets</option>
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label className="form-label fw-bold small text-uppercase text-muted">Price ($)</label>
//               <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
//             </div>

//             <div className="col-md-2">
//               <label className="form-label fw-bold small text-uppercase text-muted">MRP ($)</label>
//               <input type="number" name="mrp" className="form-control" value={product.mrp} onChange={handleChange} />
//             </div>

//             <div className="col-md-2">
//               <label className="form-label fw-bold small text-uppercase text-muted">Stock</label>
//               <input type="number" name="stock" className="form-control" value={product.stock} onChange={handleChange} required />
//             </div>

//             <div className="col-md-2">
//               <label className="form-label fw-bold small text-uppercase text-muted">Warranty</label>
//               <input type="text" name="warranty" className="form-control" value={product.warranty} onChange={handleChange} />
//             </div>

//             <div className="col-12 mt-4">
//               <h6 className="fw-bold border-bottom pb-2">Technical Specifications</h6>
//             </div>

//             <div className="col-md-3">
//               <label className="form-label small">Processor</label>
//               <input type="text" name="processor" className="form-control" value={product.processor} onChange={handleChange} />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label small">RAM</label>
//               <input type="text" name="ram" className="form-control" value={product.ram} onChange={handleChange} />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label small">Storage</label>
//               <input type="text" name="storage" className="form-control" value={product.storage} onChange={handleChange} />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label small">Battery</label>
//               <input type="text" name="battery" className="form-control" value={product.battery} onChange={handleChange} />
//             </div>

//             <div className="col-md-8">
//               <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
//               <textarea name="description" className="form-control" rows="4" value={product.description} onChange={handleChange}></textarea>
//             </div>

//             <div className="col-md-4">
//               <label className="form-label fw-bold small text-uppercase text-muted">Product Image</label>
//               <div className="border border-dashed p-3 text-center bg-light rounded">
//                 <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
//                 {image && <p className="mt-2 text-primary mb-0 small">Selected: {image.name}</p>}
//               </div>
//             </div>

//             <div className="col-12 mt-4 text-end">
//               <button type="button" className="btn btn-outline-secondary me-2" onClick={() => window.history.back()}>Cancel</button>
//               <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={loading}>
//                 {loading ? <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</> : "Add Product"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;


// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const AddProduct = () => {
//   const [loading, setLoading] = useState(false);
//   const [isManualSku, setIsManualSku] = useState(false);
//   const [image, setImage] = useState(null);

//   // CATEGORY STATE
//   const [categories, setCategories] = useState([
//     { id: 1, name: "Smartphones", count: 24 },
//     { id: 2, name: "Laptops", count: 15 },
//     { id: 3, name: "Tablets", count: 8 },
//   ]);
//   const [newCat, setNewCat] = useState("");

//   // PRODUCT STATE
//   const [product, setProduct] = useState({
//     name: "",
//     brand: "",
//     sku: "",
//     category: "Smartphones",
//     price: "",
//     mrp: "",
//     stock: "",
//     description: "",
//     processor: "",
//     ram: "",
//     storage: "",
//     battery: "",
//     warranty: "1 Year",
//   });

//   // SKU AUTO-GENERATION LOGIC
//   useEffect(() => {
//     if (!isManualSku && product.name.length > 2 && product.brand.length > 1) {
//       const brandPart = product.brand.substring(0, 3).toUpperCase();
//       const namePart = product.name.substring(0, 3).toUpperCase();
//       const randomPart = Math.floor(100 + Math.random() * 900);
//       const generatedSku = `${brandPart}-${namePart}-${randomPart}`;
//       setProduct((prev) => ({ ...prev, sku: generatedSku }));
//     }
//   }, [product.name, product.brand, isManualSku]);

//   // HANDLERS
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "sku") setIsManualSku(true);
//     setProduct({ ...product, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleAddCategory = (e) => {
//     e.preventDefault();
//     if (!newCat.trim()) return toast.error("Enter a category name");
//     const newEntry = { id: Date.now(), name: newCat, count: 0 };
//     setCategories([...categories, newEntry]);
//     setNewCat("");
//     toast.success("Category added!");
//   };

//   const handleDeleteCategory = (id) => {
//     if (window.confirm("Delete this category?")) {
//       setCategories(categories.filter((cat) => cat.id !== id));
//       toast.info("Category removed");
//     }
//   };

//   const handleSubmitProduct = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     Object.keys(product).forEach((key) => formData.append(key, product[key]));
//     if (image) formData.append("image", image);

//     try {
//       await Api.post("/products/add", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Product added successfully!");
//       setProduct({
//         name: "", brand: "", sku: "", category: categories[0]?.name || "Smartphones",
//         price: "", mrp: "", stock: "", description: "",
//         processor: "", ram: "", storage: "", battery: "", warranty: "1 Year"
//       });
//       setImage(null);
//       setIsManualSku(false);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid py-4 bg-light">
//       <div className="row g-4">

//         {/* LEFT PART: ADD PRODUCT (70%) */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm border-0 p-4 h-100">
//             <h3 className="mb-4 fw-bold text-dark">Add New Electronic Item</h3>
//             <form onSubmit={handleSubmitProduct}>
//               <div className="row g-3">
//                 <div className="col-md-7">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Product Name</label>
//                   <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} placeholder="e.g. iPhone 15 Pro" required />
//                 </div>

//                 <div className="col-md-5">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Brand</label>
//                   <input type="text" name="brand" className="form-control" value={product.brand} onChange={handleChange} placeholder="e.g. Apple" required />
//                 </div>

//                 <div className="col-md-4">
//                   <div className="d-flex justify-content-between">
//                     <label className="form-label small fw-bold text-muted">SKU</label>
//                     {isManualSku && (
//                       <button type="button" className="btn btn-link p-0 mb-1 text-decoration-none small" style={{ fontSize: '0.7rem' }} onClick={() => setIsManualSku(false)}>
//                         Reset to Auto
//                       </button>
//                     )}
//                   </div>
//                   <input
//                     type="text" name="sku"
//                     className={`form-control fw-bold ${isManualSku ? 'border-primary' : 'bg-light text-primary'}`}
//                     value={product.sku} onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
//                   <select name="category" className="form-select" value={product.category} onChange={handleChange}>
//                     {categories.map(cat => (
//                       <option key={cat.id} value={cat.name}>{cat.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-bold small text-uppercase text-muted">warranty</label>
//                   <input type="text" name="price" className="form-control" value={product.warranty} onChange={handleChange} required />
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Price ($)</label>
//                   <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-bold small text-uppercase text-muted">MRP ($)</label>
//                   <input type="number" name="mrp" className="form-control" value={product.mrp} onChange={handleChange} />
//                 </div>

//                 <div className="col-md-4">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Stock</label>
//                   <input type="number" name="stock" className="form-control" value={product.stock} onChange={handleChange} required />
//                 </div>

//                 <div className="col-12 mt-4">
//                   <h6 className="fw-bold border-bottom pb-2">Technical Specifications</h6>
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label small">Processor</label>
//                   <input type="text" name="processor" className="form-control" value={product.processor} onChange={handleChange} />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label small">RAM</label>
//                   <input type="text" name="ram" className="form-control" value={product.ram} onChange={handleChange} />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label small">Storage</label>
//                   <input type="text" name="storage" className="form-control" value={product.storage} onChange={handleChange} />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label small">Battery</label>
//                   <input type="text" name="battery" className="form-control" value={product.battery} onChange={handleChange} />
//                 </div>

//                 <div className="col-md-12">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
//                   <textarea name="description" className="form-control" rows="3" value={product.description} onChange={handleChange}></textarea>
//                 </div>

//                 <div className="col-md-12">
//                   <label className="form-label fw-bold small text-uppercase text-muted">Product Image</label>
//                   <div className="border border-dashed p-3 text-center bg-light rounded">
//                     <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
//                     {image && <p className="mt-2 text-primary mb-0 small font-monospace">Selected: {image.name}</p>}
//                   </div>
//                 </div>

//                 <div className="col-12 mt-4 text-end">
//                   <button type="submit" className="btn btn-primary btn-lg px-5 shadow-sm" disabled={loading}>
//                     {loading ? "Processing..." : "Add Product"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

// {/* RIGHT PART: CATEGORY MANAGEMENT (30%) */}
// <div className="col-lg-4">
//   <div className="card shadow-sm border-0 p-4 mb-4">
//     <h5 className="fw-bold mb-3 text-dark">Quick Add Category</h5>
//     <form onSubmit={handleAddCategory}>
//       <div className="input-group">
//         <input
//           type="text" className="form-control"
//           placeholder="New Category..."
//           value={newCat} onChange={(e) => setNewCat(e.target.value)}
//         />
//         <button className="btn btn-dark" type="submit">Add</button>
//       </div>
//     </form>
//   </div>

//   <div className="card shadow-sm border-0">
//     <div className="card-body p-0">
//       <div className="p-4">
//         <h5 className="fw-bold mb-0 text-dark">Category List</h5>
//         <small className="text-muted">Total: {categories.length}</small>
//       </div>
//       <div className="table-responsive" style={{ maxHeight: '550px', overflowY: 'auto' }}>
//         <table className="table table-hover align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th className="ps-4">Name</th>
//               <th className="text-end pe-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((cat) => (
//               <tr key={cat.id}>
//                 <td className="ps-4">
//                   <div className="fw-bold">{cat.name}</div>
//                   <small className="text-primary">{cat.count} Products</small>
//                 </td>
//                 <td className="text-end pe-4">
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => handleDeleteCategory(cat.id)}
//                     title="Delete Category"
//                   >
//                     🗑️
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// </div>

// </div>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Api from "../../../api/axios";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [isManualSku, setIsManualSku] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState([]);
  const fileInputRef = useRef(null);

  // Product State
  const [product, setProduct] = useState({
    name: "", brand: "", sku: "", category: "",
    price: "", mrp: "", quantity: "", description: "",
    processor: "", ram: "", storage: "", battery: "", warranty: "1 Year",
  });

  // New Category State
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const fetchCats = async () => {
    try {
      const res = await Api.get("/admin/category");
      const cateList = res.data.cate || [];
      setCategories(cateList);
      if (cateList.length > 0 && !product.category) {
        setProduct((prev) => ({ ...prev, category: cateList[0]._id }));
      }
    } catch (err) {
      toast.error("Could not load categories");
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sku") setIsManualSku(true);
    setProduct({ ...product, [name]: value });
  };

  // Handle Category Add
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return toast.warn("Category name is required");
    setCatLoading(true);
    try {
      await Api.post("/admin/category", newCategory);
      toast.success("Category added!");
      setNewCategory({ name: "", description: "" });
      fetchCats(); // Refresh the list
    } catch (err) {
      toast.error("Failed to add category");
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    // 1. Ask for confirmation first to avoid accidental clicks
    if (!window.confirm("Are you sure you want to delete this category? This might affect products linked to it.")) {
      return;
    }

    try {
      // 2. Call the backend delete endpoint
      // Adjust this path to match your specific backend route (e.g., /admin/category/delete/${id})
      const res = await Api.delete(`/admin/category/${id}`);

      if (res.status === 200 || res.data.success) {
        // 3. Update the UI state by filtering out the deleted category
        // Note: Use _id to match your MongoDB response
        setCategories(categories.filter((cat) => cat._id !== id));

        toast.success(res.data.message || "Category removed successfully");

        // 4. Optional: If the deleted category was selected in the product form, reset it
        if (product.category === id) {
          setProduct(prev => ({ ...prev, category: categories[0]?._id || "" }));
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };
  // SKU Logic
  useEffect(() => {
    if (!isManualSku && product.name.length > 2 && product.brand.length > 1) {
      const brandPart = product.brand.substring(0, 3).toUpperCase();
      const namePart = product.name.substring(0, 3).toUpperCase();
      const randomPart = Math.floor(100 + Math.random() * 900);
      setProduct((prev) => ({ ...prev, sku: `${brandPart}-${namePart}-${randomPart}` }));
    }
  }, [product.name, product.brand, isManualSku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(product).forEach((key) => formData.append(key, product[key]));

    if (image.length > 0) {
      image.forEach((files) => {
        formData.append("image", files); // Use the same key "image" for all
      });
    }

    try {
      await Api.post("/admin/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully!");
      setProduct({
        name: "", brand: "", sku: "", category: categories[0]?._id || "",
        price: "", mrp: "", quantity: "", description: "",
        processor: "", ram: "", storage: "", battery: "", warranty: "1 Year"
      });
      setImage([]);
      setIsManualSku(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">

        {/* LEFT: ADD PRODUCT (70%) */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h3 className="mb-4 fw-bold text-dark">Add New Electronic Item</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted text-uppercase">Product Name</label>
                  <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Brand</label>
                  <input type="text" name="brand" className="form-control" value={product.brand} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label small fw-bold text-muted">SKU</label>
                    {isManualSku && (
                      <button type="button" className="btn btn-link p-0 mb-1 text-decoration-none small" style={{ fontSize: '0.7rem' }} onClick={() => setIsManualSku(false)}>
                        Reset to Auto
                      </button>
                    )}
                  </div>
                  <input
                    type="text" name="sku"
                    className={`form-control fw-bold ${isManualSku ? 'border-primary' : 'bg-light text-primary'}`}
                    value={product.sku} onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                  <select name="category" className="form-select" value={product.category} onChange={handleChange}>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold small text-muted text-uppercase">Price ($)</label>
                  <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold small text-muted text-uppercase">MRP ($)</label>
                  <input type="number" name="mrp" className="form-control" value={product.mrp} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold small text-muted text-uppercase">Qty</label>
                  <input type="number" name="quantity" className="form-control" value={product.quantity} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold small text-muted text-uppercase">Warranty</label>
                  <input type="text" name="warranty" className="form-control" value={product.warranty} onChange={handleChange} />
                </div>

                <div className="col-12 mt-4"><h6 className="fw-bold border-bottom pb-2">Technical Specs</h6></div>
                <div className="col-md-3">
                  <label className="form-label small">Processor</label>
                  <input type="text" name="processor" className="form-control" value={product.processor} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">RAM</label>
                  <input type="text" name="ram" className="form-control" value={product.ram} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Storage</label>
                  <input type="text" name="storage" className="form-control" value={product.storage} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Battery</label>
                  <input type="text" name="battery" className="form-control" value={product.battery} onChange={handleChange} />
                </div>

                <div className="col-md-8">
                  <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                  <textarea name="description" className="form-control" rows="3" value={product.description} onChange={handleChange}></textarea>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Product Image (Max 5)</label>
                  <input type="file" ref={fileInputRef} className="form-control" multiple accept="image/*"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);

                      if (selectedFiles.length > 5) {
                        toast.error("You can only upload up to 5 images");
                        e.target.value = "";
                        return;
                      }

                      setImage(selectedFiles); // ✅ correct
                    }}
                  />
                  {image.length > 0 && (
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {image.map((files, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(files)}
                          alt="preview"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ddd"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-bold" disabled={loading}>
                    {loading ? "Adding..." : "ADD PRODUCT"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: CATEGORY MANAGEMENT (30%) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Quick Add Category</h5>
            <form onSubmit={handleAddCategory}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-bold">CATEGORY NAME</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Tablets"
                />
              </div>
              <button className="btn btn-outline-primary btn-sm w-100 fw-bold" disabled={catLoading}>
                {catLoading ? "Saving..." : "SAVE CATEGORY"}
              </button>
            </form>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold text-dark mb-3">Existing Categories</h5>
            <div className="list-group list-group-flush" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {categories.map((cat) => (
                <div key={cat._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <span className="fw-bold text-secondary">{cat.name}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteCategory(cat._id)}
                    title="Delete Category"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-muted small">No categories found.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;