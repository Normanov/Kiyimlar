import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductApi from "../../api/ProductApi.jsx";
import CategoryApi from "../../api/CategoryApi.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import ProductGrid from "./ProductGrid.jsx";
import ProductModal from "./ProductModal.jsx";
import WishlistDrawer from "./WishlistDrawer.jsx";
import {
  IconSearch, IconArrowRight, IconFilter, IconX,
  IconBag, IconHeart, IconTruck, IconGift, IconZap
} from "../Icons.jsx";
import { categoryMeta, categoryIconPath, formatPrice } from "../../utils/catalog.js";

const SORTS = {
  featured:   { label: "Tavsiya etilgan" },
  newest:     { label: "Yangi mahsulotlar" },
  "price-asc":  { label: "Narx: Kamdan ko'pga" },
  "price-desc": { label: "Narx: Ko'pdan kamga" },
  name:       { label: "Alifbo tartibida" },
};

const SORT_FNS = {
  featured:   (a, b) => a.id - b.id,
  newest:     (a, b) => b.id - a.id,
  "price-asc":  (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name:       (a, b) => a.name.localeCompare(b.name),
};

const PERKS = [
  { icon: IconTruck,  text: "$100 dan bepul yetkazib berish" },
  { icon: IconGift,   text: "14 kun ichida qaytarish" },
  { icon: IconZap,    text: "Tez va ishonchli yetkazma" },
  { icon: IconBag,    text: "Har kuni yangi mahsulotlar" },
];

function CategoryCard({ cat, active, onSelect, productCount }) {
  const meta = categoryMeta(cat.name);
  const path = categoryIconPath(cat.name);
  return (
    <button
      className={`cat-card ${active ? "active" : ""}`}
      onClick={() => onSelect(active ? null : cat.id)}
      style={{ "--from": meta.from, "--to": meta.to }}
    >
      <div className="cat-card-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={path} />
        </svg>
      </div>
      <div className="cat-card-name">{cat.name}</div>
      <div className="cat-card-count">{productCount} ta</div>
    </button>
  );
}

function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [active, setActive] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const { add, openCart } = useCart();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { count: favCount, openWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([ProductApi.fetchAllProducts(), CategoryApi.fetchCategory()])
      .then(([prodRes, catRes]) => {
        if (!alive) return;
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      })
      .catch(() => alive && toast.error("Ma'lumotlar yuklanmadi."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const catCounts = useMemo(() => {
    const m = {};
    products.forEach((p) => { const id = p.category?.id; if (id) m[id] = (m[id] || 0) + 1; });
    return m;
  }, [products]);

  const visible = useMemo(() => {
    let list = products;
    if (selectedCat != null) list = list.filter((p) => p.category?.id === selectedCat);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
    return [...list].sort(SORT_FNS[sort]);
  }, [products, selectedCat, query, sort]);

  const handleAdd = (product, qty = 1) => {
    if (!isAuthenticated) {
      toast.show("Xarid qilish uchun tizimga kiring");
      navigate("/login", { state: { from: location } });
      return;
    }
    add(product, qty);
    toast.success(`"${product.name}" savatchaga qo'shildi`);
  };

  const activeCatName = categories.find((c) => c.id === selectedCat)?.name;

  return (
    <div className="store-page">
      {/* Hero */}
      <section className="hero2">
        <div className="hero2-bg" />
        <div className="hero2-inner container">
          <div className="hero2-content">
            <span className="hero2-eyebrow">
              <span className="eyebrow-dot" />
              Yangi mavsum · 2026
            </span>
            <h1 className="hero2-title">
              Zamonaviy uslub,<br />
              <span className="hero2-gradient">har kuni uchun.</span>
            </h1>
            <p className="hero2-sub">
              Premium sifatli kiyimlar kolleksiyasi. Eng yangi trendlar, qulay narxlar va siz uchun tanlangan uslublar.
            </p>
            <div className="hero2-actions">
              <a className="btn btn-accent btn-lg hero2-cta" href="#collection">
                Kolleksiyani ko'rish <IconArrowRight width={18} height={18} />
              </a>
              {isAuthenticated && favCount > 0 && (
                <button className="btn hero2-fav-btn" onClick={openWishlist}>
                  <IconHeart width={16} height={16} fill="currentColor" /> Sevimlilar ({favCount})
                </button>
              )}
            </div>
            <div className="hero2-stats">
              <div className="h2-stat"><span className="h2-stat-n">{products.length || "—"}</span><span className="h2-stat-l">Mahsulot</span></div>
              <div className="h2-stat-div" />
              <div className="h2-stat"><span className="h2-stat-n">{categories.length || "—"}</span><span className="h2-stat-l">Kategoriya</span></div>
              <div className="h2-stat-div" />
              <div className="h2-stat"><span className="h2-stat-n">100%</span><span className="h2-stat-l">Original</span></div>
            </div>
          </div>
          <div className="hero2-visual">
            <div className="hero2-card-stack">
              <div className="hcs-card hcs-card-1" />
              <div className="hcs-card hcs-card-2" />
              <div className="hcs-card hcs-card-3">
                <div className="hcs-badge">Premium</div>
                <div className="hcs-icon">
                  <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M10 4 5 8l3 4 3-2v13h10V10l3 2 3-4-5-4-2 2a4 4 0 0 1-6 0L10 4Z"/>
                  </svg>
                </div>
                <div className="hcs-label">MONO Collection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Perks strip */}
        <div className="hero2-perks">
          <div className="container">
            <div className="perks-strip">
              {PERKS.map((p, i) => (
                <div key={i} className="perk-item">
                  <p.icon width={16} height={16} />
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories showcase */}
      <section className="cat-section container" id="collection">
        <div className="section-header">
          <div>
            <span className="eyebrow">Kategoriyalar</span>
            <h2 className="section-title">{activeCatName ? activeCatName : "Barcha turkumlar"}</h2>
          </div>
          {selectedCat && (
            <button className="btn btn-ghost cat-clear-btn" onClick={() => setSelectedCat(null)}>
              <IconX width={14} height={14} /> Filtrni olib tashlash
            </button>
          )}
        </div>
        <div className="cat-cards-row">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cat-card skeleton" style={{ height: 100 }}>
                <div className="sk" style={{ width: "60%", height: 12, borderRadius: 6 }} />
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                active={selectedCat === cat.id}
                onSelect={setSelectedCat}
                productCount={catCounts[cat.id] || 0}
              />
            ))
          )}
        </div>
      </section>

      {/* Products section */}
      <section className="products-section container">
        {/* Toolbar */}
        <div className="store-toolbar">
          <div className={`store-search ${searchFocused ? "focused" : ""}`}>
            <IconSearch width={16} height={16} />
            <input
              placeholder="Mahsulot, kategoriya qidirish…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery("")}>
                <IconX width={14} height={14} />
              </button>
            )}
          </div>
          <div className="store-toolbar-right">
            <div className="store-filter-group">
              <IconFilter width={14} height={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            {isAuthenticated && (
              <button className="wishlist-toolbar-btn" onClick={openWishlist}>
                <IconHeart width={16} height={16} fill={favCount > 0 ? "currentColor" : "none"} />
                {favCount > 0 && <span className="wl-count">{favCount}</span>}
              </button>
            )}
            <button className="cart-toolbar-btn" onClick={openCart}>
              <IconBag width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="results-row">
            <span className="results-count">{visible.length} ta mahsulot</span>
            {selectedCat && <span className="results-cat">— {activeCatName}</span>}
            {query && <span className="results-cat">· "{query}"</span>}
          </div>
        )}

        <ProductGrid products={visible} loading={loading} onOpen={setActive} onAdd={handleAdd} />
      </section>

      <ProductModal product={active} onClose={() => setActive(null)} onAdd={handleAdd} />
      <WishlistDrawer products={products} onAdd={handleAdd} />
    </div>
  );
}

export default CustomerPage;
