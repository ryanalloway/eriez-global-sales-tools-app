import Plot from "react-plotly.js";
import type { Data, Layout } from "plotly.js";

export default function Chart({
  data,
  title,
  xTitle,
  yTitle,
  extra = {},
}: {
  data: Data[];
  title: string;
  xTitle: string;
  yTitle: string;
  extra?: Partial<Layout>;
}) {
  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        height: 390,
        title: { text: title, font: { size: 16 } },
        margin: { l: 75, r: 35, t: 55, b: 65 },
        legend: { orientation: "h", y: -0.2 },
        ...extra,
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        font: { family: "Inter, Segoe UI, sans-serif", color: "#1E293B" },
        xaxis: {
          title: { text: xTitle },
          ...extra.xaxis,
          gridcolor: "#E2E8F0",
          zeroline: false,
        },
        yaxis: {
          title: { text: yTitle },
          ...extra.yaxis,
          gridcolor: "#E2E8F0",
          zeroline: false,
        },
      }}
      config={{
        responsive: true,
        displaylogo: false,
        toImageButtonOptions: {
          format: "png",
          filename: "eriez-magnet-analysis",
          scale: 2,
          width: 1400,
          height: 800,
        },
      }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}