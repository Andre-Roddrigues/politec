// components/Sidebar/index.tsx
"use client";

import { useState, useEffect } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <DesktopSidebar
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
    />
  );
}