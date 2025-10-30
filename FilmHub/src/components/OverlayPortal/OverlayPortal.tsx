import React from "react";
import { createPortal } from "react-dom";

interface OverlayPortalProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  style?: React.CSSProperties;
}

const overlayRoot = typeof document !== "undefined" ? document.body : null;

export default function OverlayPortal({ children, className, role, style }: OverlayPortalProps) {
  if (!overlayRoot) return null;
  return createPortal(
    <div className={className} role={role} style={style}>
      {children}
    </div>,
    overlayRoot
  );
}
