import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDE047",
        borderRadius: "8px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#422006"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Pastel Icon</title>
        <path d="M3 15C3 9 8 4 18 4L21 7C21 17 16 21 7 21Z" />
        <path d="M5 18L7 16" />
        <path d="M9 19L11 17" />
        <path d="M13 19L15 17" />
        <path d="M17 18L19 16" />
      </svg>
    </div>,
    {
      ...size,
    }
  );
}
