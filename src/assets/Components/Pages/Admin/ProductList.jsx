// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");

//   // Fetch products from your backend
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await Api.get("/products/all");
//       setProducts(res.data);
//     } catch (error) {
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await Api.delete(`/products/delete/${id}`);
//         setProducts(products.filter((p) => p._id !== id));
//         toast.success("Product deleted");
//       } catch (error) {
//         toast.error("Delete failed");
//       }
//     }
//   };

//   // Filter Logic
//   const filteredProducts = products.filter((p) => {
//     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = filterCategory === "All" || p.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Get unique categories for the filter dropdown
//   const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

//   return (
//     <div className="container-fluid py-4">
//       {/* HEADER & STATS */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold text-dark">Inventory Management</h2>
//         <Link to="/admin/add-product" className="btn btn-primary px-4 shadow-sm">
//           + Add New Product
//         </Link>
//       </div>

//       {/* FILTERS CARD */}
//       <div className="card shadow-sm border-0 mb-4 p-3">
//         <div className="row g-3">
//           <div className="col-md-6">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by name or SKU..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <select
//               className="form-select"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {uniqueCategories.map((cat) => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>
//           <div className="col-md-3 text-end d-flex align-items-center justify-content-end text-muted">
//             <small>Showing {filteredProducts.length} Products</small>
//           </div>
//         </div>
//       </div>

//       {/* PRODUCT TABLE */}
//       <div className="card shadow-sm border-0 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-light text-muted small text-uppercase fw-bold">
//               <tr>
//                 <th className="ps-4">Product Info</th>
//                 <th>Category</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Status</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan="6" className="text-center py-5">Loading products...</td></tr>
//               ) : filteredProducts.length === 0 ? (
//                 <tr><td colSpan="6" className="text-center py-5">No products found.</td></tr>
//               ) : (
//                 filteredProducts.map((item) => (
//                   <tr key={item._id}>
//                     <td className="ps-4">
//                       <div className="d-flex align-items-center">
//                         <div className="bg-light rounded p-1 me-3 text-center" style={{ width: '45px', height: '45px' }}>
//                           {item.image ? (
//                             <img src={item.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                           ) : (
//                             <span style={{ fontSize: '10px' }}>No Img</span>
//                           )}
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark">{item.name}</div>
//                           <small className="text-muted font-monospace">{item.sku}</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="badge bg-soft-primary text-primary border border-primary-subtle px-2">{item.category}</span></td>
//                     <td className="fw-bold">${item.price}</td>
//                     <td>{item.stock} Units</td>
//                     <td>
//                       {item.stock > 10 ? (
//                         <span className="badge bg-success rounded-pill px-3">In Stock</span>
//                       ) : item.stock > 0 ? (
//                         <span className="badge bg-warning rounded-pill px-3 text-dark">Low Stock</span>
//                       ) : (
//                         <span className="badge bg-danger rounded-pill px-3">Out of Stock</span>
//                       )}
//                     </td>
//                     <td className="text-end pe-4">
//                       <Link to={`/admin/edit-product/${item._id}`} className="btn btn-sm btn-outline-secondary border-0 me-2">
//                         ✏️ Edit
//                       </Link>
//                       <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-outline-danger border-0">
//                         🗑️ Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Api from "../../../api/axios"; // 1. Ensure this path points to your new Axios instance

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       // 2. Change this to your actual GET products endpoint
//       const res = await Api.get("/admin/product"); 

//       // 3. Match your backend response key (usually res.data.products or res.data)
//       const data = res.data.products || res.data;
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         // 4. Update with your actual DELETE endpoint
//         await Api.delete(`/admin/product/${id}`);
//         setProducts(products.filter((p) => p._id !== id));
//         toast.success("Product deleted");
//       } catch (error) {
//         toast.error("Delete failed");
//       }
//     }
//   };

//   const filteredProducts = products.filter((p) => {
//     const matchesSearch = 
//       p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = filterCategory === "All" || p.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

//   return (
//     <div className="container-fluid py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold text-dark">Inventory Management</h2>
//         <Link to="/admin/add-product" className="btn btn-primary px-4 shadow-sm">
//           + Add New Product
//         </Link>
//       </div>

//       <div className="card shadow-sm border-0 mb-4 p-3">
//         <div className="row g-3">
//           <div className="col-md-6">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by name or SKU..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <select
//               className="form-select"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {uniqueCategories.map((cat) => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>
//           <div className="col-md-3 text-end d-flex align-items-center justify-content-end text-muted">
//             <small>Showing {filteredProducts.length} Products</small>
//           </div>
//         </div>
//       </div>

//       <div className="card shadow-sm border-0 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-light text-muted small text-uppercase fw-bold">
//               <tr>
//                 <th className="ps-4">Product Info</th>
//                 <th>Category</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Status</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan="6" className="text-center py-5">Loading products...</td></tr>
//               ) : filteredProducts.length === 0 ? (
//                 <tr><td colSpan="6" className="text-center py-5">No products found.</td></tr>
//               ) : (
//                 filteredProducts.map((item) => (
//                   <tr key={item._id}>
//                     <td className="ps-4">
//                       <div className="d-flex align-items-center">
//                         <div className="bg-light rounded p-1 me-3 text-center" style={{ width: '45px', height: '45px' }}>
//                           {item.image ? (
//                             <img src={item.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                           ) : (
//                             <span style={{ fontSize: '10px', color: '#ccc' }}>No Img</span>
//                           )}
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark">{item.name}</div>
//                           <small className="text-muted font-monospace">{item.sku}</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className="badge bg-info-subtle text-info border border-info-subtle px-2">{item.category}</span></td>
//                     <td className="fw-bold">${item.price}</td>
//                     <td>{item.stock} Units</td>
//                     <td>
//                       {item.stock > 10 ? (
//                         <span className="badge bg-success-subtle text-success rounded-pill px-3">In Stock</span>
//                       ) : item.stock > 0 ? (
//                         <span className="badge bg-warning-subtle text-warning rounded-pill px-3">Low Stock</span>
//                       ) : (
//                         <span className="badge bg-danger-subtle text-danger rounded-pill px-3">Out of Stock</span>
//                       )}
//                     </td>
//                     <td className="text-end pe-4">
//                       <Link to={`/admin/edit-product/${item._id}`} className="btn btn-sm btn-outline-secondary border-0 me-2">
//                         ✏️
//                       </Link>
//                       <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-outline-danger border-0">
//                         🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api, { BASE_URL } from "../../../api/axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");



  const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/50";

  // if array → take first image
  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;

  // ✅ if object with url
  if (typeof path === "object" && path.url) {
    return path.url.replace("http://localhost:5000", BASE_URL);
  }

  // // ✅ if string
  // if (typeof path === "string") {
  //   return path.replace("http://localhost:5000", BASE_URL);
  // }

  return "https://via.placeholder.com/50";
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/products");
      const data = res.data.products || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await Api.delete(`/admin/product/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = p.name || "";
    const sku = p.sku || "";
    const brand = p.brand || "";
    const categoryName = p.category?.name || "Uncategorized";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "All" || categoryName === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Safe mapping for categories
  const uniqueCategories = ["All", ...new Set(products.map((p) =>
    p.category?.name || "Uncategorized"
  ))];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Inventory Management</h2>
        <Link to="/admin/add-product" className="btn btn-primary px-4 shadow-sm">
          + Add New Product
        </Link>
      </div>

      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase fw-bold">
              <tr>
                <th className="ps-4">Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5">Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5">No products found.</td></tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-1 me-3 text-center" style={{ width: '50px', height: '50px' }}>


                          <img
                            src={getImageUrl(item.image)}
                            alt="product"
                            style={{ width: '42px', height: '45px', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                          />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{item.name}</div>
                          <small className="text-muted font-monospace">{item.sku}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border border-info-subtle">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="fw-bold">₹{item.price.toLocaleString()}</td>
                    <td>{item.quantity || 0} Units</td>
                    <td>
                      {item.quantity > 10 ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-3">In Stock</span>
                      ) : item.quantity > 0 ? (
                        <span className="badge bg-warning-subtle text-warning rounded-pill px-3">Low Stock</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3">Out of Stock</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <Link to={`/admin/edit-product/${item._id}`} className="btn btn-sm btn-outline-secondary border-0 me-2">
                        ✏️
                      </Link>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-outline-danger border-0">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;