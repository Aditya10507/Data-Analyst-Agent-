type PlotlyConfig = {
  displayModeBar?: boolean | "hover";
  displaylogo?: boolean;
  modeBarButtonsToRemove?: string[];
  responsive?: boolean;
};

type PlotlyLayout = Record<string, unknown>;
type PlotlyTrace = Record<string, unknown>;

type BrowserPlotly = {
  newPlot: (
    element: HTMLDivElement,
    data: PlotlyTrace[],
    layout: PlotlyLayout,
    config?: PlotlyConfig,
  ) => Promise<unknown>;
  react: (
    element: HTMLDivElement,
    data: PlotlyTrace[],
    layout: PlotlyLayout,
    config?: PlotlyConfig,
  ) => Promise<unknown>;
  Plots: {
    resize: (element: HTMLDivElement) => void;
  };
  purge: (element: HTMLDivElement) => void;
};

interface Window {
  Plotly?: BrowserPlotly;
}
