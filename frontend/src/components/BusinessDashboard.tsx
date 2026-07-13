import { useMemo } from "react";
import type { ChartConfiguration } from "chart.js";
import type { AnalysisResult, HistogramSeries, TrendSeries } from "../types/analysis";
import type { JobResult } from "../types/files";
import { ShowChartCanvas } from "./ChartCanvas";
import { ShowDashboardKpis } from "./DashboardKpis";

type BusinessDashboardProps = {
  analysisResult: AnalysisResult;
  jobResult: JobResult | null;
};

type DashboardCharts = {
  distribution: ChartConfiguration | null;
  missing: ChartConfiguration | null;
  quality: ChartConfiguration<"doughnut">;
  trend: ChartConfiguration | null;
};

const CHART_GRID_COLOR = "#e2e8f0";
const PRIMARY_COLOR = "#2563eb";
const SECONDARY_COLOR = "#14b8a6";

/** Read and return the report quality score. */
function readQualityScore(analysisResult: AnalysisResult, jobResult: JobResult | null): number {
  const calculatedScore = 100 - analysisResult.nullPercent - analysisResult.duplicateRowPercent;
  return Math.max(0, Math.min(100, Math.round(jobResult?.data_quality?.score ?? calculatedScore)));
}

/** Build and return a line chart configuration for a trend series. */
function buildTrendConfig(series: TrendSeries): ChartConfiguration {
  return { type: "line", data: { labels: series.points.map((point) => point.x), datasets: [{ data: series.points.map((point) => point.y), backgroundColor: "rgba(37, 99, 235, 0.12)", borderColor: PRIMARY_COLOR, borderWidth: 3, fill: true, pointRadius: 0, tension: 0.35 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: CHART_GRID_COLOR }, beginAtZero: false } } } };
}

/** Build and return a bar chart configuration for a histogram series. */
function buildDistributionConfig(series: HistogramSeries): ChartConfiguration {
  return { type: "bar", data: { labels: series.labels, datasets: [{ data: series.values, backgroundColor: "rgba(20, 184, 166, 0.82)", borderRadius: 5, maxBarThickness: 34 }] }, options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } }, y: { grid: { color: CHART_GRID_COLOR }, beginAtZero: true } } } };
}

/** Build and return a compact missing-values chart configuration. */
function buildMissingConfig(analysisResult: AnalysisResult): ChartConfiguration | null {
  const labels = analysisResult.missingValueSeries.labels.slice(0, 8);
  const values = analysisResult.missingValueSeries.values.slice(0, 8);
  if (labels.length === 0) return null;
  return { type: "bar", data: { labels, datasets: [{ data: values, backgroundColor: "rgba(245, 158, 11, 0.85)", borderRadius: 4 }] }, options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: CHART_GRID_COLOR }, beginAtZero: true }, y: { grid: { display: false } } } } };
}

/** Build and return a doughnut chart configuration for data quality. */
function buildQualityConfig(score: number): ChartConfiguration<"doughnut"> {
  return { type: "doughnut", data: { labels: ["Quality", "Remaining"], datasets: [{ data: [score, 100 - score], backgroundColor: [SECONDARY_COLOR, "#e2e8f0"], borderWidth: 0, borderRadius: 6 }] }, options: { cutout: "78%", maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } } };
}

/** Build and return all chart configurations for the executive dashboard. */
function buildDashboardCharts(analysisResult: AnalysisResult, qualityScore: number): DashboardCharts {
  return { distribution: analysisResult.histogramSeries[0] ? buildDistributionConfig(analysisResult.histogramSeries[0]) : null, missing: buildMissingConfig(analysisResult), quality: buildQualityConfig(qualityScore), trend: analysisResult.trendSeries[0] ? buildTrendConfig(analysisResult.trendSeries[0]) : null };
}

/** Show and return a labelled chart surface or its empty state. */
function ShowDashboardChart({ config, emptyText }: { config: ChartConfiguration | null; emptyText: string }) {
  return config ? <ShowChartCanvas className="h-72 w-full" config={config} /> : <div className="flex h-72 items-center justify-center text-sm text-slate-500">{emptyText}</div>;
}

/** Show and return the main executive dashboard for a completed analysis. */
export function ShowBusinessDashboard({ analysisResult, jobResult }: BusinessDashboardProps) {
  const qualityScore = readQualityScore(analysisResult, jobResult);
  const charts = useMemo(() => buildDashboardCharts(analysisResult, qualityScore), [analysisResult, qualityScore]);
  const trendName = analysisResult.trendSeries[0]?.columnName ?? "dataset values";
  const distributionName = analysisResult.histogramSeries[0]?.columnName ?? "selected values";
  const topInsight = jobResult?.insights[0]?.body ?? analysisResult.summary;

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-blue-600">EXECUTIVE OVERVIEW</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Business dashboard</h2><p className="mt-1 text-sm text-slate-500">{jobResult?.filename ?? "Analysis workspace"}</p></div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Report ready</div>
      </header>
      <ShowDashboardKpis analysisResult={analysisResult} />
      <div className="grid gap-6 xl:grid-cols-12">
        <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-8"><h3 className="text-base font-bold text-slate-900">Trend overview</h3><p className="mt-1 text-sm text-slate-500">{trendName} across the dataset</p><div className="mt-5"><ShowDashboardChart config={charts.trend} emptyText="No numeric trend is available for this dataset." /></div></article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-4"><h3 className="text-base font-bold text-slate-900">Data quality</h3><p className="mt-1 text-sm text-slate-500">A quick confidence signal for this report.</p><div className="relative mt-5 h-56"><ShowChartCanvas className="h-56 w-full" config={charts.quality} /><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold text-slate-950">{qualityScore}</span><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">out of 100</span></div></div><p className="text-center text-sm font-semibold text-emerald-700">{jobResult?.data_quality?.grade ?? "Quality checked"}</p></article>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Distribution</h3><p className="mt-1 text-sm text-slate-500">{distributionName}</p><div className="mt-5"><ShowDashboardChart config={charts.distribution} emptyText="No distribution is available." /></div></article>
        <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-slate-900">Missing values</h3><p className="mt-1 text-sm text-slate-500">Columns requiring attention.</p><div className="mt-5"><ShowDashboardChart config={charts.missing} emptyText="No missing-value data is available." /></div></article>
        <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 shadow-sm"><p className="text-sm font-semibold text-cyan-300">EXECUTIVE SIGNAL</p><h3 className="mt-3 text-xl font-bold text-white">What matters most</h3><p className="mt-4 text-sm leading-6 text-slate-300">{topInsight}</p><div className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-400">Open Analysis report for recommended actions and detailed AI insights.</div></article>
      </div>
    </section>
  );
}
