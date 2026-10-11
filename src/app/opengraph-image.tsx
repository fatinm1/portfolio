import { ImageResponse } from "next/og";

export const alt = "Fatin Mojumder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share image: a glowing lime dot on the site background.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#040406",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(200,255,0,.10), transparent 35%), radial-gradient(circle at 75% 80%, rgba(91,108,255,.10), transparent 45%)",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            background: "#C8FF00",
            boxShadow: "0 0 80px 10px rgba(200,255,0,.45)",
          }}
        />
      </div>
    ),
    size
  );
}
