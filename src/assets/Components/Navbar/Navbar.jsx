import React, { useContext , useEffect} from "react";
import { AuthContext } from "../../Context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom";
import icon from '../../assets/iconn.png';
import { FaShoppingCart, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { CartContext } from "../../Context/CartContext";



function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const {cartCount ,  fetchCartItems} = useContext(CartContext);

    const onLogout = () => {

        logout();
        navigate("/login");

    };
    useEffect(() => {
        fetchCartItems();
    }, []);
    return (
        <>
            <div className=" align-items-center mt-3" >
                <Link className="navbar-brand align-items-center  me-3" to="/dashboard">
                    <img
                        src={icon}
                        alt="logo"
                        className="me-2"
                        style={{ width: "40px", height: "40px" }}
                    />
                    <span className="fw-bold fs-5 ">CYBECom</span>

                </Link>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light  px-4 mt-2  ">

                <div
                    className="d-flex align-items-center border border-primary border-2  px-3 flex-grow-1 me-3"
                    style={{ height: "45px", maxWidth: "900px", borderRadius :"12px" }}
                >
                    <FaSearch style={{ color: "#6c757d", fontSize: "14px" }} />

                    <input
                        type="text"
                        placeholder="Search for Products, Brands and More"
                        className="form-control border-0 shadow-none ms-2"
                    />
                </div>
                <div className=" d-flex gap-2">
                    <button className="btn btn-outline-dark border-0 d-flex align-items-center gap-2" onClick={() => navigate("/cart")}>
                        <FaShoppingCart />
                        Cart ({cartCount})
                    </button>
                    <button type="button" className="btn d-flex border-0 btn-outline-primary align-items-center gap-2" onClick={onLogout}><FaSignOutAlt />Logout</button>
                </div>
            </nav>



        </>



    );
}

export default Navbar;
