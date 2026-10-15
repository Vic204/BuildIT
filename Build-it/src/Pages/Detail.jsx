import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { usecartStore } from "../Store/cartStore";
import useAuth from "../hooks/useAuth";
import { API } from "../api";
import { Reveal, Magnetic } from "../fx";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const userid = auth?.user?.userId;
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const { addtocart } = usecartStore((state) => ({ addtocart: state.addtocart }));

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          pathname.includes("/products")
            ? `${API}/products/category/${id}`
            : `${API}/brands/brandname/${id}`
        );
        if (alive && response.status === 200) setProduct(response.data);
      } catch {
        if (alive) setMessage("Could not load this part.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => {
      alive = false;
    };
  }, [id, pathname]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API}/products/category/${id}`, { qty, userid });
      if (response.status === 200) {
        addtocart({ ...product, qty });
        setAdded(true);
        setMessage("Added to your cart.");
        setTimeout(() => navigate(`/cart-page/${userid}`), 900);
      }
    } catch {
      setMessage("Could not add to cart — it may already be there.");
    }
  };

  const price = parseInt(product?.price || 0);
  const mrp = price + 200;

  return (
    <div>
      <Header />
      <div className="wrap">
        <button onClick={() => navigate(-1)} className="arrow" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0 }}>
          <i className="fa-solid fa-arrow-left" /> Back to results
        </button>
        {loading ? (
          <div className="skel" style={{ marginTop: 20 }}>Loading part…</div>
        ) : !product ? (
          <div className="empty" style={{ marginTop: 20 }}>
            <h3>Part not found</h3>
            <p>{message}</p>
          </div>
        ) : (
          <div className="detail-grid" style={{ marginTop: 20 }}>
            <Reveal>
              <div className="detail-img">
                <span className="stamp">{product.category?.toUpperCase() || "PART"}</span>
                <img src={product.imageurl} alt={product.name} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="detail-info">
                <div className="eyebrow">{product.brand?.toUpperCase()}</div>
                <h1>{product.name}</h1>
                <div className="price-row">
                  <span className="price-now">₹{price.toLocaleString("en-IN")}</span>
                  <span className="price-was">₹{mrp.toLocaleString("en-IN")}</span>
                  <span className="save-tag">SAVE ₹200</span>
                </div>
                <div className="stock-line">
                  <i className="fa-solid fa-circle-check" /> In stock · ships carbon-neutral
                </div>
                <p style={{ color: "#57493f", lineHeight: 1.65, fontSize: 15 }}>
                  {product.details || "Tested and ready for your build."}
                </p>
                <div className="qty-row">
                  <span className="qty">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                    <b>{qty}</b>
                    <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
                  </span>
                  <Magnetic>
                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={() => (auth?.user ? handleSubmit() : navigate("/login-page"))}
                    >
                      {added ? (
                        <><i className="fa-solid fa-check" /> Added!</>
                      ) : (
                        <><i className="fa-solid fa-cart-plus" /> Add to cart</>
                      )}
                    </button>
                  </Magnetic>
                </div>
                {message && <p className={added ? "form-ok" : ""} style={{ fontSize: 14 }}>{message}</p>}
                <div className="perks">
                  <div className="perk"><i className="fa-solid fa-truck-fast" /> Free shipping over ₹5,000</div>
                  <div className="perk"><i className="fa-solid fa-shield-halved" /> 3-year warranty</div>
                  <div className="perk"><i className="fa-solid fa-rotate-left" /> 7-day easy returns</div>
                  <div className="perk"><i className="fa-solid fa-leaf" /> E-waste takeback</div>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
