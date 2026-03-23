"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  selector?: string; // Default to 'modal-root'
}

export default function Portal({
  children,
  selector = "modal-root",
}: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const element = document.getElementById(selector);
  return element ? createPortal(children, element) : null;
}
