import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CartItem from "../components/cartitem.jsx";
import axios from "axios";
import useAuth from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import { usecartStore } from "../Store/cartStore.jsx";
import { API } from "../api";
import { Reveal } from "../fx";

export default function Cart() {
  const { auth } = useAuth();
  const [totalprice, settotalprice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = usecartStore((state) => ({ cart: state.cart }));

  const userid = auth?.user?.userId;

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      if (!userid) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API}/cart-page/${userid}`);
        if (alive && response.status === 200) {
          usecartStore.setState({ cart: response.data });
        }
      } catch {
        if (alive) setError("Could not load your cart. Is the server running?");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => {
      alive = false;
    };
  }, [userid]);

  useEffect(() => {
    let total = 0;
    let qty = 0;
    cart.forEach((item) => {
      total += (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
      qty += parseInt(item.qty) || 0;
    });
    settotalprice(total);
    setQuantity(qty);
  }, [cart]);

  return (
    <>
      <Header />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Your cart</div>
              <h2>Cart <i>({cart.length})</i></h2>
            </div>
          </div>
        </Reveal>
        {loading ? (
          <div className="skel">Loading your cart…</div>
        ) : error ? (
          <div className="empty"><h3>Cart unreachable</h3><p>{error}</p></div>
        ) : cart.length === 0 ? (
          <div className="empty">
            <i className="fa-solid fa-box-open" />
            <h3>Your cart is empty</h3>
            <p>Add your first part — or build a full PC in the guided builder.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              <Link to="/build" className="btn btn-solid">Build your own PC</Link>
              <Link to="/products" className="btn btn-line" style={{ color: "#100c0b", borderColor: "#100c0b" }}>Browse parts</Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              {cart.map((item) => (
                <CartItem key={item.cartid ?? item.id} product={item} />
              ))}
            </div>
            <div className="summary">
              <h3>CART TOTALS</h3>
              <div className="row"><span>Items</span><span>{quantity}</span></div>
              <div className="row"><span>Subtotal</span><span>₹{totalprice.toLocaleString("en-IN")}</span></div>
              <div className="row"><span>Shipping</span><span>{totalprice > 5000 ? "Free" : "₹200"}</span></div>
              <div className="row total"><span>Payable</span><b>₹{(totalprice + (totalprice > 5000 ? 0 : 200)).toLocaleString("en-IN")}</b></div>
              <Link
                to="/cart-page/checkout"
                className="btn btn-solid btn-block"
                style={{ marginTop: 20, background: "#ff5040" }}
              >
                Proceed to checkout <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
