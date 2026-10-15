import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API } from "../api";
import { Reveal, Magnetic } from "../fx";

const STEPS = [
  { key: "processors", label: "Processor", hint: "CPU — the brains of the build", icon: "fa-microchip" },
  { key: "graphicscards", label: "Graphics Card", hint: "GPU — for gaming and rendering", icon: "fa-display" },
  { key: "motherboard", label: "Motherboard", hint: "The board everything plugs into", icon: "fa-network-wired" },
  { key: "ram", label: "Memory", hint: "RAM — keeps everything responsive", icon: "fa-bolt" },
  { key: "storage", label: "Storage", hint: "SSD — for games and files", icon: "fa-database" },
  { key: "psu", label: "Power Supply", hint: "PSU — feeds the whole PC", icon: "fa-plug-circle-bolt" },
  { key: "case", label: "Case", hint: "The box it all lives in", icon: "fa-box" },
];

const tagOf = (s) => (s?.match(/\[([^\]]+)\]/) || [])[1] || null;

export default function Build() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState({});
  const [deploying, setDeploying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await Promise.all(
          STEPS.map((s) => axios.get(`${API}/products/${s.key}`).then((r) => [s.key, r.data]).catch(() => [s.key, []]))
        );
        if (alive) setOptions(Object.fromEntries(res));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const total = useMemo(
    () => Object.values(picks).reduce((t, p) => t + (parseFloat(p?.price) || 0), 0),
    [picks]
  );
  const count = Object.keys(picks).length;

  // --- compatibility checks ---
  const cpu = picks.processors;
  const board = picks.motherboard;
  const gpu = picks.graphicscards;
  const psu = picks.psu;
  const cpuTag = tagOf(cpu?.details);
  const boardTag = tagOf(board?.details);
  const platformOk = !cpu || !board ? null : cpuTag && boardTag ? cpuTag === boardTag : null;
  const loadW = (parseInt(cpu?.watts) || 0) + (parseInt(gpu?.watts) || 0) + 150;
  const psuW = parseInt(psu?.watts) || 0;
  const powerOk = !psu || (!cpu && !gpu) ? null : psuW >= loadW;

  const cur = STEPS[step];
  const list = options[cur.key] || [];

  const choose = (item) => {
    setPicks((p) => ({ ...p, [cur.key]: item }));
    setMsg("");
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const deploy = async () => {
    if (!auth?.user) {
      navigate("/login-page");
      return;
    }
    setDeploying(true);
    setMsg("");
    let added = 0;
    for (const s of STEPS) {
      const item = picks[s.key];
      if (!item) continue;
      try {
        await axios.post(`${API}/products/build/${item.id}`, { qty: 1, userid: auth.user.userId });
        added++;
      } catch {
        /* already in cart — count as added */
        added++;
      }
    }
    setDeploying(false);
    setMsg(`Added ${added} parts to your cart.`);
    setTimeout(() => navigate(`/cart-page/${auth.user.userId}`), 900);
  };

  return (
    <div>
      <Header />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Guided PC builder</div>
              <h2>Build your <i>own PC</i></h2>
              <p>Seven simple steps, one finished computer. Pick a part at each step — your total updates live on the right.</p>
            </div>
            <span className="pill">{count}/7 STEPS DONE</span>
          </div>
        </Reveal>
        {loading ? (
          <div className="skel">Loading categories…</div>
        ) : (
          <div className="builder">
            <div className="steps">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  className={`step ${i === step ? "active" : ""} ${picks[s.key] ? "done" : ""}`}
                  onClick={() => setStep(i)}
                >
                  <span className="step-n">{picks[s.key] ? <i className="fa-solid fa-check" /> : i + 1}</span>
                  <span><b>{s.label}</b><small>{s.hint}</small></span>
                </button>
              ))}
            </div>
            <div className="stage">
              <h3><i className={`fa-solid ${cur.icon}`} /> Step {step + 1} — {cur.label}</h3>
              <p className="muted">{cur.hint} · {list.length} options in stock</p>
              {list.length === 0 ? (
                <div className="empty"><h3>Shelf empty</h3><p>Run <code>npm run seed</code> on the server to stock this category.</p></div>
              ) : (
                list.map((item) => (
                  <button
                    key={item.id}
                    className={`opt ${picks[cur.key]?.id === item.id ? "sel" : ""}`}
                    onClick={() => choose(item)}
                  >
                    <img src={item.imageurl} alt={item.name} loading="lazy" />
                    <span className="opt-info"><b>{item.name}</b><small>{item.brand?.toUpperCase()}</small></span>
                    <span className="price">₹{parseInt(item.price).toLocaleString("en-IN")}</span>
                    {picks[cur.key]?.id === item.id && <i className="fa-solid fa-circle-check opt-tick" />}
                  </button>
                ))
              )}
              <div className="stage-nav">
                <button className="btn btn-line" style={{ color: "#100c0b", borderColor: "#100c0b" }} disabled={step === 0} onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn btn-solid" onClick={() => setStep(step + 1)}>Next step →</button>
                ) : (
                  <Magnetic>
                    <button className="btn btn-solid" onClick={deploy} disabled={count === 0 || deploying}>
                      {deploying ? "Adding…" : <><i className="fa-solid fa-cart-plus" /> Add {count} parts to cart</>}
                    </button>
                  </Magnetic>
                )}
              </div>
              {msg && <p className="form-ok">{msg}</p>}
            </div>
            <aside className="manifest">
              <h3>BUILD SUMMARY</h3>
              {STEPS.map((s) => (
                <div className="mrow" key={s.key}>
                  <span>{s.label}</span>
                  <b>{picks[s.key] ? picks[s.key].name : <em>— not picked yet —</em>}</b>
                </div>
              ))}
              <div className="mrow total">
                <span>Total</span>
                <b key={total} className="total-flash">₹{total.toLocaleString("en-IN")}</b>
              </div>
              <div className="compat">
                <div className={`cline ${platformOk === null ? "" : platformOk ? "ok" : "warn"}`}>
                  <i className="fa-solid fa-microchip" />
                  {platformOk === null ? "Pick a processor + motherboard to check fit" : platformOk ? `Socket match: ${cpuTag}` : `Socket mismatch: ${cpuTag || "?"} vs ${boardTag || "?"}`}
                </div>
                <div className={`cline ${powerOk === null ? "" : powerOk ? "ok" : "warn"}`}>
                  <i className="fa-solid fa-plug-circle-bolt" />
                  {powerOk === null ? "Pick parts + power supply to check wattage" : powerOk ? `${psuW}W covers ~${loadW}W load` : `${psuW}W is short of ~${loadW}W load`}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
