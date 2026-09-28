import { ImageResponse } from "next/og";

export const alt = "Aokigahara — Fullstack Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, opacity: 0.6 }}>
          FULLSTACK DEVELOPER
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>
          !Aøkigahara
        </div>
        <div style={{ fontSize: 32, marginTop: 30, opacity: 0.6 }}>
          aokigahara.dev
        </div>
      </div>
    ),
    size,
  );
}
