import React, { useMemo } from "react";
import {
  IconBox, IconTag, IconUsers, IconChart, IconTrendUp, IconTrendDown,
  IconClipboard, IconPlus, IconCheckCircle, IconClock, IconAlert, IconClose
} from "../Icons.jsx";
import { productImage, handleImageError, formatPrice, initials } from "../../utils/catalog.js";

const MONTHLY_DATA = [
  { month: "Yan", revenue: 3240000, orders: 18, customers: 14 },
  { month: "Fev", revenue: 4150000, orders: 24, customers: 19 },
  { month: "Mar", revenue: 5870000, orders: 31, customers: 26 },
  { month: "Apr", revenue: 4930000, orders: 27, customers: 22 },
  { month: "May", revenue: 7120000, orders: 42, customers: 35 },
  { month: "Iyn", revenue: 8640000, orders: 51, customers: 44 },
];

const ORDER_STATUSES = [
  { key: "completed",  label: "Yetkazildi",  value: 14, color: "#10b981" },
  { key: "processing", label: "Jarayonda",   value:  7, color: "#3b82f6" },
  { key: "pending",    label: "Kutilmoqda",  value:  3, color: "#f59e0b" },
  { key: "cancelled",  label: "Bekor",       value:  1, color: "#e5484d" },
];

const RECENT_ORDERS = [
  { id: 5025, customer: "Maftuna Sobirov",  total: 560000, status: "pending",    date: "2026-06-15T14:30:00Z" },
  { id: 5024, customer: "Rustam Yoqubov",   total: 840000, status: "completed",  date: "2026-06-15T12:15:00Z" },
  { id: 5023, customer: "Kamola Mansurova", total: 510000, status: "processing", date: "2026-06-15T09:00:00Z" },
  { id: 5017, customer: "Bahrom Qosimov",   total: 475000, status: "pending",    date: "2026-06-14T11:45:00Z" },
  { id: 5015, customer: "Akbar Hamidov",    total: 720000, status: "processing", date: "2026-06-14T13:20:00Z" },
];

const STATUS_CFG = {
  pending:    { color: "#f59e0b", label: "Kutilmoqda" },
  processing: { color: "#3b82f6", label: "Jarayonda"  },
  completed:  { color: "#10b981", label: "Yetkazildi" },
  cancelled:  { color: "#e5484d", label: "Bekor"      },
};

function TrendBadge({ value }) {
  const pos = value >= 0;
  return (
    <span className={`stat-trend ${pos ? "up" : "down"}`}>
      {pos ? <IconTrendUp width={11} height={11} /> : <IconTrendDown width={11} height={11} />}
      {Math.abs(value)}%
    </span>
  );
}

function KpiCard({ icon: Icon, value, label, trend, sub, color, big }) {
  return (
    <div className={`kpi-card ${big ? "kpi-big" : ""}`}>
      <div className="kpi-top">
        <div className="kpi-ic" style={{ background: color || "var(--grad)" }}>
          <Icon width={18} height={18} />
        </div>
        {trend != null && <TrendBadge value={trend} />}
      </div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

function RevenueChart({ data }) {
  const maxRev = Math.max(...data.map((d) => d.revenue));
  const H = 110, BW = 30, GAP = 14;
  const W = data.length * (BW + GAP) - GAP;
  return (
    <svg width="100%" viewBox={`0 0 ${W + 16} ${H + 36}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d5efc" />
          <stop offset="100%" stopColor="#4f9cf9" />
        </linearGradient>
        <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d5efc" stopOpacity=".35" />
          <stop offset="100%" stopColor="#4f9cf9" stopOpacity=".15" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const bh = Math.max(6, Math.round((d.revenue / maxRev) * H));
        const x = i * (BW + GAP) + 8;
        const y = H - bh;
        const isLast = i === data.length - 1;
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={BW} height={bh} rx={5} fill={isLast ? "url(#rg)" : "url(#rg2)"} />
            {isLast && (
              <>
                <rect x={x} y={y - 26} width={BW} height={20} rx={4} fill="#6d5efc" />
                <text x={x + BW / 2} y={y - 13} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
                  {(d.revenue / 1000000).toFixed(1)}M
                </text>
              </>
            )}
            <text x={x + BW / 2} y={H + 15} textAnchor="middle" fill="var(--muted)" fontSize="10" fontWeight="500">
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function OrdersLineChart({ data }) {
  const maxO = Math.max(...data.map((d) => d.orders));
  const W = 260, H = 70, PAD = 12;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.orders / maxO) * (H - PAD * 2));
    return [x, y];
  });
  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity=".3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lg)" />
      <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function StatusBar({ statuses }) {
  const total = statuses.reduce((s, x) => s + x.value, 0);
  return (
    <div className="ov-status-bar-wrap">
      <div className="ov-status-bar">
        {statuses.map((s) => (
          <div key={s.key} className="ov-status-seg" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.value}`} />
        ))}
      </div>
      <div className="ov-status-legend">
        {statuses.map((s) => (
          <div key={s.key} className="ov-sl-item">
            <span className="ov-sl-dot" style={{ background: s.color }} />
            <span className="ov-sl-label">{s.label}</span>
            <span className="ov-sl-val">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminOverview({ products, categories, users, loading, onAction }) {
  const avgPrice = useMemo(() =>
    products.length ? products.reduce((s, p) => s + Number(p.price), 0) / products.length : 0,
    [products]
  );
  const maxPrice = useMemo(() =>
    products.length ? Math.max(...products.map((p) => Number(p.price))) : 0,
    [products]
  );
  const recent = useMemo(() => [...products].sort((a, b) => b.id - a.id).slice(0, 5), [products]);
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const customerCount = users.length - adminCount;

  const curRevenue = MONTHLY_DATA[MONTHLY_DATA.length - 1].revenue;
  const prevRevenue = MONTHLY_DATA[MONTHLY_DATA.length - 2].revenue;
  const revTrend = Math.round(((curRevenue - prevRevenue) / prevRevenue) * 100);

  const curOrders = MONTHLY_DATA[MONTHLY_DATA.length - 1].orders;
  const prevOrders = MONTHLY_DATA[MONTHLY_DATA.length - 2].orders;
  const orderTrend = Math.round(((curOrders - prevOrders) / prevOrders) * 100);

  const totalOrders = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0);
  const avgOrderVal = Math.round(curRevenue / curOrders);
  const completedPct = Math.round((ORDER_STATUSES.find(s => s.key === "completed").value / ORDER_STATUSES.reduce((s, x) => s + x.value, 0)) * 100);

  return (
    <div className="admin-overview">
      {/* Welcome */}
      <div className="admin-welcome">
        <div>
          <h1 className="admin-welcome-title">Dashboard</h1>
          <p className="admin-welcome-sub">
            {new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="admin-welcome-actions">
          <button className="btn btn-ghost" onClick={() => onAction("addCategory")}>
            <IconTag width={15} height={15} /> Kategoriya
          </button>
          <button className="btn btn-primary" onClick={() => onAction("addProduct")}>
            <IconPlus width={15} height={15} /> Yangi mahsulot
          </button>
        </div>
      </div>

      {/* KPI row 1 */}
      <div className="kpi-grid">
        <KpiCard
          icon={IconChart}
          value={`${(curRevenue / 1000000).toFixed(1)}M so'm`}
          label="Bu oylik daromad"
          trend={revTrend}
          sub="O'tgan oyga nisbatan"
          color="var(--grad)"
          big
        />
        <KpiCard
          icon={IconClipboard}
          value={curOrders}
          label="Bu oygi buyurtmalar"
          trend={orderTrend}
          sub={`Jami ${totalOrders} ta buyurtma`}
          color="linear-gradient(135deg,#4f9cf9,#3b82f6)"
        />
        <KpiCard
          icon={IconUsers}
          value={loading ? "—" : users.length}
          label="Mijozlar soni"
          trend={8}
          sub={`${adminCount} admin · ${customerCount} xaridor`}
          color="linear-gradient(135deg,#10b981,#059669)"
        />
        <KpiCard
          icon={IconBox}
          value={loading ? "—" : products.length}
          label="Katalog mahsulotlar"
          trend={12}
          sub={`${categories.length} kategoriya`}
          color="linear-gradient(135deg,#f59e0b,#d97706)"
        />
        <KpiCard
          icon={IconCheckCircle}
          value={`${completedPct}%`}
          label="Muvaffaqiyat darajasi"
          sub="Yetkazilgan buyurtmalar"
          color="linear-gradient(135deg,#8b5cf6,#6d28d9)"
        />
        <KpiCard
          icon={IconTag}
          value={formatPrice(avgOrderVal)}
          label="O'rtacha buyurtma"
          sub={`Maks: ${formatPrice(maxPrice)}`}
          color="linear-gradient(135deg,#06b6d4,#0891b2)"
        />
      </div>

      {/* Charts row */}
      <div className="admin-panels-row">
        {/* Revenue chart */}
        <div className="panel-v2" style={{ flex: 2 }}>
          <div className="panel-v2-head">
            <div>
              <h3>Oylik daromad</h3>
              <p className="panel-sub">Oxirgi 6 oy dinamikasi</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="panel-big-val">{(curRevenue / 1000000).toFixed(1)}M so'm</div>
              <TrendBadge value={revTrend} />
            </div>
          </div>
          <div className="panel-chart-wrap">
            <RevenueChart data={MONTHLY_DATA} />
          </div>
          <div className="ov-month-row">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="ov-month-cell">
                <div className="ov-mc-val">{d.orders}</div>
                <div className="ov-mc-label">buyurtma</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order status + customers mini */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>
          {/* Order status */}
          <div className="panel-v2">
            <div className="panel-v2-head">
              <h3>Buyurtma holatlari</h3>
              <button className="btn-link" onClick={() => onAction("viewOrders")}>Ko'rish →</button>
            </div>
            <div style={{ padding: "0 20px 20px" }}>
              <StatusBar statuses={ORDER_STATUSES} />
            </div>
          </div>

          {/* Orders line mini */}
          <div className="panel-v2" style={{ flex: 1 }}>
            <div className="panel-v2-head">
              <div>
                <h3>Buyurtma o'sishi</h3>
                <p className="panel-sub">Oxirgi 6 oy</p>
              </div>
              <span className="stat-trend up" style={{ fontSize: 11 }}>
                <IconTrendUp width={11} height={11} /> {orderTrend}%
              </span>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <OrdersLineChart data={MONTHLY_DATA} />
            </div>
          </div>
        </div>
      </div>

      {/* Category stats */}
      <div className="panel-v2">
        <div className="panel-v2-head">
          <h3>Kategoriya statistikasi</h3>
          <button className="btn-link" onClick={() => onAction("viewCategories")}>Ko'rish →</button>
        </div>
        <div className="ov-cat-stats">
          {loading ? (
            <div style={{ padding: 20, color: "var(--muted)" }}>Yuklanmoqda…</div>
          ) : categories.length === 0 ? (
            <div style={{ padding: 20, color: "var(--muted)" }}>Kategoriya topilmadi</div>
          ) : (() => {
              const counts = {};
              products.forEach((p) => { const id = p.category?.id; if (id) counts[id] = (counts[id] || 0) + 1; });
              const maxC = Math.max(...categories.map((c) => counts[c.id] || 0), 1);
              const COLORS = ["#6d5efc","#4f9cf9","#10b981","#f59e0b","#8b5cf6","#06b6d4","#e5484d","#ec4899"];
              return categories.map((c, i) => {
                const cnt = counts[c.id] || 0;
                const pct = Math.round((cnt / maxC) * 100);
                return (
                  <div key={c.id} className="ov-cat-row">
                    <div className="ov-cat-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <div className="ov-cat-name">{c.name}</div>
                    <div className="ov-cat-bar-wrap">
                      <div className="ov-cat-bar-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                    <div className="ov-cat-count">{cnt} ta</div>
                  </div>
                );
              });
            })()
          }
        </div>
      </div>

      {/* Bottom row: recent orders + top products + recent users */}
      <div className="admin-panels-row">
        {/* Recent orders */}
        <div className="panel-v2" style={{ flex: 2 }}>
          <div className="panel-v2-head">
            <h3>So'nggi buyurtmalar</h3>
            <button className="btn-link" onClick={() => onAction("viewOrders")}>Barchasini ko'rish →</button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Buyurtma</th>
                  <th>Mijoz</th>
                  <th>Holat</th>
                  <th>Summa</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => {
                  const s = STATUS_CFG[o.status];
                  return (
                    <tr key={o.id} className="admin-table-row">
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "var(--font-display)" }}>#{o.id}</span>
                        <span className="t-desc-mini">{new Date(o.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{o.customer.charAt(0)}</span>
                          <span className="t-name">{o.customer}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: s.color, background: s.color + "18", padding: "3px 9px", borderRadius: 999, border: `1px solid ${s.color}30` }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                          {s.label}
                        </span>
                      </td>
                      <td className="t-price">{formatPrice(o.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent products + recent users */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>
          {/* Top products */}
          <div className="panel-v2">
            <div className="panel-v2-head">
              <h3>Yangi mahsulotlar</h3>
              <button className="btn-link" onClick={() => onAction("viewProducts")}>Ko'rish →</button>
            </div>
            <div className="admin-users-mini">
              {loading ? (
                <div style={{ color: "var(--muted)", padding: 16 }}>Yuklanmoqda…</div>
              ) : recent.map((p) => (
                <div className="admin-user-row" key={p.id}>
                  <div className="t-thumb" style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 8, overflow: "hidden" }}>
                    <img src={productImage(p)} alt={p.name} onError={handleImageError(p)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="admin-user-info">
                    <span className="admin-user-name" style={{ fontSize: 13 }}>{p.name}</span>
                    <span className="t-desc-mini">{p.category?.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "var(--accent-deep)", fontFamily: "var(--font-display)" }}>
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent users */}
          <div className="panel-v2">
            <div className="panel-v2-head">
              <h3>Mijozlar</h3>
              <button className="btn-link" onClick={() => onAction("viewCustomers")}>CRM →</button>
            </div>
            <div className="admin-users-mini">
              {loading ? (
                <div style={{ color: "var(--muted)", padding: 16 }}>Yuklanmoqda…</div>
              ) : users.slice(0, 5).map((u) => (
                <div className="admin-user-row" key={u.id}>
                  <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(u.username)}</span>
                  <div className="admin-user-info">
                    <span className="admin-user-name">{u.username}</span>
                    <span className={`role-pill ${u.role === "admin" ? "admin" : ""}`}>{u.role}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>#{String(u.id).padStart(3, "0")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="panel-v2">
        <div className="panel-v2-head"><h3>Tezkor amallar</h3></div>
        <div className="quick-actions-grid">
          <button className="quick-action-card" onClick={() => onAction("addProduct")}>
            <div className="quick-action-ic"><IconPlus width={22} height={22} /></div>
            <div className="quick-action-label">Yangi mahsulot</div>
            <div className="quick-action-sub">Katalogga qo'shish</div>
          </button>
          <button className="quick-action-card" onClick={() => onAction("addCategory")}>
            <div className="quick-action-ic" style={{ background: "linear-gradient(135deg,#4f9cf9,#3b82f6)" }}><IconTag width={22} height={22} /></div>
            <div className="quick-action-label">Yangi kategoriya</div>
            <div className="quick-action-sub">Turkum yaratish</div>
          </button>
          <button className="quick-action-card" onClick={() => onAction("viewCustomers")}>
            <div className="quick-action-ic" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}><IconUsers width={22} height={22} /></div>
            <div className="quick-action-label">Mijozlar CRM</div>
            <div className="quick-action-sub">{users.length} ta foydalanuvchi</div>
          </button>
          <button className="quick-action-card" onClick={() => onAction("viewOrders")}>
            <div className="quick-action-ic" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}><IconClipboard width={22} height={22} /></div>
            <div className="quick-action-label">Buyurtmalar</div>
            <div className="quick-action-sub">25 ta buyurtma</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
