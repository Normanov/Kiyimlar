import React, { useState, useCallback } from "react";
import {
  IconSettings, IconShield, IconUser, IconMail, IconPhone,
  IconEdit, IconCheckCircle, IconAlert, IconClose, IconRefresh,
  IconDownload, IconTrash
} from "../Icons.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-info">
        <span className="settings-toggle-label">{label}</span>
        {description && <span className="settings-toggle-desc">{description}</span>}
      </div>
      <button
        className={`settings-toggle-btn ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span className="settings-toggle-thumb" />
      </button>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="panel-v2">
      <div className="panel-v2-head">
        <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center" }}>
            <Icon width={16} height={16} />
          </span>
          {title}
        </h3>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

function AdminSettings() {
  const { user } = useAuth();
  const toast = useToast();

  // Profile state
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crm_profile") || "{}"); } catch { return {}; }
  });
  const [profileForm, setProfileForm] = useState({
    username: profile.username || user?.username || "",
    email: profile.email || `${user?.username || "admin"}@mono.uz`,
    phone: profile.phone || "+998 90 000-00-00",
    bio: profile.bio || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Notification settings
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crm_notifs") || "{}"); } catch { return {}; }
  });

  // Store settings
  const [store, setStore] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crm_store") || "{}"); } catch { return {}; }
  });
  const [storeForm, setStoreForm] = useState({
    name: store.name || "MONO Studio",
    currency: store.currency || "USD",
    language: store.language || "uz",
    address: store.address || "Toshkent sh., Uzbekiston",
    phone: store.phone || "+998 71 000-00-00",
    email: store.email || "info@mono.uz",
    taxRate: store.taxRate || "12",
  });
  const [storeSaving, setStoreSaving] = useState(false);

  const saveProfile = useCallback(async () => {
    if (!profileForm.username.trim()) { toast.error("Foydalanuvchi nomi bo'sh bo'lishi mumkin emas"); return; }
    if (!profileForm.email.includes("@")) { toast.error("Email manzil noto'g'ri formatda"); return; }
    setProfileSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    localStorage.setItem("crm_profile", JSON.stringify(profileForm));
    setProfile(profileForm);
    setProfileSaving(false);
    toast.success("Profil ma'lumotlari saqlandi");
  }, [profileForm, toast]);

  const savePassword = useCallback(async () => {
    setPwError("");
    if (!pwForm.current) { setPwError("Joriy parolni kiriting"); return; }
    if (pwForm.next.length < 6) { setPwError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Parollar mos kelmadi"); return; }
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPwSaving(false);
    setPwForm({ current: "", next: "", confirm: "" });
    toast.success("Parol muvaffaqiyatli o'zgartirildi");
  }, [pwForm, toast]);

  const saveNotifs = useCallback((key, val) => {
    const updated = { ...notifs, [key]: val };
    setNotifs(updated);
    localStorage.setItem("crm_notifs", JSON.stringify(updated));
    toast.show(val ? `"${key}" bildirishnomasi yoqildi` : `"${key}" bildirishnomasi o'chirildi`);
  }, [notifs, toast]);

  const saveStore = useCallback(async () => {
    setStoreSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    localStorage.setItem("crm_store", JSON.stringify(storeForm));
    setStore(storeForm);
    setStoreSaving(false);
    toast.success("Do'kon sozlamalari saqlandi");
  }, [storeForm, toast]);

  const handleClearCache = () => {
    if (!window.confirm("Mahalliy cache tozalansinmi? Bu amal qaytarib bo'lmaydi.")) return;
    ["crm_orders_v2", "crm_statuses", "crm_notes", "crm_dummy_users"].forEach((k) => localStorage.removeItem(k));
    toast.success("Cache tozalandi. Sahifani yangilang.");
  };

  const handleExportData = () => {
    const data = {
      profile: profileForm,
      store: storeForm,
      notifs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mono_settings_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast.success("Ma'lumotlar JSON formatida yuklab olindi");
  };

  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-section-title">Sozlamalar</h2>
          <p className="admin-section-sub">Tizim, profil va do'kon sozlamalari</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* LEFT column */}
        <div className="settings-col">
          {/* Profile */}
          <SectionCard title="Profil ma'lumotlari" icon={IconUser}>
            <div className="settings-avatar-section">
              <div className="settings-avatar-xl">
                {profileForm.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{profileForm.username || user?.username}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 12px" }}>{user?.role || "admin"}</p>
                <button className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }}
                  onClick={() => toast.show("Rasm yuklash funksiyasi tez orada qo'shiladi")}>
                  Rasm yuklash
                </button>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-form-grid">
              <div className="field">
                <label>Foydalanuvchi nomi</label>
                <div className="input-with-icon">
                  <IconUser width={16} height={16} />
                  <input className="input" value={profileForm.username} onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>E-mail manzili</label>
                <div className="input-with-icon">
                  <IconMail width={16} height={16} />
                  <input className="input" type="email" value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>Telefon raqami</label>
                <div className="input-with-icon">
                  <IconPhone width={16} height={16} />
                  <input className="input" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Bio / Ta'rif</label>
                <textarea className="input textarea" value={profileForm.bio} placeholder="O'zingiz haqida qisqa ma'lumot…" rows={3}
                  onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveProfile} disabled={profileSaving} style={{ marginTop: 8 }}>
              {profileSaving ? "Saqlanmoqda…" : <><IconCheckCircle width={15} height={15} /> Saqlash</>}
            </button>
          </SectionCard>

          {/* Security */}
          <SectionCard title="Xavfsizlik" icon={IconShield}>
            {pwError && <div className="form-error">{pwError}</div>}
            <div className="settings-form-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Joriy parol</label>
                <div className="input-with-icon">
                  <IconShield width={16} height={16} />
                  <input className="input" type="password" placeholder="Joriy parolni kiriting" value={pwForm.current}
                    onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>Yangi parol</label>
                <div className="input-with-icon">
                  <IconShield width={16} height={16} />
                  <input className="input" type="password" placeholder="Kamida 6 belgi" value={pwForm.next}
                    onChange={(e) => { setPwError(""); setPwForm((p) => ({ ...p, next: e.target.value })); }} />
                </div>
              </div>
              <div className="field">
                <label>Parolni tasdiqlang</label>
                <div className="input-with-icon">
                  <IconShield width={16} height={16} />
                  <input className="input" type="password" placeholder="Takrorlang" value={pwForm.confirm}
                    onChange={(e) => { setPwError(""); setPwForm((p) => ({ ...p, confirm: e.target.value })); }} />
                </div>
              </div>
            </div>
            {pwForm.next && pwForm.confirm && (
              <div className={`pw-strength ${pwForm.next === pwForm.confirm ? "match" : "no-match"}`}>
                {pwForm.next === pwForm.confirm
                  ? <><IconCheckCircle width={13} height={13} /> Parollar mos kelmoqda</>
                  : <><IconClose width={13} height={13} /> Parollar mos emas</>}
              </div>
            )}
            <button className="btn btn-primary" onClick={savePassword} disabled={pwSaving} style={{ marginTop: 8 }}>
              {pwSaving ? "Saqlanmoqda…" : "Parolni o'zgartirish"}
            </button>
          </SectionCard>
        </div>

        {/* RIGHT column */}
        <div className="settings-col">
          {/* Store settings */}
          <SectionCard title="Do'kon sozlamalari" icon={IconSettings}>
            <div className="settings-form-grid">
              <div className="field">
                <label>Do'kon nomi</label>
                <input className="input" value={storeForm.name} onChange={(e) => setStoreForm((s) => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Valyuta</label>
                <select className="input" value={storeForm.currency} onChange={(e) => setStoreForm((s) => ({ ...s, currency: e.target.value }))}>
                  <option value="USD">USD ($)</option>
                  <option value="UZS">UZS (so'm)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="RUB">RUB (₽)</option>
                </select>
              </div>
              <div className="field">
                <label>Interfeys tili</label>
                <select className="input" value={storeForm.language} onChange={(e) => setStoreForm((s) => ({ ...s, language: e.target.value }))}>
                  <option value="uz">O'zbekcha</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="field">
                <label>Soliq foizi (%)</label>
                <input className="input" type="number" value={storeForm.taxRate} onChange={(e) => setStoreForm((s) => ({ ...s, taxRate: e.target.value }))} />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Do'kon manzili</label>
                <input className="input" value={storeForm.address} onChange={(e) => setStoreForm((s) => ({ ...s, address: e.target.value }))} />
              </div>
              <div className="field">
                <label>Do'kon telefoni</label>
                <div className="input-with-icon">
                  <IconPhone width={16} height={16} />
                  <input className="input" value={storeForm.phone} onChange={(e) => setStoreForm((s) => ({ ...s, phone: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label>Do'kon e-maili</label>
                <div className="input-with-icon">
                  <IconMail width={16} height={16} />
                  <input className="input" value={storeForm.email} onChange={(e) => setStoreForm((s) => ({ ...s, email: e.target.value }))} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveStore} disabled={storeSaving} style={{ marginTop: 8 }}>
              {storeSaving ? "Saqlanmoqda…" : <><IconCheckCircle width={15} height={15} /> Saqlash</>}
            </button>
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Bildirishnomalar" icon={IconAlert}>
            <div className="settings-notif-list">
              <Toggle
                checked={notifs.email_orders !== false}
                onChange={(v) => saveNotifs("email_orders", v)}
                label="Email orqali buyurtmalar"
                description="Yangi buyurtma kelganda email yuboriladi"
              />
              <Toggle
                checked={notifs.email_customers !== false}
                onChange={(v) => saveNotifs("email_customers", v)}
                label="Yangi mijozlar"
                description="Yangi ro'yxatdan o'tganda xabar olish"
              />
              <Toggle
                checked={notifs.sms_orders === true}
                onChange={(v) => saveNotifs("sms_orders", v)}
                label="SMS bildirishnomalar"
                description="Buyurtma holati o'zgarganda SMS"
              />
              <Toggle
                checked={notifs.low_stock !== false}
                onChange={(v) => saveNotifs("low_stock", v)}
                label="Kam qolgan mahsulotlar"
                description="Stokda 5 tadan kam qolganda ogohlantirish"
              />
              <Toggle
                checked={notifs.daily_report === true}
                onChange={(v) => saveNotifs("daily_report", v)}
                label="Kunlik hisobot"
                description="Har kuni soat 09:00 da hisobot"
              />
              <Toggle
                checked={notifs.browser_push !== false}
                onChange={(v) => saveNotifs("browser_push", v)}
                label="Brauzer bildirishnomalari"
                description="Real vaqt xabarlari"
              />
            </div>
          </SectionCard>

          {/* Danger zone */}
          <div className="panel-v2 danger-zone-panel">
            <div className="panel-v2-head">
              <h3 style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--danger)" }}>
                <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--danger-soft)", color: "var(--danger)", display: "grid", placeItems: "center" }}>
                  <IconAlert width={16} height={16} />
                </span>
                Xavfli zona
              </h3>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="danger-action-row">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Ma'lumotlarni eksport qilish</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Barcha sozlamalarni JSON formatida yuklab oling</div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={handleExportData}>
                  <IconDownload width={14} height={14} /> Yuklab olish
                </button>
              </div>
              <div className="danger-action-row">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Mahalliy cache tozalash</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Vaqtinchalik saqlangan barcha ma'lumotlar o'chiriladi</div>
                </div>
                <button className="btn danger-btn" style={{ fontSize: 13 }} onClick={handleClearCache}>
                  <IconRefresh width={14} height={14} /> Tozalash
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
