import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usecartStore } from "../Store/cartStore";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";
import { Reveal } from "../fx";

const FIELDS = [
  ["firstName", "First name", "text"],
  ["lastName", "Last name", "text"],
  ["mobile", "Mobile", "tel"],
  ["email", "Email", "email"],
  ["addressLine1", "Address line 1", "text"],
  ["addressLine2", "Address line 2", "text"],
  ["state", "State", "text"],
  ["country", "Country", "text"],
];

const CheckoutForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [totalprice, settotalprice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [formData, setFormData] = useState(Object.fromEntries(FIELDS.map(([k]) => [k, ""])));
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { cart, clearcart } = usecartStore((state) => ({ cart: state.cart, clearcart: state.clearcart }));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Backend expects { userid, formData }
      const response = await axios.post(`${API}/cart-page/checkout`, {
        userid: auth?.user?.userId,
        formData,
      });
      setDone(response.data);
      clearcart();
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Is the server running?");
    } finally {
      setBusy(false);
    }
  };

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

  const payable = totalprice + 500 - 200 * quantity;

  if (!auth?.user) {
    return (
      <>
        <Header />
        <div className="wrap">
          <div className="empty">
            <i className="fa-solid fa-lock" />
            <h3>Identification required</h3>
            <p>Please sign in to place your order.</p>
            <Link to="/login-page" className="btn btn-solid" style={{ marginTop: 16 }}>Login / Register</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Almost done</div>
              <h2>Check<em style={{ color: "#c23a24", fontStyle: "normal" }}>out</em></h2>
            </div>
          </div>
        </Reveal>
        {done ? (
          <div className="empty">
            <i className="fa-solid fa-circle-check" />
            <h3>Order placed!</h3>
            <p>{done.message} — {done.count} items ordered. Your cart has been cleared.</p>
          </div>
        ) : (
          <div className="co-grid">
            <Reveal>
              <form onSubmit={handleSubmit} className="co-form">
                <h2>Delivery details</h2>
                <div className="co-2">
                  {FIELDS.map(([name, label, type]) => (
                    <div className="field" key={name}>
                      <label htmlFor={name}>{label.toUpperCase()}</label>
                      <input type={type} name={name} id={name} value={formData[name]} onChange={handleChange} required />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn btn-solid btn-block" disabled={busy}>
                  {busy ? "Placing order…" : <>Pay ₹{payable.toLocaleString("en-IN")} <i className="fa-solid fa-arrow-right" /></>}
                </button>
                {error && <p className="form-err">{error}</p>}
              </form>
            </Reveal>
            <Reveal delay={120}>
              <div className="summary">
                <h3>CART SUMMARY</h3>
                <div className="row"><span>Items</span><span>{quantity}</span></div>
                <div className="row"><span>Price</span><span>₹{(totalprice + 200 * quantity).toLocaleString("en-IN")}</span></div>
                <div className="row"><span>Tax</span><span>₹500</span></div>
                <div className="row"><span>Bundle discount</span><span>− ₹{(200 * quantity).toLocaleString("en-IN")}</span></div>
                <div className="row total"><span>Payable</span><b>₹{payable.toLocaleString("en-IN")}</b></div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CheckoutForm;
