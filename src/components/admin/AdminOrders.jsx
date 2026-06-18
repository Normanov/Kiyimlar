import React, { useState, useMemo, useCallback } from "react";
import {
  IconSearch, IconFilter, IconEye, IconCheckCircle, IconAlert,
  IconClock, IconClose, IconPlus, IconTrash, IconDownload,
  IconEdit, IconPhone, IconCalendar, IconUser, IconRefresh,
  IconChevronDown, IconMail
} from "../Icons.jsx";
import { formatPrice } from "../../utils/catalog.js";
import { useToast } from "../../context/ToastContext.jsx";

const FAKE_ORDERS = [
  {
    id: 5001, customer: "Sardor Toshmatov", phone: "+998 90 123-45-67",
    address: "Toshkent sh., Yunusobod t., 12-uy", email: "sardor@mail.uz",
    items: [
      { name: "Ko'k ko'ylak", qty: 1, price: 189000, size: "M", sku: "KK-001" },
      { name: "Qora jeans", qty: 1, price: 245000, size: "32", sku: "QJ-012" },
    ],
    total: 434000, status: "completed", date: "2026-06-14T09:22:00Z",
    payment: "Karta", note: "Tez yetkazib bering", deliveryDate: "2026-06-15T14:00:00Z"
  },
  {
    id: 5002, customer: "Malika Yusupova", phone: "+998 91 234-56-78",
    address: "Samarqand sh., Registon ko'chasi, 7-uy", email: "malika@gmail.com",
    items: [
      { name: "Yozgi ko'ylak", qty: 2, price: 155000, size: "S", sku: "YK-023" },
    ],
    total: 310000, status: "processing", date: "2026-06-14T11:45:00Z",
    payment: "Naqd", note: "", deliveryDate: null
  },
  {
    id: 5003, customer: "Bobur Rahimov", phone: "+998 93 345-67-89",
    address: "Buxoro sh., Navoiy ko'chasi, 45-uy", email: "bobur.r@mail.uz",
    items: [
      { name: "Sport kurtka", qty: 1, price: 380000, size: "L", sku: "SK-034" },
      { name: "Sport shim", qty: 1, price: 210000, size: "L", sku: "SS-089" },
      { name: "Futbolka", qty: 3, price: 85000, size: "L", sku: "FB-056" },
    ],
    total: 845000, status: "completed", date: "2026-06-13T16:10:00Z",
    payment: "Karta", note: "3-qavatga olib chiqing", deliveryDate: "2026-06-14T11:00:00Z"
  },
  {
    id: 5004, customer: "Nilufar Hasanova", phone: "+998 99 456-78-90",
    address: "Toshkent sh., Chilonzor t., 8-mavze", email: "nilufar@gmail.com",
    items: [
      { name: "Klassik ko'ylak", qty: 1, price: 285000, size: "M", sku: "KLK-078" },
    ],
    total: 285000, status: "cancelled", date: "2026-06-13T08:30:00Z",
    payment: "Karta", note: "Noto'g'ri o'lcham", deliveryDate: null
  },
  {
    id: 5005, customer: "Jasur Karimov", phone: "+998 94 567-89-01",
    address: "Namangan sh., Navbahor ko'chasi, 3-uy", email: "jasur.k@mail.uz",
    items: [
      { name: "Qishki kurtka", qty: 1, price: 650000, size: "XL", sku: "QK-090" },
      { name: "Qo'lqop", qty: 1, price: 45000, size: "Bir o'lcham", sku: "QL-112" },
      { name: "Shapka", qty: 1, price: 55000, size: "Bir o'lcham", sku: "SH-113" },
    ],
    total: 750000, status: "completed", date: "2026-06-12T13:00:00Z",
    payment: "To'lov tizimi", note: "", deliveryDate: "2026-06-13T10:00:00Z"
  },
  {
    id: 5006, customer: "Sitora Mirzayeva", phone: "+998 97 678-90-12",
    address: "Toshkent sh., Mirzo Ulug'bek t., 22-uy", email: "sitora@inbox.uz",
    items: [
      { name: "Ko'ylak (yozgi)", qty: 2, price: 198000, size: "S", sku: "KY-045" },
      { name: "Shim (klassik)", qty: 1, price: 315000, size: "27", sku: "SH-067" },
    ],
    total: 711000, status: "processing", date: "2026-06-14T07:15:00Z",
    payment: "Karta", note: "Bayram sovg'asi uchun", deliveryDate: null
  },
  {
    id: 5007, customer: "Otabek Xolmatov", phone: "+998 90 789-01-23",
    address: "Farg'ona sh., Mustaqillik ko'chasi, 18-uy", email: "otabek.x@mail.uz",
    items: [
      { name: "Krossovka", qty: 1, price: 420000, size: "42", sku: "KR-200" },
      { name: "Sport futbolka", qty: 2, price: 95000, size: "M", sku: "SF-201" },
    ],
    total: 610000, status: "pending", date: "2026-06-15T08:00:00Z",
    payment: "Naqd", note: "Qo'ng'iroq qilib olib keling", deliveryDate: null
  },
  {
    id: 5008, customer: "Zulfiya Abdullayeva", phone: "+998 91 890-12-34",
    address: "Toshkent sh., Shayxontohur t., 9-ko'cha", email: "zulfiya@gmail.com",
    items: [
      { name: "Ko'ylak (to'y)", qty: 1, price: 520000, size: "M", sku: "KT-301" },
    ],
    total: 520000, status: "completed", date: "2026-06-11T15:20:00Z",
    payment: "Karta", note: "To'y uchun shoshilinch", deliveryDate: "2026-06-12T09:00:00Z"
  },
  {
    id: 5009, customer: "Sherzod Normatov", phone: "+998 93 901-23-45",
    address: "Andijon sh., Asaka ko'chasi, 6-uy", email: "sherzod.n@mail.uz",
    items: [
      { name: "Kostyum (to'liq)", qty: 1, price: 980000, size: "48", sku: "KOS-400" },
      { name: "Galstuk", qty: 2, price: 75000, size: "Bir o'lcham", sku: "GT-401" },
    ],
    total: 1130000, status: "completed", date: "2026-06-10T10:45:00Z",
    payment: "Karta", note: "Ish kiyimi uchun", deliveryDate: "2026-06-11T12:00:00Z"
  },
  {
    id: 5010, customer: "Barno Qodirov", phone: "+998 99 012-34-56",
    address: "Toshkent sh., Uchtepa t., 14-mavze", email: "barno.q@inbox.uz",
    items: [
      { name: "Futbolka (oddiy)", qty: 5, price: 79000, size: "M", sku: "FO-501" },
    ],
    total: 395000, status: "pending", date: "2026-06-15T10:30:00Z",
    payment: "Naqd", note: "", deliveryDate: null
  },
  {
    id: 5011, customer: "Ulugbek Salimov", phone: "+998 94 123-45-67",
    address: "Qarshi sh., Mustaqillik maydoni, 3-uy", email: "ulugbek.s@mail.uz",
    items: [
      { name: "Jeans (skinny)", qty: 1, price: 275000, size: "30", sku: "JS-601" },
      { name: "Ko'ylak (slim fit)", qty: 2, price: 215000, size: "M", sku: "KSF-602" },
      { name: "Kamar", qty: 1, price: 65000, size: "Bir o'lcham", sku: "KAM-603" },
    ],
    total: 770000, status: "processing", date: "2026-06-13T14:00:00Z",
    payment: "To'lov tizimi", note: "Qayta qabul qilmayman", deliveryDate: null
  },
  {
    id: 5012, customer: "Mohira Tursunova", phone: "+998 97 234-56-78",
    address: "Toshkent sh., Yakkasaroy t., 2-ko'cha", email: "mohira.t@gmail.com",
    items: [
      { name: "Ko'ylak (ofis)", qty: 1, price: 320000, size: "S", sku: "KO-701" },
      { name: "Shim (ofis)", qty: 1, price: 280000, size: "36", sku: "SHO-702" },
    ],
    total: 600000, status: "completed", date: "2026-06-09T11:30:00Z",
    payment: "Karta", note: "Ish kiyimi seti", deliveryDate: "2026-06-10T14:00:00Z"
  },
  {
    id: 5013, customer: "Doniyor Ergashev", phone: "+998 90 345-67-89",
    address: "Toshkent sh., Olmazor t., 7-mavze", email: "doniyor.e@mail.uz",
    items: [
      { name: "Hoodie", qty: 1, price: 345000, size: "XL", sku: "HD-801" },
      { name: "Jogger shim", qty: 1, price: 195000, size: "XL", sku: "JG-802" },
    ],
    total: 540000, status: "cancelled", date: "2026-06-12T09:15:00Z",
    payment: "Karta", note: "Manzil noto'g'ri", deliveryDate: null
  },
  {
    id: 5014, customer: "Feruza Nazarova", phone: "+998 91 456-78-90",
    address: "Toshkent sh., Sergeli t., 5-mavze", email: "feruza.n@inbox.uz",
    items: [
      { name: "Yubka", qty: 2, price: 145000, size: "M", sku: "YB-901" },
      { name: "Bluzka", qty: 1, price: 185000, size: "S", sku: "BL-902" },
    ],
    total: 475000, status: "completed", date: "2026-06-08T16:45:00Z",
    payment: "Karta", note: "", deliveryDate: "2026-06-09T10:00:00Z"
  },
  {
    id: 5015, customer: "Akbar Hamidov", phone: "+998 93 567-89-01",
    address: "Nukus sh., Qoraqalpog'iston, 12-uy", email: "akbar.h@mail.uz",
    items: [
      { name: "Qishki kurtka", qty: 1, price: 720000, size: "L", sku: "QK-100" },
    ],
    total: 720000, status: "processing", date: "2026-06-14T13:20:00Z",
    payment: "Naqd", note: "Uzoq yetkazib berish", deliveryDate: null
  },
  {
    id: 5016, customer: "Gulnora Yunusova", phone: "+998 99 678-90-12",
    address: "Toshkent sh., Bektemir t., 1-ko'cha", email: "gulnora.y@gmail.com",
    items: [
      { name: "Ko'ylak seti (3ta)", qty: 1, price: 450000, size: "M", sku: "KS-110" },
    ],
    total: 450000, status: "completed", date: "2026-06-07T10:00:00Z",
    payment: "To'lov tizimi", note: "Sovg'a uchun", deliveryDate: "2026-06-08T12:00:00Z"
  },
  {
    id: 5017, customer: "Bahrom Qosimov", phone: "+998 94 789-01-23",
    address: "Jizzax sh., Gagarin ko'chasi, 34-uy", email: "bahrom.q@mail.uz",
    items: [
      { name: "Krossovka", qty: 1, price: 385000, size: "41", sku: "KR-210" },
      { name: "Paypoq (6ta)", qty: 2, price: 45000, size: "40-42", sku: "PP-211" },
    ],
    total: 475000, status: "pending", date: "2026-06-15T11:45:00Z",
    payment: "Karta", note: "", deliveryDate: null
  },
  {
    id: 5018, customer: "Dilnoza Raxmanova", phone: "+998 97 890-12-34",
    address: "Toshkent sh., Yashnobod t., 23-uy", email: "dilnoza.r@inbox.uz",
    items: [
      { name: "Futbolka (5ta set)", qty: 1, price: 350000, size: "S", sku: "FS-300" },
      { name: "Shim (2ta set)", qty: 1, price: 490000, size: "26", sku: "SS-301" },
    ],
    total: 840000, status: "completed", date: "2026-06-06T14:30:00Z",
    payment: "Karta", note: "Yaxshi sifat kerak", deliveryDate: "2026-06-07T16:00:00Z"
  },
  {
    id: 5019, customer: "Timur Bekmurodov", phone: "+998 90 901-23-45",
    address: "Toshkent sh., Mirabad t., 11-ko'cha", email: "timur.b@mail.uz",
    items: [
      { name: "Kostyum (ishchi)", qty: 1, price: 850000, size: "50", sku: "KI-400" },
    ],
    total: 850000, status: "processing", date: "2026-06-14T15:00:00Z",
    payment: "To'lov tizimi", note: "Dizayn ko'kish bo'lsin", deliveryDate: null
  },
  {
    id: 5020, customer: "Sarvar Ismoilov", phone: "+998 91 012-34-56",
    address: "Toshkent sh., Hamza t., 18-mavze", email: "sarvar.i@gmail.com",
    items: [
      { name: "Ko'ylak (katta o'lcham)", qty: 2, price: 225000, size: "XXL", sku: "KKO-500" },
      { name: "Shim (katta o'lcham)", qty: 1, price: 290000, size: "36", sku: "SKO-501" },
    ],
    total: 740000, status: "completed", date: "2026-06-05T09:45:00Z",
    payment: "Karta", note: "", deliveryDate: "2026-06-06T11:00:00Z"
  },
  {
    id: 5021, customer: "Nozima Xoliqova", phone: "+998 93 123-56-78",
    address: "Toshkent sh., Yangihayot t., 6-ko'cha", email: "nozima.x@mail.uz",
    items: [
      { name: "Ko'ylak (bayramlik)", qty: 1, price: 480000, size: "M", sku: "KB-600" },
    ],
    total: 480000, status: "cancelled", date: "2026-06-11T07:30:00Z",
    payment: "Naqd", note: "Vaqtida yetkazilmadi", deliveryDate: null
  },
  {
    id: 5022, customer: "Behruz Azimov", phone: "+998 99 234-67-89",
    address: "Toshkent sh., Uchtepa t., 3-ko'cha", email: "behruz.a@inbox.uz",
    items: [
      { name: "Denim kurtka", qty: 1, price: 390000, size: "L", sku: "DK-700" },
      { name: "Denim shim", qty: 1, price: 265000, size: "32", sku: "DS-701" },
    ],
    total: 655000, status: "completed", date: "2026-06-04T12:00:00Z",
    payment: "Karta", note: "Denim seti", deliveryDate: "2026-06-05T14:00:00Z"
  },
  {
    id: 5023, customer: "Kamola Mansurova", phone: "+998 94 345-78-90",
    address: "Toshkent sh., Shayxontohur t., 5-mavze", email: "kamola.m@gmail.com",
    items: [
      { name: "Ko'ylak (3 xil rang)", qty: 3, price: 170000, size: "S", sku: "K3-800" },
    ],
    total: 510000, status: "processing", date: "2026-06-15T09:00:00Z",
    payment: "Karta", note: "Turli ranglar kerak", deliveryDate: null
  },
  {
    id: 5024, customer: "Rustam Yoqubov", phone: "+998 97 456-89-01",
    address: "Toshkent sh., Yunusobod t., 7-mavze", email: "rustam.y@mail.uz",
    items: [
      { name: "Polo ko'ylak", qty: 2, price: 195000, size: "L", sku: "PL-900" },
      { name: "Chino shim", qty: 1, price: 330000, size: "34", sku: "CH-901" },
      { name: "Ko'zoynak", qty: 1, price: 120000, size: "Bir o'lcham", sku: "KZ-902" },
    ],
    total: 840000, status: "completed", date: "2026-06-03T11:15:00Z",
    payment: "To'lov tizimi", note: "Yozgi kiyimlar", deliveryDate: "2026-06-04T13:00:00Z"
  },
  {
    id: 5025, customer: "Maftuna Sobirov", phone: "+998 90 567-90-12",
    address: "Toshkent sh., Mirzo Ulug'bek t., 14-uy", email: "maftuna.s@inbox.uz",
    items: [
      { name: "Yozgi ko'ylak seti", qty: 1, price: 560000, size: "M", sku: "YKS-010" },
    ],
    total: 560000, status: "pending", date: "2026-06-15T14:30:00Z",
    payment: "Karta", note: "Yangi kolleksiyadan", deliveryDate: null
  },
];

const STATUS_CONFIG = {
  pending:    { label: "Kutilmoqda",    color: "#f59e0b", icon: IconClock },
  processing: { label: "Jarayonda",     color: "#3b82f6", icon: IconAlert },
  completed:  { label: "Yetkazildi",    color: "#10b981", icon: IconCheckCircle },
  cancelled:  { label: "Bekor qilindi", color: "#e5484d", icon: IconClose },
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className="order-status-badge" style={{
      "--sc": cfg.color,
      "--sc-bg": hexToRgba(cfg.color, 0.12),
      "--sc-border": hexToRgba(cfg.color, 0.28),
    }}>
      <span className="order-status-dot" />
      {cfg.label}
    </span>
  );
}

function OrderModal({ order, onClose, onStatusChange }) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const toast = useToast();

  const itemsTotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = itemsTotal - order.total;

  const applyStatus = () => {
    if (newStatus === order.status) { setShowStatusDrop(false); return; }
    onStatusChange(order.id, newStatus);
    toast.success(`Buyurtma holati "${STATUS_CONFIG[newStatus]?.label}" ga o'zgartirildi`);
    setShowStatusDrop(false);
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>Buyurtma #{order.id}</h2>
            <span className="order-modal-date">
              {new Date(order.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <button className="modal-x" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>
        <div className="modal-body order-modal-body">
          {/* Status + actions bar */}
          <div className="order-modal-status-bar">
            <StatusBadge status={order.status} />
            <div style={{ position: "relative" }}>
              <button className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => setShowStatusDrop((s) => !s)}>
                <IconEdit width={14} height={14} /> Holat o'zgartirish <IconChevronDown width={13} height={13} />
              </button>
              {showStatusDrop && (
                <div className="order-status-drop">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      className={`order-status-drop-item ${newStatus === key ? "selected" : ""}`}
                      style={{ "--sc": cfg.color }}
                      onClick={() => setNewStatus(key)}
                    >
                      <span className="order-status-dot" />
                      {cfg.label}
                    </button>
                  ))}
                  <div className="order-status-drop-footer">
                    <button className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={applyStatus}>
                      Saqlash
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => setShowStatusDrop(false)}>
                      Bekor
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-modal-grid">
            {/* Customer info */}
            <div className="order-modal-section">
              <div className="order-modal-section-title"><IconUser width={14} height={14} /> Mijoz ma'lumotlari</div>
              <div className="order-info-row"><IconUser width={14} height={14} /><span>{order.customer}</span></div>
              <div className="order-info-row"><IconPhone width={14} height={14} /><span>{order.phone}</span></div>
              <div className="order-info-row"><IconMail width={14} height={14} /><span>{order.email}</span></div>
              <div className="order-info-row" style={{ alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>📍</span>
                <span>{order.address}</span>
              </div>
            </div>

            {/* Order meta */}
            <div className="order-modal-section">
              <div className="order-modal-section-title"><IconCalendar width={14} height={14} /> Buyurtma tafsiloti</div>
              <div className="order-info-row">
                <span className="order-info-k">To'lov usuli</span>
                <span className="order-info-v">{order.payment}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-k">Buyurtma raqami</span>
                <span className="order-info-v">#{order.id}</span>
              </div>
              {order.deliveryDate && (
                <div className="order-info-row">
                  <span className="order-info-k">Yetkazilgan sana</span>
                  <span className="order-info-v" style={{ color: "var(--success)" }}>
                    {new Date(order.deliveryDate).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}
                  </span>
                </div>
              )}
              {order.note && (
                <div className="order-note-box">
                  <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Izoh</span>
                  <p>{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items table */}
          <div className="order-modal-section">
            <div className="order-modal-section-title"><IconCheckCircle width={14} height={14} /> Mahsulotlar</div>
            <div className="order-items-table">
              <div className="order-items-head">
                <span>Mahsulot</span>
                <span>SKU</span>
                <span>O'lcham</span>
                <span>Miqdor</span>
                <span style={{ textAlign: "right" }}>Narxi</span>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="order-items-row">
                  <span className="order-item-name">{item.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{item.sku}</span>
                  <span className="order-item-badge">{item.size}</span>
                  <span>×{item.qty}</span>
                  <span style={{ textAlign: "right", fontWeight: 600 }}>{formatPrice(item.qty * item.price)}</span>
                </div>
              ))}
              <div className="order-items-footer">
                {discount > 0 && (
                  <div className="order-total-row">
                    <span>Chegirma</span>
                    <span style={{ color: "var(--danger)" }}>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="order-total-row grand">
                  <span>Jami</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const [orders, setOrders] = useState(() => {
    try {
      const local = localStorage.getItem("crm_orders_v2");
      if (local) return JSON.parse(local);
    } catch {}
    return FAKE_ORDERS;
  });

  const save = useCallback((updated) => {
    setOrders(updated);
    localStorage.setItem("crm_orders_v2", JSON.stringify(updated));
  }, []);

  const handleStatusChange = useCallback((id, status) => {
    const updated = orders.map((o) => o.id === id ? { ...o, status, deliveryDate: status === "completed" ? new Date().toISOString() : o.deliveryDate } : o);
    save(updated);
    if (selectedOrder?.id === id) setSelectedOrder((prev) => ({ ...prev, status, deliveryDate: status === "completed" ? new Date().toISOString() : prev.deliveryDate }));
  }, [orders, save, selectedOrder]);

  const handleDelete = useCallback((o) => {
    if (!window.confirm(`#${o.id} buyurtmani o'chirishni tasdiqlaysizmi?`)) return;
    const updated = orders.filter((x) => x.id !== o.id);
    save(updated);
    toast.success(`#${o.id} buyurtma o'chirildi`);
  }, [orders, save, toast]);

  const handleExport = () => {
    const csv = ["ID,Mijoz,Sana,Holat,Summa",
      ...orders.map((o) => `${o.id},"${o.customer}",${new Date(o.date).toLocaleDateString("uz-UZ")},${STATUS_CONFIG[o.status]?.label || o.status},${o.total}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `buyurtmalar_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("CSV fayl yuklab olindi");
  };

  const stats = useMemo(() => {
    const counts = { all: orders.length, pending: 0, processing: 0, completed: 0, cancelled: 0 };
    let revenue = 0;
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      if (o.status === "completed") revenue += o.total;
    });
    return { ...counts, revenue };
  }, [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((o) =>
      o.customer.toLowerCase().includes(q) ||
      String(o.id).includes(q) ||
      o.address?.toLowerCase().includes(q)
    );
    switch (sortBy) {
      case "newest": list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case "oldest": list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "total-asc": list.sort((a, b) => a.total - b.total); break;
      case "total-desc": list.sort((a, b) => b.total - a.total); break;
      default: break;
    }
    return list;
  }, [orders, statusFilter, query, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-section-title">Buyurtmalar</h2>
          <p className="admin-section-sub">Barcha mijoz buyurtmalarini boshqarish</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            <IconDownload width={15} height={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="order-stats-row">
        {[
          { key: "all",        label: "Jami",           value: stats.all,        color: "var(--ink)" },
          { key: "pending",    label: "Kutilmoqda",     value: stats.pending,    color: "#f59e0b" },
          { key: "processing", label: "Jarayonda",      value: stats.processing, color: "#3b82f6" },
          { key: "completed",  label: "Yetkazildi",     value: stats.completed,  color: "#10b981" },
          { key: "cancelled",  label: "Bekor qilingan", value: stats.cancelled,  color: "#e5484d" },
        ].map((s) => (
          <button
            key={s.key}
            className={`order-stat-card ${statusFilter === s.key ? "active" : ""}`}
            style={{ "--oc": s.color }}
            onClick={() => { setStatusFilter(s.key); setPage(1); }}
          >
            <span className="order-stat-n" style={{ color: s.color }}>{s.value}</span>
            <span className="order-stat-l">{s.label}</span>
          </button>
        ))}
        <div className="order-stat-card revenue-card">
          <span className="order-stat-n" style={{ color: "#10b981", fontSize: 18 }}>{formatPrice(stats.revenue)}</span>
          <span className="order-stat-l">Jami daromad</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <IconSearch width={16} height={16} />
          <input
            placeholder="Buyurtma raqami, mijoz ismi…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-group">
            <IconFilter width={14} height={14} />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="all">Barcha holatlar</option>
              <option value="pending">Kutilmoqda ({stats.pending})</option>
              <option value="processing">Jarayonda ({stats.processing})</option>
              <option value="completed">Yetkazildi ({stats.completed})</option>
              <option value="cancelled">Bekor qilingan ({stats.cancelled})</option>
            </select>
          </div>
          <select className="admin-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Eng yangi</option>
            <option value="oldest">Eng eski</option>
            <option value="total-desc">Summa: yuqori → past</option>
            <option value="total-asc">Summa: past → yuqori</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="panel-v2">
        {/* Mobile cards */}
        <div className="mobile-card-list">
          {paged.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Buyurtma topilmadi</div>
          ) : paged.map((o) => (
            <div key={o.id} className="order-mobile-card" onClick={() => setSelectedOrder(o)}>
              <div className="omc-top">
                <div className="omc-id">
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>#{o.id}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>{o.items.length} ta mahsulot</span>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="omc-customer">
                <span className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{o.customer.charAt(0)}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.phone}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div className="t-price-col" style={{ fontSize: 15 }}>{formatPrice(o.total)}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {new Date(o.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
              <div className="omc-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-action-btn view" style={{ flex: 1, width: "auto", height: 34, borderRadius: "var(--radius-sm)" }}
                  onClick={() => setSelectedOrder(o)}>
                  <IconEye width={14} height={14} /> Ko'rish
                </button>
                <button className="admin-action-btn delete" style={{ width: 34, height: 34 }}
                  onClick={() => handleDelete(o)}>
                  <IconTrash width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="table-wrap desktop-only">
          <table className="table admin-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>#</th>
                <th>Buyurtma</th>
                <th>Mijoz</th>
                <th>Manzil</th>
                <th>Sana</th>
                <th>Holat</th>
                <th>Summa</th>
                <th style={{ width: 100 }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="table-empty-row">Buyurtma topilmadi</td></tr>
              ) : (
                paged.map((o, idx) => (
                  <tr key={o.id} className="admin-table-row">
                    <td className="td-num">{(page - 1) * PER_PAGE + idx + 1}</td>
                    <td>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>#{o.id}</span>
                      <span className="t-desc-mini">{o.items.length} ta mahsulot</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{o.customer.charAt(0)}</span>
                        <div>
                          <span className="t-name">{o.customer}</span>
                          <span className="t-desc-mini">{o.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.address}</span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                      {new Date(o.date).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}
                      <span className="t-desc-mini">{new Date(o.date).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="t-price-col">{formatPrice(o.total)}</td>
                    <td>
                      <div className="admin-actions-cell">
                        <button className="admin-action-btn view" title="Ko'rish" onClick={() => setSelectedOrder(o)}>
                          <IconEye width={15} height={15} />
                        </button>
                        <button className="admin-action-btn delete" title="O'chirish" onClick={() => handleDelete(o)}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span className="pagination-info">{filtered.length} ta buyurtma · {page}/{totalPages}-sahifa</span>
            <div className="pagination-btns">
              <button className="pag-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Oldingi</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={p} className={`pag-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="pag-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Keyingi →</button>
            </div>
          </div>
        )}
        {totalPages <= 1 && filtered.length > 0 && (
          <div className="table-footer">{filtered.length} ta buyurtma</div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default AdminOrders;
