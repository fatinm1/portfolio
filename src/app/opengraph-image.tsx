import { ImageResponse } from "next/og";

export const alt = "Fatin Mojumder, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share image: the header's glowing lime dot and name on the site background.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "96px",
          backgroundColor: "#040406",
          backgroundImage:
            "radial-gradient(circle at 18% 30%, rgba(200,255,0,.12), transparent 40%), radial-gradient(circle at 85% 85%, rgba(91,108,255,.14), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "#C8FF00",
                boxShadow: "0 0 40px 6px rgba(200,255,0,.45)",
              }}
            />
            <div style={{ fontSize: 76, color: "#ededed", letterSpacing: "-0.03em" }}>Fatin Mojumder</div>
          </div>
          <div style={{ fontSize: 36, color: "#9b9ba3", lineHeight: 1.4, maxWidth: 900 }}>
            Software engineer building AI agents, inference engines and full stack apps.
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#7c7c85" }}>fatin.dev</div>
      </div>
    ),
    size
  );
}
