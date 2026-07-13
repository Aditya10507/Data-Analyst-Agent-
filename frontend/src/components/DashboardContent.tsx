import type { AnalysisResult } from "../types/analysis";
import type { JobResult, ParsedFilePreview } from "../types/files";
import type { ChartTab } from "./ChartPanel";
import { ShowAnalysisReportPanel } from "./AnalysisReportPanel";
import { ShowChartPanel } from "./ChartPanel";
import { ShowColumnExplorerPanel } from "./ColumnExplorerPanel";
import { ShowBusinessDashboard } from "./BusinessDashboard";
import { ShowDashboardExportControls } from "./DashboardExportControls";
import { ShowDataReportPanel } from "./DataReportPanel";
import { ShowDataPreviewTable } from "./DataPreviewTable";
import { ShowExecutiveSummaryPanel } from "./ExecutiveSummaryPanel";
import { ShowInsightsReportPanel } from "./InsightsReportPanel";
import { ShowReportVersionsPanel } from "./ReportVersionsPanel";
import { ShowSmartChartRecommendations } from "./SmartChartRecommendations";
import type { DashboardSection } from "./DashboardSectionTabs";

type DashboardContentProps = {
  activeChart: ChartTab;
  activeSection: DashboardSection;
  analysisResult: AnalysisResult;
  jobResult: JobResult | null;
  onActiveChartChange: (chart: ChartTab) => void;
  onSelectedColumnChange: (column: string | null) => void;
  parsedPreview: ParsedFilePreview | null;
  selectedColumn: string | null;
};

/** Show and return the selected dashboard report section. */
export function ShowDashboardContent(props: DashboardContentProps) {
  if (props.activeSection === "analysis") {
    return <ShowAnalysisReport {...props} />;
  }
  if (props.activeSection === "data") {
    return <ShowDataReport {...props} />;
  }
  if (props.activeSection === "insights") {
    return <ShowInsightsReportPanel analysisResult={props.analysisResult} jobResult={props.jobResult} />;
  }
  if (props.activeSection === "graphs") {
    return <ShowChartReport {...props} chartMode="2d" />;
  }
  if (props.activeSection === "charts") {
    return <ShowChartReport {...props} chartMode="3d" />;
  }
  return <ShowDashboardReport {...props} />;
}

/** Show and return the high-level business dashboard. */
function ShowDashboardReport(props: DashboardContentProps) {
  return <ShowBusinessDashboard analysisResult={props.analysisResult} jobResult={props.jobResult} />;
}

/** Show and return the business analysis report. */
function ShowAnalysisReport(props: DashboardContentProps) {
  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><div className="min-w-0 space-y-6"><ShowAnalysisReportPanel analysisResult={props.analysisResult} jobResult={props.jobResult} /><ShowExecutiveSummaryPanel analysisResult={props.analysisResult} jobResult={props.jobResult} /></div><aside className="space-y-6"><ShowSmartChartRecommendations analysisResult={props.analysisResult} onSelectChart={props.onActiveChartChange} /><ShowDashboardExportControls /><ShowReportVersionsPanel jobResult={props.jobResult} /></aside></div>;
}

/** Show and return the data preview and column report. */
function ShowDataReport(props: DashboardContentProps) {
  return <div className="space-y-6"><ShowDataReportPanel analysisResult={props.analysisResult} jobResult={props.jobResult} />{props.parsedPreview ? <ShowColumnExplorerPanel onFocusColumn={props.onSelectedColumnChange} preview={props.parsedPreview} selectedColumn={props.selectedColumn} /> : null}{props.parsedPreview ? <ShowDataPreviewTable preview={props.parsedPreview} /> : null}</div>;
}

/** Show and return the requested two- or three-dimensional chart report. */
function ShowChartReport(props: DashboardContentProps & { chartMode: "2d" | "3d" }) {
  return <ShowChartPanel key={props.chartMode} activeTab={props.activeChart} analysisResult={props.analysisResult} initialChartMode={props.chartMode} jobId={props.jobResult?.job_id ?? null} onActiveTabChange={props.onActiveChartChange} onSelectedColumnChange={props.onSelectedColumnChange} selectedColumn={props.selectedColumn} />;
}
