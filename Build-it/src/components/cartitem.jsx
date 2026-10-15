import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { usecartStore } from "../Store/cartStore.jsx";
import { API } from "../api";
import useAuth from "../hooks/useAuth";

export default function cartitem({ product }) {
  const [qty, setQty] = useState(product.qty);
  const [removed, setRemoved] = useState(false);
  const { auth } = useAuth();
  const { removefromcart, qtysetter } = usecartStore((state) => ({
    removefromcart: state.removefromcart,
    qtysetter: state.qtysetter,
  }));

  const price = (parseFloat(product.price) || 0) * qty;
  const productlink = `/products/${product.category}/${product.id}`;

  const handleClick = async () => {
    try {
      const response = await axios.delete(`${API}/cart-page`, {
        data: { Id: product.id, userid: auth?.user?.userId },
      });
      if (response.status === 200) {
        setRemoved(true);
        setTimeout(() => removefromcart(product.id), 250);
      }
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  useEffect(() => {
    qtysetter(product.id, qty);
  }, [qty]); // eslint-disable-line react-hooks/exhaustive-deps

  if (removed) return null;

  return (
    <div className="citem">
      <img src={product.imageurl} alt={product.name} />
      <div>
        <h5>
          <Link to={productlink}>{product.name}</Link>
        </h5>
        <span className="mini-qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
          <b>{qty}</b>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
        </span>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="price">₹{price.toLocaleString("en-IN")}</div>
        <button className="rm" onClick={handleClick} aria-label="Remove item">
          <i className="fa-solid fa-trash-can" />
        </button>
      </div>
    </div>
  );
}
