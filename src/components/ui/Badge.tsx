import React from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "pro" | "basic" | "default";
  size?: "sm" | "md";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const variantClass =
    styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const sizeClass =
    styles[`badge${size.charAt(0).toUpperCase() + size.slice(1)}`];

  return (
    <span
      className={`${styles.badge} ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
