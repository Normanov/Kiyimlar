import React, { createContext, useContext, useState, useCallback } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [favIds, setFavIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("vc_favs") || "[]")); }
    catch { return new Set(); }
  });
  const [open, setOpen] = useState(false);

  const toggle = useCallback((id) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("vc_favs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const has = useCallback((id) => favIds.has(id), [favIds]);
  const openWishlist = useCallback(() => setOpen(true), []);
  const closeWishlist = useCallback(() => setOpen(false), []);

  return (
    <WishlistContext.Provider value={{ favIds, toggle, has, count: favIds.size, open, openWishlist, closeWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
