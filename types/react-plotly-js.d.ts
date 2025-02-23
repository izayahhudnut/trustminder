// react-plotly-js.d.ts
declare module "react-plotly.js" {
    import * as React from "react";
  
    export interface PlotData {
      type?: string;
      x?: any[];
      y?: any[];
      z?: any[];
      [key: string]: any;
    }
  
    export interface PlotLayout {
      [key: string]: any;
    }
  
    export interface PlotConfig {
      [key: string]: any;
    }
  
    export interface PlotProps extends React.HTMLAttributes<HTMLDivElement> {
      data: PlotData[];
      layout: PlotLayout;
      config?: PlotConfig;
      useResizeHandler?: boolean;
      style?: React.CSSProperties;
    }
  
    const Plot: React.FC<PlotProps>;
    export default Plot;
  }
  