"use client";

import { useEffect, useState } from "react";

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const update = () => setY(window.scrollY);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return y;
}
