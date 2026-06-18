import React, { useState, useMemo } from "react";
import { IconPlus, IconTrash, IconSearch, IconBox, IconEdit, IconClose, IconCheckCircle } from "../Icons.jsx";

function EditCategoryModal({ category, onClose, onSave }) {
  const [name, setName] = useState(category?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave(name.trim());
    setSaving(false);
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{category ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</h2>
          <button className="modal-x" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>
        <div className="modal-body" style={{ padding: 24 }}>
          <div className="field">
            <label>Kategoriya nomi</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Ko'ylaklar, Shimlar…"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || saving} style={{ flex: 1 }}>
              {saving ? "Saqlanmoqda…" : <><IconCheckCircle width={15} height={15} /> Saqlash</>}
            </button>
            <button className="btn btn-ghost" onClick={onClose}>Bekor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCategories({ categories, products, loading, onAddCategory, onRefresh, toast }) {
  const [query, setQuery] = useState("");
  const [editingCat, setEditingCat] = useState(null); // null = closed, {} = new, {id,name} = edit

  const productCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const catId = p.category?.id;
      if (catId) counts[catId] = (counts[catId] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const handleDelete = async (c) => {
    const count = productCounts[c.id] || 0;
    if (count > 0) {
      toast.error(`"${c.name}" da ${count} ta mahsulot bor, avval ularni o'chiring`);
      return;
    }
    if (!window.confirm(`"${c.name}" kategoriyasini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      const { default: CategoryApi } = await import("../../api/CategoryApi.jsx");
      await CategoryApi.deleteCategory(c.id);
      toast.success(`"${c.name}" o'chirildi`);
      onRefresh();
    } catch {
      toast.error("Kategoriyani o'chirib bo'lmadi");
    }
  };

  const COLORS = [
    "linear-gradient(135deg,#6d5efc,#4f9cf9)",
    "linear-gradient(135deg,#10b981,#059669)",
    "linear-gradient(135deg,#f59e0b,#d97706)",
    "linear-gradient(135deg,#e5484d,#dc2626)",
    "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    "linear-gradient(135deg,#06b6d4,#0891b2)",
  ];

  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-section-title">Kategoriyalar</h2>
          <p className="admin-section-sub">{categories.length} ta kategoriya · {products.length} ta mahsulot</p>
        </div>
        <button className="btn btn-primary" onClick={onAddCategory}>
          <IconPlus width={16} height={16} /> Yangi kategoriya
        </button>
      </div>

      {/* Search */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <IconSearch width={16} height={16} />
          <input
            placeholder="Kategoriya qidirish…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Summary bar */}
      <div className="cat-summary-bar">
        <div className="cat-summary-item">
          <span className="cat-si-n">{categories.length}</span>
          <span className="cat-si-l">Jami kategoriya</span>
        </div>
        <div className="cat-summary-item">
          <span className="cat-si-n">{products.length}</span>
          <span className="cat-si-l">Jami mahsulot</span>
        </div>
        <div className="cat-summary-item">
          <span className="cat-si-n">
            {categories.length ? Math.round(products.length / categories.length) : 0}
          </span>
          <span className="cat-si-l">O'rtacha mahsulot</span>
        </div>
        <div className="cat-summary-item">
          <span className="cat-si-n">
            {categories.length ? Math.max(...categories.map((c) => productCounts[c.id] || 0)) : 0}
          </span>
          <span className="cat-si-l">Eng ko'p mahsulot</span>
        </div>
      </div>

      {/* Cards */}
      <div className="category-cards-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="category-card">
              <div className="sk" style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)" }} />
              <div className="category-card-info">
                <div className="sk" style={{ width: "60%", height: 14, borderRadius: 6, marginBottom: 8 }} />
                <div className="sk" style={{ width: "35%", height: 12, borderRadius: 6 }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <IconBox width={32} height={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>Kategoriya topilmadi</p>
          </div>
        ) : (
          filtered.map((c, i) => {
            const count = productCounts[c.id] || 0;
            const pct = products.length ? Math.round((count / products.length) * 100) : 0;
            const colorStyle = COLORS[i % COLORS.length];
            return (
              <div key={c.id} className="category-card enhanced">
                <div className="category-card-icon" style={{ background: colorStyle, color: "#fff" }}>
                  <IconBox width={20} height={20} />
                </div>
                <div className="category-card-info">
                  <h4 className="category-card-name">{c.name}</h4>
                  <span className="category-card-count">{count} ta mahsulot</span>
                  <div className="cat-progress-bar">
                    <div className="cat-progress-fill" style={{ width: `${pct}%`, background: colorStyle }} />
                  </div>
                  <span className="cat-pct">{pct}% mahsulot</span>
                </div>
                <div className="category-card-actions">
                  <span className="category-card-id">#{String(c.id).padStart(3, "0")}</span>
                  <div className="cat-action-btns">
                    <button
                      className="admin-action-btn delete"
                      title="O'chirish"
                      onClick={() => handleDelete(c)}
                    >
                      <IconTrash width={14} height={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingCat !== null && (
        <EditCategoryModal
          category={editingCat.id ? editingCat : null}
          onClose={() => setEditingCat(null)}
          onSave={(name) => {
            toast.show(`"${name}" kategoriyasi yangilandi`);
            setEditingCat(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export default AdminCategories;
