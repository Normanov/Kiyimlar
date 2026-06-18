import React, { useState, useMemo } from "react";
import {
  IconSearch, IconPlus, IconTrash, IconEye, IconEdit,
  IconFilter, IconClose, IconTag, IconBox, IconChart
} from "../Icons.jsx";
import { productImage, handleImageError, formatPrice } from "../../utils/catalog.js";

function ProductModal({ product, onClose }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal prod-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Mahsulot tafsiloti</h2>
          <button className="modal-x" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>
        <div className="prod-view-body">
          <div className="prod-view-img-wrap">
            <img
              src={productImage(product)}
              alt={product.name}
              onError={handleImageError(product)}
              className="prod-view-img"
            />
          </div>
          <div className="prod-view-info">
            <div className="prod-view-badge">
              <IconTag width={12} height={12} />
              {product.category?.name || "Kategoriyasiz"}
            </div>
            <h3 className="prod-view-name">{product.name}</h3>
            <div className="prod-view-price">{formatPrice(product.price)}</div>
            {product.description && (
              <p className="prod-view-desc">{product.description}</p>
            )}
            <div className="prod-view-meta-grid">
              <div className="prod-view-meta-item">
                <span className="pvm-k">SKU</span>
                <span className="pvm-v">MNO-{String(product.id).padStart(4, "0")}</span>
              </div>
              <div className="prod-view-meta-item">
                <span className="pvm-k">Kategoriya</span>
                <span className="pvm-v">{product.category?.name || "—"}</span>
              </div>
              <div className="prod-view-meta-item">
                <span className="pvm-k">Narx</span>
                <span className="pvm-v" style={{ color: "var(--accent-deep)", fontWeight: 700 }}>
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="prod-view-meta-item">
                <span className="pvm-k">ID</span>
                <span className="pvm-v">#{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products, categories, loading, onAddProduct, onRefresh, toast }) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewProduct, setViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  const filtered = useMemo(() => {
    let list = [...products];
    if (catFilter !== "all") list = list.filter((p) => String(p.category?.id) === catFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
    switch (sortBy) {
      case "newest":     list.sort((a, b) => b.id - a.id); break;
      case "oldest":     list.sort((a, b) => a.id - b.id); break;
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }, [products, catFilter, query, sortBy]);

  const handleDelete = async (p) => {
    if (!window.confirm(`"${p.name}" mahsulotini o'chirishni xohlaysizmi?`)) return;
    try {
      const { default: ProductApi } = await import("../../api/ProductApi.jsx");
      await ProductApi.deleteProduct(p.id);
      toast.success(`"${p.name}" o'chirildi`);
      onRefresh();
    } catch {
      toast.error("Mahsulotni o'chirib bo'lmadi");
    }
  };

  // Stats
  const avgPrice = products.length ? products.reduce((s, p) => s + Number(p.price), 0) / products.length : 0;
  const maxPrice = products.length ? Math.max(...products.map((p) => Number(p.price))) : 0;

  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-section-title">Mahsulotlar</h2>
          <p className="admin-section-sub">{products.length} ta mahsulot katalogda</p>
        </div>
        <button className="btn btn-primary" onClick={onAddProduct}>
          <IconPlus width={16} height={16} /> Yangi mahsulot
        </button>
      </div>

      {/* Mini stats */}
      <div className="prod-mini-stats">
        <div className="prod-mini-stat">
          <div className="pms-ic" style={{ background: "var(--grad)" }}><IconBox width={16} height={16} /></div>
          <div><div className="pms-n">{products.length}</div><div className="pms-l">Jami mahsulot</div></div>
        </div>
        <div className="prod-mini-stat">
          <div className="pms-ic" style={{ background: "linear-gradient(135deg,#4f9cf9,#3b82f6)" }}><IconTag width={16} height={16} /></div>
          <div><div className="pms-n">{categories.length}</div><div className="pms-l">Kategoriya</div></div>
        </div>
        <div className="prod-mini-stat">
          <div className="pms-ic" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}><IconChart width={16} height={16} /></div>
          <div><div className="pms-n">{formatPrice(avgPrice)}</div><div className="pms-l">O'rtacha narx</div></div>
        </div>
        <div className="prod-mini-stat">
          <div className="pms-ic" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}><IconChart width={16} height={16} /></div>
          <div><div className="pms-n">{formatPrice(maxPrice)}</div><div className="pms-l">Eng yuqori narx</div></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <IconSearch width={16} height={16} />
          <input
            placeholder="Mahsulot qidirish…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-group">
            <IconFilter width={14} height={14} />
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
              <option value="all">Barcha kategoriyalar</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>
          <select className="admin-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Eng yangi</option>
            <option value="oldest">Eng eski</option>
            <option value="price-asc">Narx ↑</option>
            <option value="price-desc">Narx ↓</option>
            <option value="name">Nomi bo'yicha</option>
          </select>
          <div className="view-toggle">
            <button className={`vt-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")} title="Jadval ko'rinishi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/>
              </svg>
            </button>
            <button className={`vt-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Karta ko'rinishi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="prod-cards-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="prod-card skeleton-prod">
                <div className="sk" style={{ height: 180, borderRadius: "var(--radius-sm)" }} />
                <div style={{ padding: 14 }}>
                  <div className="sk" style={{ height: 14, width: "70%", borderRadius: 6, marginBottom: 8 }} />
                  <div className="sk" style={{ height: 12, width: "40%", borderRadius: 6 }} />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="admin-empty"><p>Mahsulot topilmadi</p></div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="prod-card">
                <div className="prod-card-img">
                  <img src={productImage(p)} alt={p.name} onError={handleImageError(p)} />
                  <div className="prod-card-actions-overlay">
                    <button className="prod-card-action-btn" title="Ko'rish" onClick={() => setViewProduct(p)}>
                      <IconEye width={16} height={16} />
                    </button>
                    <button className="prod-card-action-btn danger" title="O'chirish" onClick={() => handleDelete(p)}>
                      <IconTrash width={16} height={16} />
                    </button>
                  </div>
                </div>
                <div className="prod-card-body">
                  <span className="t-cat" style={{ marginBottom: 6, display: "inline-block" }}>{p.category?.name}</span>
                  <h4 className="prod-card-name">{p.name}</h4>
                  <div className="prod-card-footer">
                    <span className="prod-card-price">{formatPrice(p.price)}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>MNO-{String(p.id).padStart(4, "0")}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <div className="panel-v2">
          {/* Mobile card list */}
          <div className="mobile-card-list">
            {loading ? (
              <div className="admin-list-loader">Yuklanmoqda…</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty" style={{ margin: 16 }}><p>Mahsulot topilmadi</p></div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="mobile-list-card">
                  <div className="mlc-img">
                    <img src={productImage(p)} alt={p.name} onError={handleImageError(p)} />
                  </div>
                  <div className="mlc-body">
                    <span className="t-cat">{p.category?.name}</span>
                    <div className="mlc-name">{p.name}</div>
                    <div className="mlc-meta">{formatPrice(p.price)} · MNO-{String(p.id).padStart(4, "0")}</div>
                  </div>
                  <div className="mlc-actions">
                    <button className="admin-action-btn view" onClick={() => setViewProduct(p)}><IconEye width={15} height={15} /></button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(p)}><IconTrash width={15} height={15} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="table-wrap desktop-only">
            <table className="table admin-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Mahsulot</th>
                  <th>Kategoriya</th>
                  <th>Narx</th>
                  <th>SKU</th>
                  <th style={{ width: 100 }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="table-empty-row">Yuklanmoqda…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="table-empty-row">Mahsulot topilmadi</td></tr>
                ) : (
                  filtered.map((p, idx) => (
                    <tr key={p.id} className="admin-table-row">
                      <td className="td-num">{idx + 1}</td>
                      <td>
                        <div className="td-product">
                          <div className="t-thumb"><img src={productImage(p)} alt={p.name} onError={handleImageError(p)} /></div>
                          <div>
                            <span className="t-name">{p.name}</span>
                            <span className="t-desc-mini">{p.description?.slice(0, 55)}{p.description?.length > 55 ? "…" : ""}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="t-cat">{p.category?.name}</span></td>
                      <td className="t-price-col">{formatPrice(p.price)}</td>
                      <td className="td-sku">MNO-{String(p.id).padStart(4, "0")}</td>
                      <td>
                        <div className="admin-actions-cell">
                          <button className="admin-action-btn view" title="Ko'rish" onClick={() => setViewProduct(p)}>
                            <IconEye width={15} height={15} />
                          </button>
                          <button className="admin-action-btn delete" title="O'chirish" onClick={() => handleDelete(p)}>
                            <IconTrash width={15} height={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="table-footer">{filtered.length} ta mahsulot</div>
          )}
        </div>
      )}

      {viewProduct && <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} />}
    </div>
  );
}

export default AdminProducts;
