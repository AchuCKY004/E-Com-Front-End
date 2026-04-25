import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api, { BASE_URL } from "../../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]); // URLs from the Database
  const [newImageFiles, setNewImageFiles] = useState([]);   // New local files

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    category: "",
    brand: "",
    quantity: "",
    sku: "",
    description: "",
    processor: "",
    ram: "",
    storage: "",
    battery: "",
    warranty: "",
    isFeatured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          Api.get("/admin/category"),
          Api.get(`/product/${id}`)
        ]);

        const categoryData = catRes.data?.categories || catRes.data || [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const p = prodRes.data?.product || prodRes.data;
        if (!p) throw new Error("Product data is missing");

        setFormData({
          name: p.name || "",
          price: p.price || "",
          mrp: p.mrp || "",
          category: p.category?._id || p.category || "",
          brand: p.brand || "",
          quantity: p.quantity || "",
          sku: p.sku || "",
          description: p.description || "",
          processor: p.processor || "",
          ram: p.ram || "",
          storage: p.storage || "",
          battery: p.battery || "",
          warranty: p.warranty || "",
          isFeatured: p.isFeatured || false,
        });

        // Load existing images from DB
        if (p.image && Array.isArray(p.image)) {
          setExistingImages(p.image);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setCategories([]);
        toast.error("Could not find this product or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- Handlers moved outside of useEffect ---
  const handleRemoveExisting = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveNew = (indexToRemove) => {
    setNewImageFiles(newImageFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImageFiles.length + files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    setNewImageFiles([...newImageFiles, ...files]);
    e.target.value = null; // Reset input so same file can be picked again if deleted
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    // Send the list of image URLs we want to KEEP
    data.append("existingImages", JSON.stringify(existingImages));

    // Append the NEW files to be uploaded
    newImageFiles.forEach((file) => {
      data.append("image", file);
    });

    try {
      await Api.put(`/admin/product/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      navigate("/admin/product-list");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-5 text-center text-primary">Loading Product Data...</div>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Edit Product</h2>
          <span className="badge bg-light text-muted border">ID: {id}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Image Section */}
            <div className="col-12 bg-light p-3 rounded border mb-4">
              <label className="form-label fw-bold">Product Gallery (Max 5)</label>

              <div className="d-flex flex-wrap gap-3 mb-3">
                {/* EXISTING IMAGES */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="position-relative border rounded p-1 bg-white">
                    <img
                      src={img.url.replace("http://localhost:5000", BASE_URL)}
                      alt="existing"
                      style={{ width: "80px", height: "80px", objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                      style={{ transform: "translate(50%, -50%)", padding: "2px 6px" }}
                      onClick={() => handleRemoveExisting(index)}
                    >✕</button>
                    <div className="text-center small text-muted" style={{ fontSize: '10px' }}>Saved</div>
                  </div>
                ))}

                {/* NEWLY SELECTED IMAGES */}
                {newImageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="position-relative border border-primary rounded p-1 bg-white">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="new preview"
                      style={{ width: "80px", height: "80px", objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                      style={{ transform: "translate(50%, -50%)", padding: "2px 6px" }}
                      onClick={() => handleRemoveNew(index)}
                    >✕</button>
                    <div className="text-center small text-primary" style={{ fontSize: '10px' }}>New</div>
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                className="form-control"
                onChange={handleImageChange}
                disabled={existingImages.length + newImageFiles.length >= 5}
              />
              <small className="text-muted d-block mt-1">Select up to 5 images total.</small>
            </div>

            {/* Basic Details */}
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleTextChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Brand</label>
              <input type="text" name="brand" className="form-control" value={formData.brand} onChange={handleTextChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">SKU</label>
              <input type="text" name="sku" className="form-control" value={formData.sku} onChange={handleTextChange} />
            </div>

            {/* Pricing & Category */}
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleTextChange}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Price (₹)</label>
              <input type="number" name="price" className="form-control" value={formData.price} onChange={handleTextChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">MRP (₹)</label>
              <input type="number" name="mrp" className="form-control" value={formData.mrp} onChange={handleTextChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Stock Quantity</label>
              <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleTextChange} />
            </div>

            {/* Tech Specs */}
            <div className="col-md-3">
              <label className="form-label">Processor</label>
              <input type="text" name="processor" className="form-control" value={formData.processor} onChange={handleTextChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">RAM</label>
              <input type="text" name="ram" className="form-control" value={formData.ram} onChange={handleTextChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Storage</label>
              <input type="text" name="storage" className="form-control" value={formData.storage} onChange={handleTextChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Battery</label>
              <input type="text" name="battery" className="form-control" value={formData.battery} onChange={handleTextChange} />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleTextChange}></textarea>
            </div>

            <div className="col-12">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleTextChange} id="featuredSwitch" />
                <label className="form-check-label" htmlFor="featuredSwitch">Mark as Featured Product</label>
              </div>
            </div>

            <div className="col-12 mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary px-5 shadow-sm">Save Changes</button>
              <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate("/admin/product-list")}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;