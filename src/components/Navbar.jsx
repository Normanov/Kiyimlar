import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { initials } from "../utils/catalog.js";
import { IconBag, IconHeart, IconMenu, IconClose, IconUser, IconPackage, IconLogout } from "./Icons.jsx";

function UserDropdown({ user, onProfile, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { count: favCount, openWishlist } = useWishlist();
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  return (
    <div className="user-dropdown" ref={ref}>
      <div className="ud-header">
        <div className="ud-avatar">{initials(user?.username)}</div>
        <div>
          <div className="ud-name">{user?.username}</div>
          <div className="ud-role">{user?.role === "admin" ? "Administrator" : "Xaridor"}</div>
        </div>
      </div>
      <div className="ud-divider" />
      <button className="ud-item" onClick={() => { onProfile(); onClose(); }}>
        <IconUser width={15} height={15} /> Profil
      </button>
      <button className="ud-item" onClick={() => { openWishlist(); onClose(); }}>
        <IconHeart width={15} height={15} /> Sevimlilar
        {favCount > 0 && <span className="ud-badge">{favCount}</span>}
      </button>
      <button className="ud-item" onClick={() => { onProfile(); onClose(); }}>
        <IconPackage width={15} height={15} /> Buyurtmalarim
      </button>
      <div className="ud-divider" />
      <button className="ud-item danger" onClick={() => { logout(); navigate("/login"); onClose(); }}>
        <IconLogout width={15} height={15} /> Chiqish
      </button>
    </div>
  );
}

function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { count: cartCount, openCart } = useCart();
  const { count: favCount, openWishlist } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Lazy import ProfileModal to avoid circular issues
  const [ProfileModal, setProfileModal] = useState(null);
  useEffect(() => {
    import("./customer/ProfileModal.jsx").then((m) => setProfileModal(() => m.default));
  }, []);

  return (
    <>
      <nav className="navbar2">
        <div className="container navbar2-inner">
          {/* Brand */}
          <NavLink to="/" className="brand2">
            <div className="brand2-mark">
              <svg viewBox="0 0 28 28" width="26" height="26">
                <rect width="28" height="28" rx="7" fill="#0e0e14"/>
                <path d="M7 21V8L14 15l7-7V21" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="21.5" cy="21.5" r="1.8" fill="#6d5efc"/>
              </svg>
            </div>
            <div>
              <span className="brand2-name">MONO Remodul<span className="brand2-dot">.</span></span>
              <span className="brand2-sub">Premium</span>
            </div>
          </NavLink>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div className="navbar2-links">
              {isAdmin ? (
                <>
                  <NavLink to="/admin" className="nb2-link">Dashboard</NavLink>
                  <NavLink to="/" className="nb2-link">Do'kon</NavLink>
                </>
              ) : (
                <>
                  <a className="nb2-link" href="#collection">Kolleksiya</a>
                  <a className="nb2-link" href="#collection" onClick={() => {}}>Yangi keldi</a>
                  <a className="nb2-link" href="#collection">Chegirmalar</a>
                </>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="navbar2-right">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    {/* Wishlist */}
                    <button className="nb2-icon-btn" onClick={openWishlist} aria-label="Sevimlilar">
                      <IconHeart width={20} height={20} fill={favCount > 0 ? "currentColor" : "none"} style={{ color: favCount > 0 ? "#e5484d" : "currentColor" }} />
                      {favCount > 0 && <span className="nb2-badge">{favCount}</span>}
                    </button>
                    {/* Cart */}
                    <button className="nb2-icon-btn" onClick={openCart} aria-label="Savatcha">
                      <IconBag width={20} height={20} />
                      {cartCount > 0 && <span className="nb2-badge">{cartCount}</span>}
                    </button>
                  </>
                )}

                {/* User */}
                <div style={{ position: "relative" }}>
                  <button
                    className="nb2-user-btn"
                    onClick={() => setUserOpen((o) => !o)}
                  >
                    <span className="nb2-avatar">{initials(user?.username)}</span>
                    <span className="nb2-username hide-mobile">{user?.username}</span>
                  </button>
                  {userOpen && (
                    <UserDropdown
                      user={user}
                      onProfile={() => setProfileOpen(true)}
                      onClose={() => setUserOpen(false)}
                    />
                  )}
                </div>

                {/* Mobile menu */}
                <button className="nb2-icon-btn mobile-only" onClick={() => setMobileOpen(!mobileOpen)}>
                  {mobileOpen ? <IconClose width={20} height={20} /> : <IconMenu width={20} height={20} />}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost">Kirish</NavLink>
                <NavLink to="/signup" className="btn btn-primary">Ro'yxatdan o'tish</NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && isAuthenticated && (
          <div className="navbar2-mobile-menu">
            <div className="container">
              {!isAdmin && (
                <>
                  <a className="nb2-mobile-link" href="#collection" onClick={() => setMobileOpen(false)}>Kolleksiya</a>
                  <a className="nb2-mobile-link" href="#collection" onClick={() => setMobileOpen(false)}>Yangi keldi</a>
                  <a className="nb2-mobile-link" href="#collection" onClick={() => setMobileOpen(false)}>Chegirmalar</a>
                </>
              )}
              <button className="nb2-mobile-link" onClick={() => { setProfileOpen(true); setMobileOpen(false); }}>
                <IconUser width={16} height={16} /> Profil
              </button>
              {!isAdmin && (
                <>
                  <button className="nb2-mobile-link" onClick={() => { openWishlist(); setMobileOpen(false); }}>
                    <IconHeart width={16} height={16} /> Sevimlilar {favCount > 0 && `(${favCount})`}
                  </button>
                  <button className="nb2-mobile-link" onClick={() => { openCart(); setMobileOpen(false); }}>
                    <IconBag width={16} height={16} /> Savatcha {cartCount > 0 && `(${cartCount})`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {profileOpen && ProfileModal && (
        <ProfileModal onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
