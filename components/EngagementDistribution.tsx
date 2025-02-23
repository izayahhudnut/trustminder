// components/EngagementDistribution.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface EngagementDistributionProps {
  data: {
    reply_count?: number;
    open_count?: number;
    contacted_count?: number;
    bounced_count?: number;
  };
}

const EngagementDistribution: React.FC<EngagementDistributionProps> = ({ data }) => {
  const engagementData = {
    Category: ["Replied", "Opened (No Reply)", "No Engagement", "Bounced"],
    Count: [
      data.reply_count || 0,
      (data.open_count || 0) - (data.reply_count || 0),
      (data.contacted_count || 0) - (data.open_count || 0) - (data.bounced_count || 0),
      data.bounced_count || 0,
    ],
  };

  const pieColors = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

  return (
    <div>
      <Plot
        data={[
          {
            type: "pie",
            values: engagementData.Count,
            labels: engagementData.Category,
            marker: { colors: pieColors },
            textfont: { color: "#333" },
          },
        ]}
        layout={{
          title: "Engagement Distribution",
          title_x: 0.5,
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

export default EngagementDistribution;
