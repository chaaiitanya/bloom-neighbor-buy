
import React from "react";

export default function SproutslyLogo({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // Bright green #18c964, dark green #145c2d
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.27))", // strong SVG shadow
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{
          marginRight: 12,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.32))", // more pronounced
        }}
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
          // Strong multi-layer text-shadow for contrast on any glass background
          textShadow:
            "0 2px 8px #212121cc, 0 0px 2px #000, 0 0px 1px #145c2d70",
        }}
      >
        Sproutsly
      </span>
    </span>
  );
}
