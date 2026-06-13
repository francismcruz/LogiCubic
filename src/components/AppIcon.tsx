import React from "react";
import appIconImg from "../assets/images/app_icon.png";

interface AppIconProps {
  size?: number | string;
  className?: string;
  id?: string;
}

export function AppIcon({ size = "100%", className = "", id }: AppIconProps) {
  // Convert standard numeric size definition to pixel string if applicable
  const resolvedSize = typeof size === "number" ? `${size}px` : size;

  return (
    <img
      src={appIconImg}
      alt="LOGICUBIC Icon"
      style={{ width: resolvedSize, height: resolvedSize }}
      className={`select-none object-cover rounded-xl ${className}`}
      id={id}
      referrerPolicy="no-referrer"
    />
  );
}

