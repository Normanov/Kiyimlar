import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice, initials } from "../../utils/catalog.js";
import {
  IconClose, IconPackage, IconTruck, IconCheckCircle,
  IconClock, IconMapPin, IconX, IconChevronRight, IconUser
} from "../Icons.jsx";

const STATUS_CFG = {
  ordered:   { label: "Qabul qilindi", color: "#6d5efc" },
  confirmed: { label: "Tasdiqlandi",   color: "#3b82f6" },
  shipped:   { label: "Yo'lda",        color: "#f59e0b" },
  delivered: { label: "Yetkazildi",    color: "#10b981" },
  cancelled: { label: "Bekor",         color: "#e5484d" },
};

const FAKE_ORDERS = [
  {
    id: "ORD-2026-051",
    items: [
      { name: "Premium Ko'ylak", qty: 1, price: 89.99, cat: "Shirts" },
      { name: "Slim Jeans",       qty: 2, price: 59.99, cat: "Jeans"  },
    ],
    total: 209.97, status: "delivered",
    date: "2026-06-10T10:30:00Z",
    address: "Toshkent, Yunusobod tumani, 15-uy", payment: "Karta",
  },
  {
    id: "ORD-2026-048",
    items: [{ name: "Classic Hoodie", qty: 1, price: 74.99, cat: "Hoodies" }],
    total: 74.99, status: "shipped",
    date: "2026-06-13T09:00:00Z",
    address: "Toshkent, Chilonzor tumani, 8-uy", payment: "Naqd",
  },
  {
    id: "ORD-2026-042",
    items: [
      { name: "Sport T-shirt", qty: 3, price: 29.99, cat: "T-shirts" },
      { name: "Shorts",         qty: 1, price: 34.99, cat: "Shorts"   },
    ],
    total: 124.96, status: "confirmed",
    date: "2026-06-15T14:15:00Z",
    address: "Samarqand sh., Registon ko'chasi, 5-uy", payment: "Karta",
  },
  {
    id: "ORD-2026-039",
    items: [{ name: "Formal Blazer", qty: 1, price: 149.99, cat: "Suits" }],
    total: 149.99, status: "cancelled",
    date: "2026-06-08T11:00:00Z",
    address: "Toshkent, Shayxontohur, 22-uy", payment: "Karta",
  },
  {
    id: "ORD-2026-033",
    items: [{ name: "Linen Shirt", qty: 2, price: 49.99, cat: "Shirts" }],
    total: 99.98, status: "delivered",
    date: "2026-05-28T08:45:00Z",
    address: "Toshkent, Mirzo Ulugbek, 3-uy", payment: "Naqd",
  },
];

const STEPS = ["ordered", "confirmed", "shipped", "delivered"];

function hexAlpha(hex, a) {
  if (!hex || hex.length < 7) return `rgba(109,94,252,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.ordered;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
      color: cfg.color,
      background: hexAlpha(cfg.color, 0.12),
      border: `1px solid ${hexAlpha(cfg.color, 0.28)}`,
      padding: "3px 9px", borderRadius: 999,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function Timeline({ status }) {
  if (status === "cancelled") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px", borderRadius: 8,
        background: "rgba(229,72,77,.08)", color: "#e5484d",
        fontSize: 13, fontWeight: 600,
      }}>
        <IconX width={14} height={14} /> Buyurtma bekor qilindi
      </div>
    );
  }
  const curIdx = STEPS.indexOf(status);
  return (
    <div className="prof-timeline">
      {STEPS.map((step, i) => {
        const cfg = STATUS_CFG[step];
        const done   = i <= curIdx;
        const active = i === curIdx;
        return (
          <div key={step} className="ptl-step">
            <div className="ptl-ic-wrap">
              <div className="ptl-ic" style={done ? { background: active ? "#6d5efc" : "#10b981", borderColor: active ? "#6d5efc" : "#10b981", color: "#fff" } : {}}>
                {done ? <IconCheckCircle width={12} height={12} /> : <span className="ptl-num">{i + 1}</span>}
              </div>
              {i < STEPS.length - 1 && (
                <div className="ptl-line" style={{ background: i < curIdx ? "#10b981" : "var(--glass-border)" }} />
              )}
            </div>
            <span className="ptl-label" style={{ color: done ? "var(--ink-soft)" : "var(--muted)", fontWeight: active ? 700 : 400 }}>
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle }) {
  return (
    <div className="prof-ocard">
      <button className="poc-row" onClick={onToggle}>
        <div className="poc-left">
          <span className="poc-id">{order.id}</span>
          <span className="poc-date">
            {new Date(order.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long" })}
          </span>
        </div>
        <StatusPill status={order.status} />
        <div className="poc-right2">
          <span className="poc-amt">{formatPrice(order.total)}</span>
          <IconChevronRight width={14} height={14} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform .2s", color: "var(--muted)" }} />
        </div>
      </button>

      {expanded && (
        <div className="poc-detail">
          <Timeline status={order.status} />

          <div className="poc-items">
            {order.items.map((item, i) => (
              <div key={i} className="poc-item">
                <div className="poc-item-dot" />
                <span className="poc-item-name">{item.name}</span>
                <span className="poc-item-meta">{item.cat} · ×{item.qty}</span>
                <span className="poc-item-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="poc-meta">
            <span><IconMapPin width={12} height={12} /> {order.address}</span>
            <span>To'lov: {order.payment}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = ["Profil", "Buyurtmalar"];

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();
  const [tab, setTab]         = useState("Profil");
  const [expandedId, setExp]  = useState(null);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const delivered  = FAKE_ORDERS.filter((o) => o.status === "delivered").length;
  const totalSpent = FAKE_ORDERS.filter((o) => o.status !== "cancelled")
                                .reduce((s, o) => s + o.total, 0);

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="prof-wrap" onClick={(e) => e.stopPropagation()} role="dialog">

        {/* Header */}
        <div className="prof-head">
          <div className="prof-user">
            <div className="prof-av">{initials(user?.username || "U")}</div>
            <div>
              <div className="prof-uname">{user?.username}</div>
              <div className="prof-urole">{user?.role === "admin" ? "Administrator" : "Xaridor"}</div>
            </div>
          </div>
          <button className="modal-x" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>

        {/* Stats */}
        <div className="prof-kpis">
          <div className="prof-kpi">
            <div className="prof-kpi-v">{FAKE_ORDERS.length}</div>
            <div className="prof-kpi-l">Buyurtmalar</div>
          </div>
          <div className="prof-kpi">
            <div className="prof-kpi-v">{delivered}</div>
            <div className="prof-kpi-l">Yetkazildi</div>
          </div>
          <div className="prof-kpi">
            <div className="prof-kpi-v">{formatPrice(totalSpent)}</div>
            <div className="prof-kpi-l">Jami xarid</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="prof-tabs">
          {TABS.map((t) => (
            <button key={t} className={`prof-tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="prof-body">
          {tab === "Profil" && (
            <div className="prof-fields">
              {[
                ["Foydalanuvchi nomi", user?.username],
                ["Rol",                user?.role],
                ["Ro'yxatdan o'tish",  "2026-yil"],
                ["Manzil",             "Toshkent, O'zbekiston"],
              ].map(([label, val]) => (
                <div key={label} className="prof-field-row">
                  <span className="pfr-label">{label}</span>
                  <span className="pfr-val">{val || "—"}</span>
                </div>
              ))}
              <button
                className="btn btn-ghost"
                style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
                onClick={() => { onClose(); logout(); }}
              >
                Hisobdan chiqish
              </button>
            </div>
          )}

          {tab === "Buyurtmalar" && (
            <div className="prof-orders">
              {FAKE_ORDERS.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  expanded={expandedId === o.id}
                  onToggle={() => setExp(expandedId === o.id ? null : o.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
