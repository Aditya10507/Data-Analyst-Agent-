import { Database, ShieldCheck, TriangleAlert } from "lucide-react";
import type { AnalysisResult } from "../types/analysis";
import type { JobResult } from "../types/files";
import { ShowDataQualityBadge } from "./DataQualityBadge";

type DataReportPanelProps = {
  analysisResult: AnalysisResult;
  jobResult: JobResult | null;
};

type IncompleteColumn = { name: string; nullCount: number; nullPercent: number };

/** Find and return incomplete fields in descending missing-data order. */
function findIncompleteColumns(jobResult: JobResult | null): IncompleteColumn[] {
  return Object.entries(jobResult?.column_meta ?? {}).map(([name, metadata]) => ({ name, nullCount: metadata.null_count ?? 0, nullPercent: metadata.null_percent ?? 0 })).filter((column) => column.nullCount > 0).sort((first, second) => second.nullCount - first.nullCount);
}

/** Show and return the dataset structure summary. */
function ShowDatasetStructure({ analysisResult, jobResult }: DataReportPanelProps) {
  return <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Database className="h-5 w-5 text-blue-600" aria-hidden="true" /><h2 className="font-bold text-slate-950">Dataset profile</h2></div><p className="mt-4 text-sm leading-6 text-slate-600"><strong className="text-slate-900">{jobResult?.filename ?? "Uploaded file"}</strong> contains {analysisResult.rowCount.toLocaleString()} rows and {analysisResult.columnCount.toLocaleString()} columns. The preview below is virtualized so professionals can inspect large files without waiting for the full table to render.</p></article>;
}

/** Show and return a complete missing-data findings panel. */
function ShowCompletenessPanel({ incompleteColumns }: { incompleteColumns: IncompleteColumn[] }) {
  if (!incompleteColumns.length) return <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><ShieldCheck className="h-5 w-5" aria-hidden="true" /><h2 className="mt-3 font-bold">Completeness check passed</h2><p className="mt-2 text-sm leading-6">No incomplete fields were reported by the analysis engine.</p></article>;
  return <article className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950"><TriangleAlert className="h-5 w-5" aria-hidden="true" /><h2 className="mt-3 font-bold">Incomplete data detected</h2><div className="mt-4 divide-y divide-amber-200">{incompleteColumns.slice(0, 8).map((column) => <div key={column.name} className="flex items-center justify-between gap-4 py-2 text-sm"><span className="truncate font-semibold">{column.name}</span><span className="shrink-0">{column.nullCount.toLocaleString()} missing ({column.nullPercent.toFixed(1)}%)</span></div>)}</div></article>;
}

/** Show and return data quality and completeness evidence. */
export function ShowDataReportPanel({ analysisResult, jobResult }: DataReportPanelProps) {
  const incompleteColumns = findIncompleteColumns(jobResult);
  return <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-6"><ShowDatasetStructure analysisResult={analysisResult} jobResult={jobResult} /><ShowCompletenessPanel incompleteColumns={incompleteColumns} /></div><ShowDataQualityBadge dataQuality={jobResult?.data_quality ?? null} /></section>;
}
