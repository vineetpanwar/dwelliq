import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dwelliq — AI Home Styling Advisor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#FDFAF6",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        {/* Brass radial bloom */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(201,151,74,0.20) 0%, transparent 65%)",
          }}
        />

        {/* Bottom-left warm accent */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(201,151,74,0.10) 0%, transparent 65%)",
          }}
        />

        {/* Tag line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div style={{ width: 32, height: 1, background: "#C9974A" }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8C6820",
            }}
          >
            AI Home Styling
          </span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            color: "#1C1C1C",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          dwelliq
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#5A5A5A",
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: 620,
            marginBottom: 52,
          }}
        >
          Make your home look intentionally designed, not assembled.
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Free for homeowners", "3 options per piece", "Budget matched"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "10px 20px",
                  borderRadius: 9999,
                  border: "1px solid #D9CEBC",
                  fontSize: 14,
                  color: "#5A5A5A",
                  background: "#F5F0E8",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 96,
            right: 96,
            height: 1,
            background: "#E8DFD0",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
