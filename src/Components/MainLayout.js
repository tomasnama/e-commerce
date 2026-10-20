import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = ({ cartCount = 0 }) => {

  return (
    <>
    <header className="bg-white px-4 shadow-sm py-2 d-flex align-items-center justify-content-between">
        <Link to="/"><img src="/images/logo.png" className="logo" alt="" /></Link>
        <Link to="checkout" className="position-relative text-black cart-icon">
            <span className="cart-icon"><ion-icon name="cart"></ion-icon></span>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger cart-count">
                {cartCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
        </Link>
    </header>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;