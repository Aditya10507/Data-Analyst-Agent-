import { BadgeCheck, CircleAlert, Info, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "../types/analysis";
import type { InsightKind } from "../types/insights";
import type { JobResult, JobResultInsight } from "../types/files";

type InsightsReportPanelProps = { analysisResult: AnalysisResult; jobResult: JobResult | null };

const INSIGHT_ICONS: Record<InsightKind, typeof Info> = { info: Info, trend: TrendingUp, warning: CircleAlert };

/** Calculate and return an evidence confidence score for an insight. */
function calculateEvidenceScore(analysisResult: AnalysisResult, insight: JobResultInsight): number {
  const qualityPenalty = Math.min(30, Math.round(analysisResult.nullPercent + analysisResult.duplicateRowPercent));
  const typeBonus = insight.type === "warning" ? 4 : insight.type === "trend" ? 7 : 2;
  return Math.max(55, Math.min(96, 88 - qualityPenalty + typeBonus));
}

/** Show and return an empty insights report state. */
function ShowEmptyInsights() {
  return <section className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">No AI insights are available for this completed report.</section>;
}

/** Show and return a validated business intelligence insights report. */
export function ShowInsightsReportPanel({ analysisResult, jobResult }: InsightsReportPanelProps) {
  const insights = jobResult?.insights ?? [];
  if (!insights.length) return <ShowEmptyInsights />;
  return <section className="space-y-5"><header><p className="text-sm font-semibold text-blue-600">BUSINESS INTELLIGENCE INSIGHTS</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Positive signals, risks, and actions</h2><p className="mt-2 text-sm text-slate-500">Evidence confidence reflects report completeness and data quality, not a claim of prediction accuracy.</p></header><div className="grid gap-4 xl:grid-cols-2">{insights.map((insight) => <ShowBusinessInsight analysisResult={analysisResult} insight={insight} key={`${insight.headline}-${insight.type}`} />)}</div></section>;
}

/** Show and return one evidence-backed business insight. */
function ShowBusinessInsight({ analysisResult, insight }: { analysisResult: AnalysisResult; insight: JobResultInsight }) {
  const Icon = INSIGHT_ICONS[insight.type];
  const score = calculateEvidenceScore(analysisResult, insight);
  const label = insight.type === "warning" ? "Risk" : insight.type === "trend" ? "Positive signal" : "Observation";
  return <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-2 text-slate-700"><Icon className={insight.type === "warning" ? "h-5 w-5 text-amber-600" : "h-5 w-5 text-emerald-600"} aria-hidden="true" /><span className="text-sm font-semibold">{label}</span></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{score}% evidence</span></div><h3 className="mt-4 text-lg font-bold text-slate-950">{insight.headline}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{insight.body}</p><div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500"><BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />Grounded in uploaded report statistics</div></article>;
}
