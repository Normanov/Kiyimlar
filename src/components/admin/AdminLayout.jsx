import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  IconDashboard, IconBox, IconTag, IconUsers, IconClipboard,
  IconSettings, IconMenu, IconClose, IconChevronRight, IconLogout,
  IconChevronDown,
} from "../Icons.jsx";

const TABS = [
  { id: "overview",    label: "Dashboard",     icon: IconDashboard, badge: null },
  { id: "products",    label: "Mahsulotlar",   icon: IconBox,       badge: null },
  { id: "categories",  label: "Kategoriyalar", icon: IconTag,       badge: null },
  { id: "customers",   label: "Mijozlar CRM",  icon: IconUsers,     badge: null },
  { id: "orders",      label: "Buyurtmalar",   icon: IconClipboard, badge: "25" },
  { id: "settings",    label: "Sozlamalar",    icon: IconSettings,  badge: null },
];

const NOTIFS = [
  { id: 1, text: "Yangi buyurtma #5025 keldi", time: "2 daq oldin",    type: "order" },
  { id: 2, text: "#5023 buyurtma jarayonda",   time: "15 daq oldin",   type: "order" },
  { id: 3, text: "Kamola Mansurova ro'yxatdan o'tdi", time: "1 soat oldin", type: "user" },
  { id: 4, text: "#5021 buyurtma bekor qilindi", time: "2 soat oldin", type: "alert" },
  { id: 5, text: "Yangi mijoz: Sarvar Ismoilov", time: "3 soat oldin", type: "user" },
];

function NotifBell({ count }) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("crm_read_notifs") || "[]")); }
    catch { return new Set(); }
  });
  const ref = useRef(null);

  const unread = NOTIFS.filter((n) => !read.has(n.id)).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    const newRead = new Set(NOTIFS.map((n) => n.id));
    setRead(newRead);
    localStorage.setItem("crm_read_notifs", JSON.stringify([...newRead]));
  };

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-btn" onClick={() => setOpen((o) => !o)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && <span className="notif-dot">{unread}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Bildirishnomalar</span>
            {unread > 0 && <button className="btn-link" style={{ fontSize: 12 }} onClick={markAllRead}>Barchasini o'qildi</button>}
          </div>
          {NOTIFS.map((n) => (
            <div key={n.id} className={`notif-item ${!read.has(n.id) ? "unread" : ""}`} onClick={() => {
              const newRead = new Set([...read, n.id]);
              setRead(newRead);
              localStorage.setItem("crm_read_notifs", JSON.stringify([...newRead]));
            }}>
              <div className={`notif-ic ${n.type}`} />
              <div>
                <div className="notif-text">{n.text}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu({ user }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="topbar-user-wrap" ref={ref}>
      <button className="topbar-user-btn" onClick={() => setOpen((o) => !o)}>
        <span className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
          {user?.username?.charAt(0).toUpperCase() || "A"}
        </span>
        <span className="topbar-user-name">{user?.username || "Admin"}</span>
        <IconChevronDown width={13} height={13} />
      </button>
      {open && (
        <div className="topbar-user-drop">
          <div className="tud-info">
            <div className="tud-name">{user?.username}</div>
            <div className="tud-role">{user?.role || "admin"}</div>
          </div>
          <div className="tud-divider" />
          <button className="tud-btn danger" onClick={() => { setOpen(false); logout?.(); }}>
            <IconLogout width={15} height={15} /> Chiqish
          </button>
        </div>
      )}
    </div>
  );
}

function AdminLayout({ activeTab, onTabChange, user, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className={`admin-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand">
              <div className="sidebar-brand-icon">
                <svg viewBox="0 0 32 32" width="26" height="26">
                  <rect width="32" height="32" rx="9" fill="#0e0e11" />
                  <path d="M8.5 23V9.5L16 17l7.5-7.5V23" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="24.8" cy="24.2" r="2.1" fill="#6d5efc" />
                </svg>
              </div>
              <div>
                <div className="sidebar-brand-name">
                  MONO<span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>.</span>
                </div>
                <div className="sidebar-brand-sub">Admin Panel</div>
              </div>
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => { setCollapsed((c) => !c); setMobileOpen(false); }}
            aria-label="Toggle sidebar"
          >
            {collapsed
              ? <IconChevronRight width={15} height={15} />
              : <IconClose width={15} height={15} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => { onTabChange(tab.id); setMobileOpen(false); }}
                title={collapsed ? tab.label : undefined}
              >
                <span className="sidebar-item-icon">
                  <Icon width={18} height={18} />
                </span>
                {!collapsed && (
                  <>
                    <span className="sidebar-item-label">{tab.label}</span>
                    {tab.badge && (
                      <span className="sidebar-item-badge">{tab.badge}</span>
                    )}
                    {isActive && <span className="sidebar-item-dot" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <span className="avatar">{user?.username?.charAt(0).toUpperCase() || "A"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name">{user?.username || "Admin"}</div>
                <div className="sidebar-user-role">{user?.role || "admin"}</div>
              </div>
              <button
                className="sidebar-logout-btn"
                title="Chiqish"
                onClick={() => { if (window.confirm("Tizimdan chiqishni xohlaysizmi?")) window.location.href = "/"; }}
              >
                <IconLogout width={15} height={15} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="admin-content">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu width={20} height={20} />
            </button>
            <div className="admin-topbar-title">
              {currentTab?.icon && (
                <span className="topbar-title-ic">
                  <currentTab.icon width={17} height={17} />
                </span>
              )}
              {currentTab?.label || "Dashboard"}
            </div>
          </div>

          <div className="admin-topbar-right">
            <NotifBell />
            <div className="topbar-divider" />
            <UserMenu user={user} />
          </div>
        </div>

        {/* Content */}
        <div className="admin-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
