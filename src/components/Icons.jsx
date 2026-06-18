// Lightweight inline icon set (stroke-based, 24x24).
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IconBag = (p) => (
  <svg {...base} {...p}><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const IconHeart = (p) => (
  <svg {...base} {...p} fill={p?.fill || "none"}>
    <path d="M12 20s-7-4.4-9.3-8.5C1.2 8.8 2.6 5.5 5.8 5.5c1.9 0 3.2 1.1 4.2 2.4C11 6.6 12.3 5.5 14.2 5.5c3.2 0 4.6 3.3 3.1 6C19 15.6 12 20 12 20Z" />
  </svg>
);
export const IconUser = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
);
export const IconPlus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconClose = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconLogout = (p) => (
  <svg {...base} {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h12" /></svg>
);
export const IconBox = (p) => (
  <svg {...base} {...p}><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
);
export const IconTag = (p) => (
  <svg {...base} {...p}><path d="M20.6 13.4 13 21l-9-9V4h8l8.6 8.6a1.4 1.4 0 0 1 0 2Z" /><circle cx="7.5" cy="7.5" r="1.3" /></svg>
);
export const IconStar = ({ filled, ...p }) => (
  <svg {...base} {...p} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3Z" />
  </svg>
);
export const IconArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const IconSparkle = (p) => (
  <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" /></svg>
);
export const IconTrash = (p) => (
  <svg {...base} {...p}><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /></svg>
);

/* ── New admin / CRM icons ─────────────────────────────────────────── */

export const IconDashboard = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
);
export const IconGrid = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
);
export const IconLayers = (p) => (
  <svg {...base} {...p}><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>
);
export const IconFilter = (p) => (
  <svg {...base} {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" /></svg>
);
export const IconEdit = (p) => (
  <svg {...base} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" /></svg>
);
export const IconChart = (p) => (
  <svg {...base} {...p}><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
);
export const IconSettings = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
);
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
export const IconMail = (p) => (
  <svg {...base} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
);
export const IconPhone = (p) => (
  <svg {...base} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
);
export const IconCalendar = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconDownload = (p) => (
  <svg {...base} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
);
export const IconCheckCircle = (p) => (
  <svg {...base} {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
);
export const IconAlert = (p) => (
  <svg {...base} {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);
export const IconTrendUp = (p) => (
  <svg {...base} {...p}><path d="m23 6-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
);
export const IconTrendDown = (p) => (
  <svg {...base} {...p}><path d="m23 18-9.5-9.5-5 5L1 6" /><path d="M17 18h6v-6" /></svg>
);
export const IconChevronDown = (p) => (
  <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const IconMenu = (p) => (
  <svg {...base} {...p}><path d="M3 12h18M3 6h18M3 18h18" /></svg>
);
export const IconChevronRight = (p) => (
  <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
);
export const IconUsers = (p) => (
  <svg {...base} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
export const IconClipboard = (p) => (
  <svg {...base} {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
);
export const IconRefresh = (p) => (
  <svg {...base} {...p}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
);
export const IconMoreVertical = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
);
export const IconTruck = (p) => (
  <svg {...base} {...p}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v5h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);
export const IconPackage = (p) => (
  <svg {...base} {...p}><path d="m12.89 1.45 8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0Z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" x2="12" y2="11"/></svg>
);
export const IconMapPin = (p) => (
  <svg {...base} {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
export const IconStar2 = (p) => (
  <svg {...base} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
export const IconX = (p) => (
  <svg {...base} {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
export const IconGift = (p) => (
  <svg {...base} {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/></svg>
);
export const IconZap = (p) => (
  <svg {...base} {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
