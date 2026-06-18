import React, { useState } from "react";
import { productImage, handleImageError, formatPrice, ratingFor } from "../../utils/catalog.js";
import { IconHeart, IconBag, IconEye } from "../Icons.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Stars from "./Stars.jsx";

function ProductCard({ product, onOpen, onAdd }) {
  const { has, toggle } = useWishlist();
  const [adding, setAdding] = useState(false);
  const isFav = has(product.id);
  const rating = ratingFor(product);
  const isNew = product.id % 7 === 0;
  const isSale = product.id % 11 === 0;

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    onAdd(product);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <article className="pc2" onClick={() => onOpen(product)}>
      <div className="pc2-media">
        {/* Top badges */}
        <div className="pc2-badges">
          {isNew && <span className="pc2-badge new">Yangi</span>}
          {isSale && <span className="pc2-badge sale">-20%</span>}
        </div>

        {/* Wishlist heart */}
        <button
          className={`pc2-fav ${isFav ? "on" : ""}`}
          aria-label="Sevimlilarga"
          onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
        >
          <IconHeart width={16} height={16} fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Product image */}
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          onError={handleImageError(product)}
          className="pc2-img"
        />

        {/* Hover overlay */}
        <div className="pc2-overlay">
          <button
            className="pc2-ov-btn view"
            onClick={(e) => { e.stopPropagation(); onOpen(product); }}
          >
            <IconEye width={15} height={15} /> Ko'rish
          </button>
          <button
            className={`pc2-ov-btn bag ${adding ? "added" : ""}`}
            onClick={handleAdd}
          >
            <IconBag width={15} height={15} />
            {adding ? "Qo'shildi!" : "Savatchaga"}
          </button>
        </div>
      </div>

      <div className="pc2-body">
        <span className="pc2-cat">{product.category?.name}</span>
        <h3 className="pc2-name">{product.name}</h3>
        {rating && <Stars value={rating.avg} count={rating.count} />}
        <div className="pc2-foot">
          <div className="pc2-prices">
            {isSale ? (
              <>
                <span className="pc2-price">{formatPrice(product.price * 0.8)}</span>
                <span className="pc2-old-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="pc2-price">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            className={`pc2-cart-btn ${adding ? "added" : ""}`}
            onClick={handleAdd}
            aria-label="Savatchaga qo'shish"
          >
            <IconBag width={15} height={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
