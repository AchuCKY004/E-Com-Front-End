

// import React, { useState, useEffect, useContext } from "react";
// import Api from "../../../api/axios";
// import ProductCard from "./ProductCard.jsx";
// import { CartContext } from "../../../Context/CartContext.jsx";

// function Dashboard() {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [brands, setBrands] = useState([]);

//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedBrand, setSelectedBrand] = useState("");
//     const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//     const [sort, setSort] = useState("");

//     const [loading, setLoading] = useState(true);

//     const { fetchCartItems } = useContext(CartContext);

//     // ✅ FETCH PRODUCTS WITH ALL FILTERS
//     const fetchProducts = async () => {
//         try {
//             setLoading(true);

//             const params = {};

//             if (selectedCategory) params.category = selectedCategory;
//             if (selectedBrand) params.brand = selectedBrand;
//             if (priceRange.min) params.minPrice = priceRange.min;
//             if (priceRange.max) params.maxPrice = priceRange.max;
//             if (sort) params.sort = sort;

//             const res = await Api.get("/products", { params });

//             const data = res.data;
//             setProducts(data);

//             // ✅ Extract Categories
//             const uniqueCategories = [
//                 ...new Map(
//                     data.map((p) => [
//                         p.category?._id || p.category,
//                         p.category,
//                     ])
//                 ).values(),
//             ];
//             setCategories(uniqueCategories);

//             // ✅ Extract Brands
//             const uniqueBrands = [
//                 ...new Map(
//                     data.map((p) => [
//                         p.brand?._id || p.brand,
//                         p.brand,
//                     ])
//                 ).values(),
//             ];
//             setBrands(uniqueBrands);

//         } catch (err) {
//             console.error("Fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ AUTO FETCH ON FILTER CHANGE
//     useEffect(() => {
//         fetchProducts();
//         fetchCartItems();
//     }, [selectedCategory, selectedBrand, priceRange, sort]);

//     if (loading) {
//         return <div className="text-center mt-5">Loading...</div>;
//     }

//     return (
//         <div className="container py-4">

//             {/* 🔥 FILTER BAR */}
//             <div className="card p-3 border-none shadow-none" style={{ top: -40 }}>

//                 <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">

//                     {/* ✅ CATEGORY */}
//                     <div className="d-flex gap-2 flex-wrap">
//                         <button
//                             className={`btn btn-sm ${selectedCategory === "" ? "btn-dark" : "btn-outline-dark"
//                                 }`}
//                             onClick={() => setSelectedCategory("")}
//                         >
//                             All
//                         </button>

//                         {categories.map((cat) => (
//                             <button
//                                 key={cat?._id || cat}
//                                 className={`btn btn-sm ${selectedCategory === (cat?._id || cat)
//                                         ? "btn-dark"
//                                         : "btn-outline-dark"
//                                     }`}
//                                 onClick={() =>
//                                     setSelectedCategory(cat?._id || cat)
//                                 }
//                             >
//                                 {cat?.name || "Category"}
//                             </button>
//                         ))}
//                     </div>

//                     {/* ✅ BRAND */}
//                     <select
//                         className="form-select form-select-sm w-auto"
//                         value={selectedBrand}
//                         onChange={(e) => setSelectedBrand(e.target.value)}
//                     >
//                         <option value="">All Brands</option>
//                         {brands.map((b) => (
//                             <option key={b?._id || b} value={b?._id || b}>
//                                 {b?.name || "Brand"}
//                             </option>
//                         ))}
//                     </select>

//                     {/* ✅ PRICE */}
//                     <div className="d-flex gap-2">
//                         <input
//                             type="number"
//                             placeholder="Min ₹"
//                             className="form-control form-control-sm"
//                             style={{ width: "100px" }}
//                             value={priceRange.min}
//                             onChange={(e) =>
//                                 setPriceRange({
//                                     ...priceRange,
//                                     min: e.target.value,
//                                 })
//                             }
//                         />

//                         <input
//                             type="number"
//                             placeholder="Max ₹"
//                             className="form-control form-control-sm"
//                             style={{ width: "100px" }}
//                             value={priceRange.max}
//                             onChange={(e) =>
//                                 setPriceRange({
//                                     ...priceRange,
//                                     max: e.target.value,
//                                 })
//                             }
//                         />
//                     </div>

//                     {/* ✅ SORT */}
//                     <select
//                         className="form-select form-select-sm w-auto"
//                         value={sort}
//                         onChange={(e) => setSort(e.target.value)}
//                     >
//                         <option value="">Sort</option>
//                         <option value="price_asc">Price Low → High</option>
//                         <option value="price_desc">Price High → Low</option>
//                     </select>

//                     {/* ✅ RESET */}
//                     <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => {
//                             setSelectedCategory("");
//                             setSelectedBrand("");
//                             setPriceRange({ min: "", max: "" });
//                             setSort("");
//                         }}
//                     >
//                         Reset
//                     </button>

//                 </div>
//             </div>

//             {/* 🛒 PRODUCTS */}
//             <div className="row g-4">
//                 {products.length > 0 ? (
//                     products.map((item) => (
//                         <div key={item._id} className="col-12 col-md-6 col-lg-4">
//                             <ProductCard product={item} />
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-center mt-5">
//                         No Products Found
//                     </div>
//                 )}
//             </div>

//         </div>
//     );
// }

// export default Dashboard;


import React, { useState, useEffect, useContext } from "react";
import Api from "../../../api/axios";
import ProductCard from "./ProductCard.jsx";
import { CartContext } from "../../../Context/CartContext.jsx";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // ✅ UI STATE
    const [filters, setFilters] = useState({
        category: "",
        brand: "",
        min: "",
        max: "",
        sort: "",
    });

    // ✅ APPLIED FILTERS
    const [appliedFilters, setAppliedFilters] = useState({});

    const [loading, setLoading] = useState(true);

    const { fetchCartItems } = useContext(CartContext);

    // ✅ INITIAL LOAD (GET ALL PRODUCTS + EXTRACT FILTER DATA)
    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await Api.get("/products");
            const data = res.data;

            setProducts(data);

            // ✅ Categories
            const uniqueCategories = [
                ...new Map(
                    data.map((p) => [
                        p.category?._id || p.category,
                        p.category,
                    ])
                ).values(),
            ];
            setCategories(uniqueCategories);

            // ✅ Brands (FIXED)
            const uniqueBrands = [
                ...new Map(
                    data.map((p) => [
                        p.brand?._id || p.brand,
                        typeof p.brand === "object"
                            ? p.brand
                            : { name: p.brand },
                    ])
                ).values(),
            ];
            setBrands(uniqueBrands);

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FETCH FILTERED PRODUCTS
    const fetchFilteredProducts = async () => {
        try {
            setLoading(true);

            const params = {};

            if (appliedFilters.category)
                params.category = appliedFilters.category;
            if (appliedFilters.brand)
                params.brand = appliedFilters.brand;
            if (appliedFilters.min)
                params.minPrice = appliedFilters.min;
            if (appliedFilters.max)
                params.maxPrice = appliedFilters.max;
            if (appliedFilters.sort)
                params.sort = appliedFilters.sort;

            const res = await Api.get("/products", { params });
            setProducts(res.data);

        } catch (err) {
            console.error("Filter fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ INITIAL LOAD
    useEffect(() => {
        fetchProducts();
        fetchCartItems();
    }, []);

    // ✅ APPLY FILTER TRIGGER
    useEffect(() => {
        if (Object.keys(appliedFilters).length > 0) {
            fetchFilteredProducts();
        }
    }, [appliedFilters]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container py-4">

            {/* 🔥 FILTER BAR */}
            <div className="card p-3 mb-4 shadow-sm">

                <div className="row g-2 align-items-center">

                    {/* CATEGORY */}
                    <div className="col-md-2">
                        <select
                            className="form-select form-select-sm"
                            value={filters.category}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option
                                    key={cat?._id || cat}
                                    value={cat?._id || cat}
                                >
                                    {cat?.name || "Category"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* BRAND */}
                    <div className="col-md-2">
                        <select
                            className="form-select form-select-sm"
                            value={filters.brand}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    brand: e.target.value,
                                })
                            }
                        >
                            <option value="">All Brands</option>
                            {brands.map((b) => (
                                <option
                                    key={b?._id || b}
                                    value={b?._id || b}
                                >
                                    {b?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* PRICE */}
                    <div className="col-md-3 d-flex gap-2">
                        <input
                            type="number"
                            placeholder="Min ₹"
                            className="form-control form-control-sm"
                            value={filters.min}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    min: e.target.value,
                                })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Max ₹"
                            className="form-control form-control-sm"
                            value={filters.max}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    max: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* SORT */}
                    <div className="col-md-2">
                        <select
                            className="form-select form-select-sm"
                            value={filters.sort}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    sort: e.target.value,
                                })
                            }
                        >
                            <option value="">Sort</option>
                            <option value="price_asc">
                                Price Low → High
                            </option>
                            <option value="price_desc">
                                Price High → Low
                            </option>
                        </select>
                    </div>

                    {/* BUTTONS */}
                    <div className="col-md-3 d-flex gap-2">

                        {/* APPLY */}
                        <button
                            className="btn btn-dark btn-sm w-100"
                            onClick={() => setAppliedFilters(filters)}
                        >
                            Apply
                        </button>

                        {/* RESET */}
                        <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => {
                                const reset = {
                                    category: "",
                                    brand: "",
                                    min: "",
                                    max: "",
                                    sort: "",
                                };
                                setFilters(reset);
                                setAppliedFilters({});
                                fetchProducts();
                            }}
                        >
                            Reset
                        </button>

                    </div>

                </div>
            </div>

            {/* 🛒 PRODUCTS */}
            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((item) => (
                        <div
                            key={item._id}
                            className="col-12 col-md-6 col-lg-4"
                        >
                            <ProductCard product={item} />
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5">
                        No Products Found
                    </div>
                )}
            </div>

        </div>
    );
}

export default Dashboard;   