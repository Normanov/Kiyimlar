import React, { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { productImage, handleImageError, formatPrice } from "../../utils/catalog.js";
import { IconClose, IconBag, IconTruck, IconTrash, IconGift, IconCheckCircle } from "../Icons.jsx";

function ShippingProgress({ subtotal }) {
  const FREE_AT = 100;
  const pct = Math.min(100, (subtotal / FREE_AT) * 100);
  const remaining = FREE_AT - subtotal;
  return (
    <div className="shipping-progress">
      <div className="sp-bar"><div className="sp-fill" style={{ width: `${pct}%` }} /></div>
      <div className="sp-text">
        {pct >= 100 ? (
          <span className="sp-free"><IconCheckCircle width={13} height={13} /> Bepul yetkazib berish qo'shildi!</span>
        ) : (
          <span>Bepul yetkazib berish uchun <strong>{formatPrice(remaining)}</strong> qoldi</span>
        )}
      </div>
    </div>
  );
}

function OrderConfirmation({ orderId, onClose }) {
  return (
    <div className="order-confirm">
      <div className="oc-icon"><IconCheckCircle width={48} height={48} /></div>
      <h3>Buyurtmangiz qabul qilindi!</h3>
      <p>Buyurtma raqami: <strong>{orderId}</strong></p>
      <p className="oc-sub">Tez orada sizga xabar beriladi. Buyurtma holati profilingizda ko'rinadi.</p>
      <div className="oc-steps">
        <div className="oc-step done"><span>Qabul qilindi</span></div>
        <div className="oc-step"><span>Tayyorlanmoqda</span></div>
        <div className="oc-step"><span>Yo'lda</span></div>
        <div className="oc-step"><span>Yetkazildi</span></div>
      </div>
      <button className="btn btn-primary btn-block" onClick={onClose}>Yopish</button>
    </div>
  );
}

function CartDrawer() {
  const { items, open, closeCart, remove, setQty, subtotal, clear, count } = useCart();
  const toast = useToast();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  if (!open) return null;

  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === "MONO10") {
      setPromoApplied(true);
      toast.success("Promo kod qo'llandi! 10% chegirma");
    } else {
      toast.error("Noto'g'ri promo kod");
    }
  };

  const checkout = () => {
    const orderId = `ORD-2026-0${Math.floor(Math.random() * 90 + 10)}`;
    setConfirmed(orderId);
    clear();
  };

  const handleClose = () => {
    setConfirmed(null);
    setPromo("");
    setPromoApplied(false);
    closeCart();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={handleClose} />
      <aside className="drawer" role="dialog" aria-label="Savatcha">
        <div className="drawer-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBag width={20} height={20} />
            <h2 style={{ fontSize: 20 }}>Savatcha {count > 0 && `(${count})`}</h2>
          </div>
          <button className="modal-x" onClick={handleClose}><IconClose width={18} height={18} /></button>
        </div>

        {confirmed ? (
          <div className="drawer-body">
            <OrderConfirmation orderId={confirmed} onClose={handleClose} />
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {items.length === 0 ? (
                <div className="state" style={{ padding: "50px 10px" }}>
                  <div className="state-ic"><IconBag width={30} height={30} /></div>
                  <h3>Savatcha bo'sh</h3>
                  <p>Mahsulotlarni savatchaga qo'shing.</p>
                </div>
              ) : (
                <>
                  <ShippingProgress subtotal={subtotal} />
                  {items.map(({ product, qty }) => (
                    <div className="cart-row" key={product.id}>
                      <div className="cart-thumb">
                        <img src={productImage(product)} alt={product.name} onError={handleImageError(product)} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="cn">{product.name}</div>
                        <div className="cmeta">{product.category?.name}</div>
                        <div className="cprice">{formatPrice(product.price)}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <div className="qty" style={{ transform: "scale(.85)", transformOrigin: "left" }}>
                            <button onClick={() => setQty(product.id, qty - 1)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(product.id, qty + 1)}>+</button>
                          </div>
                          <button className="cart-remove" onClick={() => remove(product.id)}>
                            <IconTrash width={13} height={13} /> Olib tashlash
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">{formatPrice(product.price * qty)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="drawer-foot">
                {/* Promo code */}
                <div className="promo-row">
                  <input
                    className="promo-input"
                    placeholder="Promo kod (MONO10)"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    disabled={promoApplied}
                  />
                  <button className="promo-btn" onClick={applyPromo} disabled={promoApplied || !promo}>
                    {promoApplied ? "✓" : "Qo'llash"}
                  </button>
                </div>

                <div className="summary-row"><span>Jami</span><span>{formatPrice(subtotal)}</span></div>
                {promoApplied && (
                  <div className="summary-row discount-row">
                    <span><IconGift width={13} height={13} /> Chegirma (10%)</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span><IconTruck width={13} height={13} /> Yetkazib berish</span>
                  <span>{shipping === 0 ? "Bepul" : formatPrice(shipping)}</span>
                </div>
                <div className="summary-row total">
                  <span>Umumiy</span><span>{formatPrice(total)}</span>
                </div>
                <button className="btn btn-primary btn-block btn-lg" onClick={checkout}>
                  Buyurtma berish
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                  Xavfsiz to'lov · SSL himoyalangan
                </p>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
