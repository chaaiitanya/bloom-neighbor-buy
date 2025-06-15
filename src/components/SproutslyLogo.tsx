
import React from "react";

export default function SproutslyLogo({ size = 56, className = "" }: { size?: number; className?: string }) {
  // Bright green #18c964, dark green #145c2d
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{ marginRight: 12 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="24"
          cy="22.7"
          rx="15"
          ry="19"
          fill="#18c964"
          stroke="#145c2d"
          strokeWidth="2.5"
        />
        <path
          d="M24 42C27.3137 34 30.5 24.5 41 8.5"
          stroke="#145c2d"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse
          cx="32"
          cy="16"
          rx="3.5"
          ry="5.5"
          fill="#cafdcb"
          fillOpacity="0.45"
        />
      </svg>
      <span
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 900,
          fontSize: size * 0.56,
          color: "#18c964",
          letterSpacing: "-1.5px",
          lineHeight: 1,
          textShadow: "0 2px 10px #02411e20"
        }}
      >
        Sproutsly
      </span>
    </span>
  );
}
