import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="ft">
      <div className="hazard" aria-hidden="true" />
      <div className="ft-in">
        <div className="ft-brand">
          <h4>
            <i className="fa-solid fa-helmet-safety" style={{ color: "#ff5040" }} /> BuildIT
          </h4>
          <p>
            A workshop-style PC store. Tested parts, live prices and a guided 7-step builder —
            so your next computer is built right and priced honest.
          </p>
        </div>
        <div>
          <h4>SHOP</h4>
          <Link to="/">Home</Link>
          <Link to="/build">PC builder</Link>
          <Link to="/products">Categories</Link>
          <Link to="/brands">Brands</Link>
        </div>
        <div>
          <h4>HELP</h4>
          <Link to="/login-page">Login / Register</Link>
          <a href="https://github.com/Vic204/BuildIT" target="_blank" rel="noreferrer">Source code</a>
          <a href="#team" onClick={(e) => { e.preventDefault(); alert("Vyshnav\nRohit\nNandu\nAmal"); }}>Our team</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Email us your queries:\nvyshnav.potti@christuniversity.in\nrohit.b@christuniversity.in\namal.k@christuniversity.in\nnandagopal.b@christuniversity.in"); }}>Contact us</a>
        </div>
      </div>
      <div className="ft-in ft-bottom">
        <span>© 2024 BuildIT — measure twice, click once. Brick photography: Wikimedia Commons.</span>
        <span>White · Green · Black</span>
      </div>
    </footer>
  );
}

export default Footer;
