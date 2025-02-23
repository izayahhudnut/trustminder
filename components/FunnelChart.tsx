// components/FunnelChart.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface FunnelChartProps {
  data: {
    leads_count?: number;
    contacted_count?: number;
    open_count?: number;
    reply_count?: number;
  };
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const funnelData = {
    Stage: ["Sent Emails", "Contacted", "Opened", "Replied"],
    Count: [
      data.leads_count || 0,
      data.contacted_count || 0,
      data.open_count || 0,
      data.reply_count || 0,
    ],
  };

  return (
    <div>
      <Plot
        data={[
          {
            type: "funnel",
            y: funnelData.Stage,
            x: funnelData.Count,
            textinfo: "value+percent initial",
            textfont: { color: "#333" },
            marker: {
              color: funnelData.Count,
              colorscale: [
                [0.0, "#3B82F6"],
                [1.0, "#93C5FD"],
              ],
              line: { color: "white", width: 1 },
            },
          },
        ]}
        layout={{
          title: "Campaign Funnel",
          title_x: 0.5,
          showlegend: false,
          height: 400,
          paper_bgcolor: "#F9FAFB",
          plot_bgcolor: "#F9FAFB",
          font: { color: "#333", size: 14 },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default FunnelChart;
