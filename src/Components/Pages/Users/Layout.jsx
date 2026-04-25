import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import MiniNavbar from "../../Navbar/Mininavbar";

const UserLayout = () => {

  const location = useLocation();
  // Define which paths should NOT show the MiniNavbar
  const hideMiniNavbarPaths = ["/cart"];
  const shouldHideMiniNavbar = hideMiniNavbarPaths.includes(location.pathname);

  return (
    <div className="container-fluid " style={{ maxWidth: "1200px", width: "100%" }}>
      {/* This header stays visible on all user pages */}
      <div className="sticky-top bg-white  justify-content-center" >
        <Navbar />
        {!shouldHideMiniNavbar && <MiniNavbar />}
      </div>

      {/* This is where the specific page (Dashboard, Cart, etc.) renders */}
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;