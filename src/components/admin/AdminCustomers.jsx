import React, { useState, useMemo, useCallback } from "react";
import {
  IconSearch, IconFilter, IconUsers, IconUser, IconMail, IconPhone,
  IconCalendar, IconShield, IconEdit, IconEye, IconClose, IconCheckCircle,
  IconPlus, IconClipboard, IconChart
} from "../Icons.jsx";
import { initials, formatPrice } from "../../utils/catalog.js";

const STATUSES = [
  { id: "new",      label: "Yangi",  color: "#3b82f6" },
  { id: "active",   label: "Aktiv",  color: "#10b981" },
  { id: "vip",      label: "VIP",    color: "#f59e0b" },
  { id: "inactive", label: "Nofaol", color: "#94a3b8" },
];

// Deterministic profile enrichment (no API needed)
const PHONE_PREFIXES = ["+998 90", "+998 91", "+998 93", "+998 94", "+998 97", "+998 99"];
const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon", "Farg'ona", "Qarshi", "Nukus"];
const ORDERS_HISTORY = [
  [{ name: "Ko'k ko'ylak", total: 189000 }, { name: "Qora jeans", total: 245000 }],
  [{ name: "Yozgi ko'ylak", total: 310000 }],
  [{ name: "Sport kurtka", total: 380000 }, { name: "Futbolka (3ta)", total: 255000 }],
  [{ name: "Klassik ko'ylak", total: 285000 }, { name: "Kamar", total: 65000 }],
  [{ name: "Qishki kurtka", total: 650000 }],
  [{ name: "Polo ko'ylak (2ta)", total: 390000 }, { name: "Chino shim", total: 330000 }],
  [{ name: "Hoodie", total: 345000 }, { name: "Jogger shim", total: 195000 }],
];

function hashInt(n) {
  let h = n ^ (n >>> 16);
  h = Math.imul(h, 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h);
}

function enrichUser(u) {
  const h = hashInt(u.id);
  const ph = PHONE_PREFIXES[h % PHONE_PREFIXES.length];
  const num = String(1000000 + (h % 9000000)).slice(0, 7).replace(/(\d{3})(\d{2})(\d{2})/, "$1-$2-$3");
  const city = CITIES[h % CITIES.length];
  const joinYear = 2023 + (h % 3);
  const joinMonth = (h % 12) + 1;
  const joinDay = (h % 28) + 1;
  const ordersCount = 1 + (h % 15);
  const totalSpent = (h % 30 + 1) * 150000 + (h % 50000);
  const history = ORDERS_HISTORY[h % ORDERS_HISTORY.length];
  return {
    phone: `${ph} ${num}`,
    email: `${u.username?.toLowerCase().replace(/\s+/, ".")}@mail.uz`,
    city,
    joinDate: `${joinYear}-${String(joinMonth).padStart(2, "0")}-${String(joinDay).padStart(2, "0")}`,
    ordersCount,
    totalSpent,
    history,
  };
}

function getStoredStatuses() {
  try { return JSON.parse(localStorage.getItem("crm_statuses") || "{}"); } catch { return {}; }
}
function saveStoredStatuses(data) { localStorage.setItem("crm_statuses", JSON.stringify(data)); }
function getStoredNotes() {
  try { return JSON.parse(localStorage.getItem("crm_notes") || "{}"); } catch { return {}; }
}
function saveStoredNotes(data) { localStorage.setItem("crm_notes", JSON.stringify(data)); }

function StatusBadge({ status }) {
  const s = STATUSES.find((st) => st.id === status) || STATUSES[0];
  return (
    <span className="crm-status-badge" style={{ "--badge-color": s.color }}>
      <span className="crm-status-dot" />
      {s.label}
    </span>
  );
}

function CustomerModal({ customer, extra, onClose, onStatusChange, onNoteChange }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingStatus, setEditingStatus] = useState(false);
  const [noteText, setNoteText] = useState("");
  const statuses = getStoredStatuses();
  const notes = getStoredNotes();
  const customerNotes = notes[customer.id] || [];
  const currentStatus = statuses[customer.id] || "new";

  const addNote = () => {
    if (!noteText.trim()) return;
    const allNotes = getStoredNotes();
    const list = allNotes[customer.id] || [];
    list.push({ text: noteText.trim(), date: new Date().toISOString() });
    allNotes[customer.id] = list;
    saveStoredNotes(allNotes);
    setNoteText("");
    onNoteChange?.();
  };

  const deleteNote = (i) => {
    const allNotes = getStoredNotes();
    const list = allNotes[customer.id] || [];
    list.splice(i, 1);
    allNotes[customer.id] = list;
    saveStoredNotes(allNotes);
    onNoteChange?.();
  };

  const TABS = [
    { id: "overview", label: "Umumiy" },
    { id: "orders",   label: `Buyurtmalar (${extra.ordersCount})` },
    { id: "notes",    label: `Qaydlar (${customerNotes.length})` },
  ];

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal crm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Mijoz kartochkasi</h2>
          <button className="modal-x" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>
        <div className="modal-body">
          {/* Header */}
          <div className="crm-modal-header">
            <span className="avatar crm-avatar-lg">{initials(customer.username)}</span>
            <div className="crm-modal-info">
              <h3 className="crm-modal-name">{customer.username}</h3>
              <div className="crm-modal-meta">
                <span className={`role-pill ${customer.role === "admin" ? "admin" : ""}`}>{customer.role}</span>
                <StatusBadge status={currentStatus} />
                <span className="crm-modal-id">ID: #{String(customer.id).padStart(3, "0")}</span>
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}>{formatPrice(extra.totalSpent)}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>jami sarflagan</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="crm-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`crm-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <>
              {/* Status */}
              <div className="crm-detail-section">
                <div className="crm-detail-label"><IconShield width={14} height={14} /> Holat boshqaruvi</div>
                {editingStatus ? (
                  <div className="crm-status-options">
                    {STATUSES.map((s) => (
                      <button
                        key={s.id}
                        className={`crm-status-option ${currentStatus === s.id ? "active" : ""}`}
                        style={{ "--opt-color": s.color }}
                        onClick={() => { onStatusChange(customer.id, s.id); setEditingStatus(false); }}
                      >
                        <span className="crm-status-dot" />
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <StatusBadge status={currentStatus} />
                    <button className="btn-link" onClick={() => setEditingStatus(true)}>
                      <IconEdit width={13} height={13} /> O'zgartirish
                    </button>
                  </div>
                )}
              </div>

              {/* Info grid */}
              <div className="crm-info-grid">
                <div className="crm-info-item">
                  <IconUser width={15} height={15} />
                  <div><div className="crm-info-k">To'liq ism</div><div className="crm-info-v">{customer.username}</div></div>
                </div>
                <div className="crm-info-item">
                  <IconMail width={15} height={15} />
                  <div><div className="crm-info-k">E-mail</div><div className="crm-info-v">{extra.email}</div></div>
                </div>
                <div className="crm-info-item">
                  <IconPhone width={15} height={15} />
                  <div><div className="crm-info-k">Telefon</div><div className="crm-info-v">{extra.phone}</div></div>
                </div>
                <div className="crm-info-item">
                  <span>📍</span>
                  <div><div className="crm-info-k">Shahar</div><div className="crm-info-v">{extra.city}</div></div>
                </div>
                <div className="crm-info-item">
                  <IconCalendar width={15} height={15} />
                  <div>
                    <div className="crm-info-k">Ro'yxatdan o'tgan</div>
                    <div className="crm-info-v">{new Date(extra.joinDate).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}</div>
                  </div>
                </div>
                <div className="crm-info-item">
                  <IconClipboard width={15} height={15} />
                  <div><div className="crm-info-k">Buyurtmalar soni</div><div className="crm-info-v">{extra.ordersCount} ta</div></div>
                </div>
              </div>

              {/* Spending summary */}
              <div className="crm-spending-row">
                <div className="crm-spending-card">
                  <div className="crm-spending-n">{extra.ordersCount}</div>
                  <div className="crm-spending-l">Buyurtmalar</div>
                </div>
                <div className="crm-spending-card highlight">
                  <div className="crm-spending-n">{formatPrice(extra.totalSpent)}</div>
                  <div className="crm-spending-l">Jami sarflagan</div>
                </div>
                <div className="crm-spending-card">
                  <div className="crm-spending-n">{formatPrice(Math.round(extra.totalSpent / extra.ordersCount))}</div>
                  <div className="crm-spending-l">O'rtacha buyurtma</div>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="crm-orders-list">
              {extra.history.map((item, i) => (
                <div key={i} className="crm-order-row">
                  <div className="crm-order-icon">
                    <IconClipboard width={14} height={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      #{5000 + customer.id % 100 + i} · {new Date(new Date(extra.joinDate).getTime() + i * 7 * 86400000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)" }}>{formatPrice(item.total)}</div>
                    <span className="crm-status-badge" style={{ "--badge-color": "#10b981", fontSize: 10, marginTop: 4, display: "inline-flex" }}>
                      <span className="crm-status-dot" /> Yetkazildi
                    </span>
                  </div>
                </div>
              ))}
              <div className="crm-orders-total">
                <span>Hammasi jami:</span>
                <span style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{formatPrice(extra.totalSpent)}</span>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="crm-detail-section">
              <div className="crm-notes-list">
                {customerNotes.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: 13, padding: "8px 0" }}>Hali qayd yo'q</p>
                ) : (
                  customerNotes.map((n, i) => (
                    <div key={i} className="crm-note">
                      <p style={{ flex: 1 }}>{n.text}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span className="crm-note-date">
                          {new Date(n.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <button style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }} onClick={() => deleteNote(i)}>
                          <IconClose width={12} height={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="crm-note-input">
                <input
                  className="input"
                  placeholder="Yangi qayd yozing… (Enter bosing)"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                />
                <button className="btn btn-primary" onClick={addNote} disabled={!noteText.trim()}>
                  Qo'shish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminCustomers({ users, loading, onAddFakeUser }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [, forceUpdate] = useState(0);

  const statuses = getStoredStatuses();

  const enriched = useMemo(() => users.map((u) => ({ ...u, extra: enrichUser(u) })), [users]);

  const handleStatusChange = useCallback((userId, status) => {
    const s = getStoredStatuses();
    s[userId] = status;
    saveStoredStatuses(s);
    forceUpdate((n) => n + 1);
  }, []);

  const filtered = useMemo(() => {
    let list = [...enriched];
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") list = list.filter((u) => (statuses[u.id] || "new") === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((u) =>
      u.username.toLowerCase().includes(q) ||
      u.extra.email.toLowerCase().includes(q) ||
      u.extra.phone.includes(q) ||
      u.extra.city.toLowerCase().includes(q)
    );
    return list;
  }, [enriched, roleFilter, statusFilter, query, statuses]);

  const statusCounts = useMemo(() => {
    const counts = { new: 0, active: 0, vip: 0, inactive: 0 };
    users.forEach((u) => { const s = statuses[u.id] || "new"; counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [users, statuses]);

  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const totalRevenue = useMemo(() => enriched.reduce((s, u) => s + u.extra.totalSpent, 0), [enriched]);

  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-section-title">Mijozlar CRM</h2>
          <p className="admin-section-sub">Barcha mijozlarni boshqarish, kuzatish va tahlil qilish</p>
        </div>
        <button className="btn btn-primary" onClick={onAddFakeUser}>
          <IconPlus width={16} height={16} /> Yangi mijoz
        </button>
      </div>

      {/* Stats */}
      <div className="crm-stat-row">
        <div className="crm-stat-card">
          <div className="crm-stat-ic all"><IconUsers width={18} height={18} /></div>
          <div className="crm-stat-n">{users.length}</div>
          <div className="crm-stat-l">Jami mijozlar</div>
        </div>
        {STATUSES.map((s) => (
          <div
            key={s.id}
            className={`crm-stat-card ${statusFilter === s.id ? "active" : ""}`}
            onClick={() => setStatusFilter(statusFilter === s.id ? "all" : s.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="crm-stat-ic" style={{ background: s.color + "22", color: s.color }}>
              <IconUser width={18} height={18} />
            </div>
            <div className="crm-stat-n">{statusCounts[s.id] || 0}</div>
            <div className="crm-stat-l">{s.label}</div>
          </div>
        ))}
        <div className="crm-stat-card" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-line)" }}>
          <div className="crm-stat-ic" style={{ background: "var(--grad)", color: "#fff" }}>
            <IconChart width={18} height={18} />
          </div>
          <div className="crm-stat-n" style={{ fontSize: 20, color: "var(--accent-deep)" }}>{formatPrice(totalRevenue)}</div>
          <div className="crm-stat-l">Jami daromad</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <IconSearch width={16} height={16} />
          <input
            placeholder="Ism, email, telefon, shahar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-group">
            <IconFilter width={14} height={14} />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">Barcha rollar</option>
              <option value="admin">Admin ({adminCount})</option>
              <option value="customer">Mijoz ({users.length - adminCount})</option>
            </select>
          </div>
          <div className="admin-filter-group">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Barcha holatlar</option>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label} ({statusCounts[s.id] || 0})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="panel-v2">
        {/* Mobile cards */}
        <div className="mobile-card-list">
          {loading ? (
            <div className="admin-list-loader">Yuklanmoqda…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Mijoz topilmadi</div>
          ) : filtered.map((u) => (
            <div key={u.id} className="mobile-list-card">
              <span className="avatar" style={{ width: 40, height: 40, fontSize: 15, flexShrink: 0 }}>{initials(u.username)}</span>
              <div className="mlc-body">
                <div className="mlc-name">{u.username}</div>
                <div className="mlc-meta">{u.extra.phone} · {u.extra.city}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                  <StatusBadge status={statuses[u.id] || "new"} />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{u.extra.ordersCount} ta buyurtma</span>
                </div>
              </div>
              <div className="mlc-actions">
                <button className="admin-action-btn view" onClick={() => setSelectedCustomer(u)}><IconEye width={15} height={15} /></button>
                <button className="admin-action-btn edit" onClick={() => {
                  const current = statuses[u.id] || "new";
                  const i = STATUSES.findIndex((s) => s.id === current);
                  handleStatusChange(u.id, STATUSES[(i + 1) % STATUSES.length].id);
                }}><IconEdit width={15} height={15} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="table-wrap desktop-only">
          <table className="table admin-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Foydalanuvchi</th>
                <th>Telefon</th>
                <th>Shahar</th>
                <th>Buyurtmalar</th>
                <th>Sarflagan</th>
                <th>Holat</th>
                <th style={{ width: 100 }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ color: "var(--muted)", textAlign: "center", padding: 48 }}>Yuklanmoqda…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ color: "var(--muted)", textAlign: "center", padding: 48 }}>Mijoz topilmadi</td></tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u.id} className="admin-table-row">
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="avatar">{initials(u.username)}</span>
                        <div>
                          <span className="t-name">{u.username}</span>
                          <span className="t-desc-mini">{u.extra.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--ink-soft)" }}>{u.extra.phone}</td>
                    <td style={{ fontSize: 13, color: "var(--ink-soft)" }}>{u.extra.city}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{u.extra.ordersCount}</span>
                      <span className="t-desc-mini">buyurtma</span>
                    </td>
                    <td className="t-price-col" style={{ fontSize: 13 }}>{formatPrice(u.extra.totalSpent)}</td>
                    <td><StatusBadge status={statuses[u.id] || "new"} /></td>
                    <td>
                      <div className="admin-actions-cell">
                        <button
                          className="admin-action-btn view"
                          title="Ko'rish"
                          onClick={() => setSelectedCustomer(u)}
                        >
                          <IconEye width={15} height={15} />
                        </button>
                        <button
                          className="admin-action-btn edit"
                          title="Holat o'zgartirish"
                          onClick={() => {
                            const current = statuses[u.id] || "new";
                            const i = STATUSES.findIndex((s) => s.id === current);
                            const next = STATUSES[(i + 1) % STATUSES.length];
                            handleStatusChange(u.id, next.id);
                          }}
                        >
                          <IconEdit width={15} height={15} />
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
          <div className="table-footer">
            {filtered.length} ta mijoz · Jami: {formatPrice(filtered.reduce((s, u) => s + u.extra.totalSpent, 0))}
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          extra={selectedCustomer.extra}
          onClose={() => setSelectedCustomer(null)}
          onStatusChange={(id, s) => { handleStatusChange(id, s); }}
          onNoteChange={() => forceUpdate((n) => n + 1)}
        />
      )}
    </div>
  );
}

export default AdminCustomers;
