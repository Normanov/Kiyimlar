import React, { useState, useEffect } from "react";
import { productImage, handleImageError, formatPrice, ratingFor } from "../../utils/catalog.js";
import { IconClose, IconBag, IconHeart, IconTruck, IconCheckCircle, IconGift } from "../Icons.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Stars from "./Stars.jsx";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Qora",     hex: "#1a1a2e" },
  { name: "Oq",       hex: "#f0f0f2" },
  { name: "Ko'k",     hex: "#2563eb" },
  { name: "Kulrang",  hex: "#6b7280" },
  { name: "Jigarrang",hex: "#92400e" },
];

function ProductModal({ product, onClose, onAdd }) {
  const { has, toggle } = useWishlist();
  const [qty, setQty]     = useState(1);
  const [size, setSize]   = useState("M");
  const [color, setColor] = useState(0);
  const [adding, setAdding] = useState(false);

  const isFav  = product ? has(product.id) : false;
  const isSale = product ? product.id % 11 === 0 : false;
  const displayPrice = isSale ? (product?.price ?? 0) * 0.8 : (product?.price ?? 0);

  useEffect(() => {
    if (!product) return;
    setQty(1); setSize("M"); setColor(0); setAdding(false);
  }, [product?.id]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!product) return null;
  const rating = ratingFor(product);

  const handleAdd = () => {
    if (adding) return;
    setAdding(true);
    onAdd(product, qty);
    setTimeout(() => { setAdding(false); onClose(); }, 650);
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="pm2-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button className="pm2-close" onClick={onClose} aria-label="Yopish">
          <IconClose width={18} height={18} />
        </button>

        {/* Grid: image | info */}
        <div className="pm2-grid">
          {/* Image */}
          <div className="pm2-media">
            <img
              src={productImage(product)}
              alt={product.name}
              onError={handleImageError(product)}
            />
            {isSale && <div className="pm2-ribbon">−20%</div>}
          </div>

          {/* Info */}
          <div className="pm2-info">
            {/* Category + SKU */}
            <div className="pm2-top-row">
              <span className="pm2-cat">{product.category?.name || "Kolleksiya"}</span>
              <span className="pm2-sku">MNO-{String(product.id).padStart(4, "0")}</span>
            </div>

            {/* Name */}
            <h2 className="pm2-title">{product.name}</h2>

            {/* Stars or "Yangi" */}
            {rating ? (
              <div className="pm2-stars">
                <Stars value={rating.avg} count={rating.count} />
                <span className="pm2-rc">({rating.count} sharh)</span>
              </div>
            ) : (
              <span className="pm2-newtag">Yangi keldi</span>
            )}

            {/* Price */}
            <div className="pm2-prices">
              <span className="pm2-price">{formatPrice(displayPrice)}</span>
              {isSale && <span className="pm2-oldprice">{formatPrice(product.price)}</span>}
            </div>

            {/* Description */}
            {product.description && (
              <p className="pm2-desc">{product.description}</p>
            )}

            {/* Colors */}
            <div className="pm2-field">
              <div className="pm2-label">Rang: <b>{COLORS[color].name}</b></div>
              <div className="pm2-colors">
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    className={`pm2-cdot ${i === color ? "active" : ""}`}
                    style={{
                      background: c.hex,
                      border: c.hex === "#f0f0f2" ? "2px solid #ccc" : "2px solid transparent",
                    }}
                    title={c.name}
                    onClick={() => setColor(i)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="pm2-field">
              <div className="pm2-label">O'lcham: <b>{size}</b></div>
              <div className="pm2-sizes">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`pm2-sbtn ${size === s ? "active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to bag */}
            <div className="pm2-actions">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
              </div>
              <button
                className={`pm2-addbtn ${adding ? "added" : ""}`}
                onClick={handleAdd}
                disabled={adding}
              >
                <IconBag width={17} height={17} />
                {adding ? "Qo'shildi!" : `Savatchaga · ${formatPrice(displayPrice * qty)}`}
              </button>
              <button
                className={`pm2-favbtn ${isFav ? "on" : ""}`}
                onClick={() => toggle(product.id)}
                title={isFav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
              >
                <IconHeart width={18} height={18} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="pm2-delivery">
              <div className="pm2-ditem">
                <IconTruck width={14} height={14} />
                <span>$100 dan yuqori buyurtmada bepul yetkazib berish</span>
              </div>
              <div className="pm2-ditem">
                <IconCheckCircle width={14} height={14} />
                <span>2–5 ish kuni ichida yetkazib berish</span>
              </div>
              <div className="pm2-ditem">
                <IconGift width={14} height={14} />
                <span>14 kun ichida qaytarish imkoniyati</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
