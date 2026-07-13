import { BarChart3, CircleAlert, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "../types/analysis";
import type { JobResult } from "../types/files";

type AnalysisReportPanelProps = {
  analysisResult: AnalysisResult;
  jobResult: JobResult | null;
};

type ReportSignal = {
  body: string;
  label: string;
  tone: "positive" | "risk" | "neutral";
};

const FINANCIAL_TERMS = ["profit", "loss", "revenue", "sales", "cost", "margin", "income", "expense"];

/** Find and return uploaded columns that may carry financial measures. */
function findFinancialColumns(jobResult: JobResult | null): string[] {
  return Object.keys(jobResult?.column_meta ?? {}).filter((columnName) => FINANCIAL_TERMS.some((term) => columnName.toLowerCase().includes(term)));
}

/** Build and return an accuracy-safe quality signal. */
function buildQualitySignal(analysisResult: AnalysisResult): ReportSignal {
  const riskPercent = analysisResult.nullPercent + analysisResult.duplicateRowPercent;
  const tone = riskPercent > 10 ? "risk" : "positive";
  const body = riskPercent > 10 ? `${riskPercent.toFixed(1)}% of the dataset is affected by missing or duplicate records. Validate these fields before treating trends as decision-ready.` : `Missing and duplicate records affect ${riskPercent.toFixed(1)}% of the dataset, which supports directional analysis.`;
  return { body, label: "Data reliability", tone };
}

/** Build and return a signal describing business-driver coverage. */
function buildDriverSignal(financialColumns: string[]): ReportSignal {
  if (!financialColumns.length) return { body: "No direct profit, loss, revenue, sales, cost, margin, income, or expense field was detected. The report will not infer financial performance from unrelated columns.", label: "Business drivers", tone: "neutral" };
  return { body: `Financial driver fields detected: ${financialColumns.join(", ")}. Use the graphical report to compare their distributions and relationships before making a commercial decision.`, label: "Business drivers", tone: "positive" };
}

/** Build and return a signal covering analysis scope. */
function buildScopeSignal(analysisResult: AnalysisResult): ReportSignal {
  return { body: `${analysisResult.rowCount.toLocaleString()} records across ${analysisResult.columnCount.toLocaleString()} fields were profiled. Numeric distributions, missingness, duplicates, and correlations were evaluated for this report.`, label: "Analysis scope", tone: "neutral" };
}

/** Show and return a professional whole-file analysis report. */
export function ShowAnalysisReportPanel({ analysisResult, jobResult }: AnalysisReportPanelProps) {
  const signals = [buildScopeSignal(analysisResult), buildDriverSignal(findFinancialColumns(jobResult)), buildQualitySignal(analysisResult)];
  return <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><BarChart3 className="mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" /><div><p className="text-sm font-semibold text-blue-600">ANALYSIS REPORT</p><h2 className="mt-1 text-xl font-bold text-slate-950">Whole-file business assessment</h2><p className="mt-1 text-sm text-slate-500">{jobResult?.filename ?? "Current dataset"}</p></div></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{signals.map((signal) => <ShowReportSignal key={signal.label} signal={signal} />)}</div></section>;
}

/** Show and return one analysis assessment signal. */
function ShowReportSignal({ signal }: { signal: ReportSignal }) {
  const Icon = signal.tone === "risk" ? CircleAlert : signal.tone === "positive" ? TrendingUp : BarChart3;
  return <article className={buildSignalClass(signal.tone)}><Icon className="h-5 w-5" aria-hidden="true" /><h3 className="mt-4 font-semibold">{signal.label}</h3><p className="mt-2 text-sm leading-6 opacity-90">{signal.body}</p></article>;
}

/** Build and return a signal tone class. */
function buildSignalClass(tone: ReportSignal["tone"]): string {
  if (tone === "risk") return "rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950";
  if (tone === "positive") return "rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950";
  return "rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-800";
}
