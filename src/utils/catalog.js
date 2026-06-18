/* =========================================================================
   Catalog helpers — product imagery, ratings, formatting.

   The backend has no image field, so we render elegant, deterministic
   SVG "lookbook" tiles per category. They always load (no network), look
   cohesive, and are content-accurate via a clothing silhouette + brand mark.
   ========================================================================= */

// Minimalist clothing silhouettes (24x24 viewBox path data).
const ICONS = {
  tshirt:
    "M8 3 4 6l2 3 2-1v10h8V8l2 1 2-3-4-3-1.2 1.3a3.5 3.5 0 0 1-5.6 0L8 3Z",
  trousers:
    "M7 3h10l-.4 8L15 21h-3l-.6-8h-.8L10 21H7L6 11 7 3Z",
  dress:
    "M9 3l-1 4 1 1-3 5 2 8h6l2-8-3-5 1-1-1-4a3 3 0 0 1-4 0Z",
  bag:
    "M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0",
  hanger:
    "M12 5a2 2 0 1 1 1.2 1.8c-.6.3-1 .8-1 1.4 0 .3.2.6.5.8L21 14a1 1 0 0 1 .5 .9V16H2.5v-1.1A1 1 0 0 1 3 14l8.3-4.9",
};

// key → { from, to, icon }. The chip icon path is also taken from here.
// Cool, near-monochrome lookbook palette with a faint per-category temperature.
const CATEGORY_META = {
  "t-shirts": { from: "#f2f2f4", to: "#d7d8de", icon: "tshirt" },
  shirts: { from: "#eef0f4", to: "#ccd2db", icon: "hanger" },
  "hoodies & sweatshirts": { from: "#eeeef2", to: "#d3d4db", icon: "tshirt" },
  "jackets & coats": { from: "#eaeaef", to: "#c6c7d0", icon: "hanger" },
  jeans: { from: "#e8ebf4", to: "#c1cbde", icon: "trousers" },
  "trousers & chinos": { from: "#efeef3", to: "#d4d3dd", icon: "trousers" },
  shorts: { from: "#f0f0f4", to: "#d8d9df", icon: "trousers" },
  "sweaters & knitwear": { from: "#eeedf3", to: "#d3d1dd", icon: "hanger" },
  dresses: { from: "#f1eef4", to: "#d9d2df", icon: "dress" },
  activewear: { from: "#eaeef1", to: "#c8d1d5", icon: "tshirt" },
  "suits & blazers": { from: "#eaeaef", to: "#c8c9d2", icon: "hanger" },
  accessories: { from: "#eeeef3", to: "#d3d4dd", icon: "bag" },
};

const DEFAULT_META = { from: "#eeeef3", to: "#d2d3db", icon: "hanger" };

export function categoryMeta(name = "") {
  return CATEGORY_META[String(name).trim().toLowerCase()] || DEFAULT_META;
}

export function categoryIconPath(name) {
  return ICONS[categoryMeta(name).icon] || ICONS.hanger;
}

// Stable per-product offset so tiles in one category aren't identical.
function hashString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** Returns a data-URI SVG tile for a product — always renders (used as fallback). */
export function productFallback(product) {
  const catName = product?.category?.name || "";
  const meta = categoryMeta(catName);
  const iconPath = ICONS[meta.icon] || ICONS.hanger;
  const seed = hashString((product?.name || "") + (product?.id || ""));
  const angle = 115 + (seed % 40); // 115–154deg gradient angle for variety
  const cx = 30 + (seed % 35); // soft-light position
  const id = `g${(product?.id ?? seed) % 100000}`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle - 135} .5 .5)">
      <stop offset="0" stop-color="${meta.from}"/>
      <stop offset="1" stop-color="${meta.to}"/>
    </linearGradient>
    <radialGradient id="${id}h" cx="${cx}%" cy="26%" r="62%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#${id})"/>
  <rect width="400" height="500" fill="url(#${id}h)"/>
  <g transform="translate(200 232)">
    <g transform="scale(7.2) translate(-12 -12)">
      <path d="${iconPath}" fill="none" stroke="#1c1c24" stroke-opacity="0.38"
            stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>
    </g>
  </g>
  <text x="200" y="450" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif"
        font-weight="600" font-size="16" letter-spacing="5" fill="#1c1c24" fill-opacity="0.55">MONO</text>
  <text x="200" y="474" text-anchor="middle" font-family="Inter, Arial, sans-serif"
        font-size="10" letter-spacing="2.5" fill="#1c1c24" fill-opacity="0.4">${escapeXml(
          catName.toUpperCase()
        )}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Primary product image: the real URL when present, else the SVG tile. */
export function productImage(product) {
  const url = product?.image_url;
  if (url && String(url).trim()) return url;
  return productFallback(product);
}

/** onError handler — swaps a broken image for the SVG tile once. */
export function handleImageError(product) {
  return (e) => {
    const fallback = productFallback(product);
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  };
}

function escapeXml(s = "") {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

export function formatPrice(value) {
  const n = Number(value || 0);
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function initials(name = "?") {
  return String(name).trim().charAt(0).toUpperCase() || "?";
}

/** Average rating from real reviews, or null when there are none. */
export function ratingFor(product) {
  const reviews = product?.reviews || [];
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}
