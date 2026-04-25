import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Api, { BASE_URL } from '../../../api/axios';
import { CartContext } from '../../../Context/CartContext';
import { AuthContext } from '../../../Context/AuthContext';
import { FaShoppingCart, FaBolt, FaShieldAlt, FaTruck, FaChevronRight, FaBox, FaHeart, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await Api.get('/wishlist/items');
        // FIX: Access the nested productId._id
        const exists = res.data.products?.some(p => p.productId?._id === id);
        setIsWishlisted(exists);
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };
    if (id) checkWishlist();
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [prodRes, revRes] = await Promise.all([
          Api.get(`/product/${id}`),
          Api.get(`/review/${id}`)
        ]);

        setProduct(prodRes.data.product);

        const reviewData = revRes.data?.review?.[0]?.reviews || [];
        setReviews(reviewData);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
    window.scrollTo(0, 0);
  }, [id]);


  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        // Ensure this matches your backend delete route
        await Api.delete(`/wishlist/items/${id}`);
        setIsWishlisted(false);
      } else {
        // The 400 error might be here. 
        // Ensure 'id' is defined and valid.
        const response = await Api.post('/wishlist/add', { productId: id });
        if (response.status === 200 || response.status === 201) {
          setIsWishlisted(true);
        }
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setIsWishlisted(true);
      }
      console.error("Wishlist error:", err);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
      if (typeof path === "object" && path.url) {
    return path.url.replace("http://localhost:5000", BASE_URL);
  }
    return String(path).replace("http://localhost:5000", BASE_URL);
  };

  const handleCartAction = async () => {
    setIsAdding(true);
    await addToCart(product._id);

    setIsAdding(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");

    setSubmittingReview(true);
    try {
      await Api.post(`/review/add/${id}`, {
        rating,
        reviewNotes: comment
      });

      toast.success("Review added!");

      // 🔁 REFETCH REVIEWS
      const revRes = await Api.get(`/review/${id}`);
      const reviewData = revRes.data?.review?.[0]?.reviews || [];
      setReviews(reviewData);

      setRating(0);
      setComment("");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    // Navigate to checkout and pass this specific product as state
    navigate('/checkout', { 
        state: { 
            singleProduct: {
                productId: product, // Pass the whole product object
                quantity: 1,
                isSingleOrder: true 
            } 
        } 
    });
};


  if (loading) return <div className="text-center mt-5 p-5">Loading product...</div>;
  if (!product) return <div className="text-center mt-5 p-5">Product not found.</div>;

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4" style={{ marginTop: -70, zIndex: 10 }}>
        {/* Image Gallery Section */}
        <div className="col-md-5">
          {/* Wishlist Button */}
          <div className="position-relative">
            <button
              onClick={toggleWishlist}
              className="btn shadow-sm rounded-circle position-absolute end-0 top-0 m-2 bg-white border"
              style={{ zIndex: 20, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isWishlisted ? (
                <FaHeart className="text-danger" size={20} />
              ) : (
                <FaHeart className="text-muted opacity-50" size={20} />
              )}
            </button>
          </div>
          <div className="card border-0 shadow-sm p-4 text-center sticky-md-top gap-3" style={{ zIndex: 10 }}>
            <img
              src={getImageUrl(Array.isArray(product.image) ? product.image[selectedImage] : product.image)}
              alt={product.name}
              className="img-fluid"
              style={{ height: '400px', objectFit: 'contain' }}
            />

            {Array.isArray(product.image) && product.image.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2 justify-content-center">
                {product.image.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border rounded p-1 shadow-sm transition ${selectedImage === index ? 'border-primary' : 'border-light'}`}
                    style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                  >
                    <img src={getImageUrl(img)} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="col-md-7">

          <h2 className="fw-bold text-dark mb-1">{product.name}</h2>
          <p className="text-primary fw-semibold mb-3">{product.brand}</p>

          <div className="d-flex align-items-baseline gap-3 mb-4">
            <span className="h2 fw-bold text-dark">₹{product.price?.toLocaleString()}</span>
            {product.mrp && (
              <span className="text-muted text-decoration-line-through small">₹{product.mrp?.toLocaleString()}</span>
            )}
            <span className="text-success fw-bold small">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
            </span>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-5">
            <button
              className="btn btn-warning btn-sm flex-grow-1 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              onClick={handleCartAction}
              disabled={isAdding || isOutOfStock}
            >
              <FaShoppingCart /> {isAdding ? "ADDING..." : "ADD TO CART"}
            </button>
   <button
    className="btn btn-danger btn-sm flex-grow-1 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
    disabled={isOutOfStock}
    onClick={handleBuyNow} // Add this
>
    <FaBolt /> BUY NOW
</button>
          </div>

          {/* Highlights Section */}
          <div className="card border-0 bg-light p-4 mb-4">
            <h5 className="fw-bold mb-3">Key Highlights</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><FaChevronRight className="text-primary me-2 small" /> {product.warranty} Manufacturer Warranty</li>
              <li className="mb-2"><FaChevronRight className="text-primary me-2 small" /> {product.processor} Processor</li>
              <li className="mb-2"><FaChevronRight className="text-primary me-2 small" /> {product.ram} RAM</li>
              <li className="mb-2"><FaChevronRight className="text-primary me-2 small" /> {product.storage} storage</li>
              <li><FaChevronRight className="text-primary me-2 small" /> {product.battery} Battery Capacity</li>
            </ul>
          </div>

          {/* Description */}
          <div className="mb-4">

            <h5 className="fw-bold border-bottom pb-2">Description</h5>
            <div>
              <p
                className="text-muted mb-1"
                style={!isExpanded ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 1, // Truncates to 1 line
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                } : { wordBreak: 'break-all' }} // Break-all helps with long strings like in your screenshot
              >
                {product.description}
              </p>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn btn-link p-0 text-primary fw-bold small text-decoration-none"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="row g-2 border-top pt-4 text-center">
            <div className="col-4">
              <FaTruck className="text-muted mb-1" size={20} />
              <p className="x-small mb-0">Free Delivery</p>
            </div>
            <div className="col-4">
              <FaShieldAlt className="text-muted mb-1" size={20} />
              <p className="x-small mb-0">Safe Payments</p>
            </div>
            <div className="col-4">
              <FaBox className="text-muted mb-1" size={20} />
              <p className="x-small mb-0">Easy Returns</p>
            </div>
          </div>


          {/* --- REVIEWS SECTION --- */}
          <div className="mt-5 border-top pt-4">
            <h4 className="fw-bold mb-4">Customer Reviews</h4>
            <div className="row g-4">
              {/* Review Input Form */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-3 bg-light">
                  <h6 className="fw-bold mb-3">Post a Review</h6>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="d-flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} size={22} style={{ cursor: 'pointer' }} color={(hover || rating) >= star ? "#ffc107" : "#e4e5e9"} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)} />
                      ))}
                    </div>
                    <textarea className="form-control mb-3" rows="3" placeholder="Share your thoughts..." value={comment} onChange={(e) => setComment(e.target.value)} required />
                    <button className="btn btn-primary w-100 fw-bold" disabled={submittingReview}>
                      {submittingReview ? "Posting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Review List */}
              <div className="col-md-7">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="mb-4 pb-3 border-bottom">

                    <div className="d-flex justify-content-between align-items-start">

                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <div className="text-warning small">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                color={i < rev.rating ? "#ffc107" : "#e4e5e9"}
                              />
                            ))}
                          </div>

                          {/* SAFE EMAIL */}
                          <span className="fw-bold small text-dark">
                            {rev.user?.email?.split('@')[0] || "User"}
                          </span>
                        </div>

                        <p className="text-muted small mb-1">{rev.reviewNotes}</p>

                        <small className="text-muted" style={{ fontSize: '10px' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </small>
                      </div>

                      {/* ✅ DELETE ONLY FOR OWNER */}
                      {user?._id?.toString() === rev.user?._id?.toString() && (<FaTrash
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        size={14}
                        onClick={() => handleDeleteReview(rev._id)}
                      />
                      )}

                    </div>

                  </div>
                )) : (
                  <p className="text-muted">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;