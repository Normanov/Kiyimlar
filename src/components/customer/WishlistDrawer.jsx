import React from "react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { productImage, handleImageError, formatPrice } from "../../utils/catalog.js";
import { IconClose, IconHeart, IconBag, IconTrash } from "../Icons.jsx";

function WishlistDrawer({ products, onAdd }) {
  const { open, closeWishlist, favIds, toggle } = useWishlist();
  if (!open) return null;

  const favProducts = products.filter((p) => favIds.has(p.id));

  return (
    <>
      <div className="drawer-backdrop" onClick={closeWishlist} />
      <aside className="drawer wishlist-drawer" role="dialog" aria-label="Sevimlilar">
        <div className="drawer-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconHeart width={20} height={20} style={{ color: "#e5484d" }} />
            <h2 style={{ fontSize: 20 }}>Sevimlilar {favProducts.length > 0 && `(${favProducts.length})`}</h2>
          </div>
          <button className="modal-x" onClick={closeWishlist}><IconClose width={18} height={18} /></button>
        </div>

        <div className="drawer-body">
          {favProducts.length === 0 ? (
            <div className="state" style={{ padding: "50px 10px" }}>
              <div className="state-ic"><IconHeart width={30} height={30} /></div>
              <h3>Sevimlilar bo'sh</h3>
              <p>Yoqtirgan mahsulotlaringizni saqlang.</p>
            </div>
          ) : (
            favProducts.map((p) => (
              <div className="cart-row wish-row" key={p.id}>
                <div className="cart-thumb">
                  <img src={productImage(p)} alt={p.name} onError={handleImageError(p)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="cn">{p.name}</div>
                  <div className="cmeta">{p.category?.name}</div>
                  <div className="cprice">{formatPrice(p.price)}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: "5px 12px", height: 30 }}
                      onClick={() => { onAdd(p); closeWishlist(); }}
                    >
                      <IconBag width={13} height={13} /> Savatchaga
                    </button>
                    <button
                      className="cart-remove"
                      onClick={() => toggle(p.id)}
                    >
                      <IconTrash width={13} height={13} /> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default WishlistDrawer;
