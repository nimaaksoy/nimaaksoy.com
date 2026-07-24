import { ImageResponse } from "next/og";
import { getRadarProject } from "@/lib/radar";

export const alt = "Radar item";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = await getRadarProject(slug);
  const name = project?.name ?? "Radar";
  const take = project?.take.en ?? "What I’m watching";
  const date = project?.date ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#EAEAEA",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#2CFF05",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          RADAR
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 300,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#9A9A9A",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {take.length > 140 ? `${take.slice(0, 137)}...` : take}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7F7F7F",
            fontSize: 24,
          }}
        >
          <span>nimaaksoy.com</span>
          <span style={{ color: "#2CFF05" }}>{date}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
