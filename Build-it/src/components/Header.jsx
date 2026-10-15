import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";
import { usecartStore } from "../Store/cartStore";
import useAuth from "../hooks/useAuth";
import { ScrollProgress, Magnetic } from "../fx";

function Header() {
  const { auth, setAuth } = useAuth();
  const { cart } = usecartStore((state) => ({ cart: state.cart }));
  const [cartLength, setCartLength] = useState(0);
  const [showdropdown, setShowdropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  const handlelogout = () => {
    setAuth(null);
    setShowdropdown(false);
    navigate("/");
  };

  return (
    <>
      <ScrollProgress />
      <header className="hd">
        <div className="hd-in">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <i className="fa-solid fa-helmet-safety" />
            </span>
            <span>
              BuildIT<small>YES, WE CAN</small>
            </span>
          </Link>
          <nav className="nav">
            <Link to="/build">Build your own</Link>
            <Link to="/products">Categories</Link>
            <Link to="/brands">Brands</Link>
          </nav>
          <div className="hd-right">
            <Searchbar />
            {auth?.user ? (
              <div className="search-wrap">
                <button className="user-chip" type="button" onClick={() => setShowdropdown((s) => !s)}>
                  <i className="fa-solid fa-circle-user" /> {auth.user.username}
                </button>
                {showdropdown && (
                  <div className="logout-pop">
                    <button onClick={handlelogout}>Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login-page" className="btn-ghost-lt">
                Login / Register
              </Link>
            )}
            <Magnetic>
              <Link to={auth?.user ? `/cart-page/${auth.user.userId}` : "/login-page"} className="cart-btn">
                <i className="fa-solid fa-cart-shopping" /> Cart
                <span className="cart-count" key={cartLength}>{cartLength}</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
