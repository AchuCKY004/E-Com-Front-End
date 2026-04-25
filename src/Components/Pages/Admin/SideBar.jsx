import { useState, useContext } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import icon from '../../../assets/iconn.png';
import Notifications from "./Notification";
import { FaBell } from "react-icons/fa6";


const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊", roles: ["admin"] },
    { path: "/admin/add-product", label: "Add Product", icon: "➕", roles: ["admin"] },
    { path: "/admin/category", label: "Categories", icon: "📁", roles: ["admin"] },
    { path: "/admin/product-list", label: "Inventory", icon: "📦", roles: ["admin"] },
    { path: "/admin/users", label: "Users", icon: "👥", roles: ["admin"] },
    { path: "/admin/orders", label: "Orders", icon: "🚚", roles: ["admin"] },
  ];

  // 1. Filter the items based on current role
  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <div className={`admin-sidebar bg-dark text-white ${isCollapsed ? "collapsed" : ""} ${isSidebarOpen ? "mobile-open" : ""}`}>
        {/* LOGO SECTION - Locked to 70px height */}
        <div className="sidebar-header d-flex align-items-center justify-content-between border-bottom border-secondary px-3" style={{ height: "70px" }}>
          <div className="d-flex align-items-center">
            <img src={icon} alt="logo" style={{ width: "35px", height: "35px", objectFit: 'contain' }} />
            {!isCollapsed && <span className="fw-bold fs-5 text-nowrap ms-2">CYBECom</span>}
          </div>
          <button className="btn text-white d-md-none border-0" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>

        <ul className="nav flex-column mt-3 px-2 flex-grow-1">
          {visibleItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <NavLink
                to={item.path}
                className="nav-link text-white d-flex align-items-center rounded p-2"
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
              >
                <span className="nav-icon me-3">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}

          <hr className="border-secondary mt-auto" />

          <li className="nav-item mb-3">
            <button onClick={handleLogout} className="nav-link text-danger border-0 bg-transparent d-flex align-items-center w-100">
              <span className="nav-icon me-3">🚪</span>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* TOPBAR - Locked to 70px height */}
        <header className="navbar bg-white border-bottom px-4 shadow-sm sticky-top" style={{ height: "70px" }}>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => window.innerWidth < 768 ? setIsSidebarOpen(true) : setIsCollapsed(!isCollapsed)}
            >
              ☰
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Admin Control Center</h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-muted d-none d-sm-inline">Welcome, <strong>{role?.toUpperCase()}</strong></span>
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '40px', height: '40px', cursor: 'pointer' }}
              onClick={() => navigate("/admin/profile")}
            >
              {/* If you have the admin name, use initials like 'AS' */}
              A
            </div>
            <div>
              <Link to={"/admin/notifications"} className="rounded-circle  d-flex align-items-center justify-content-center bg-primary  shadow-sm" style={{ width: '30px', height: '30px', cursor: 'pointer' }}
              >
                <FaBell style={{ color: 'white', fontSize: '15px' }} />
              </Link>
            </div>
          </div>

        </header>

        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;