import { useState } from "react";
import type { ChartTab } from "../components/ChartPanel";
import { ShowDashboardContent } from "../components/DashboardContent";
import { ShowDashboardEmptyState } from "../components/DashboardEmptyState";
import { ShowDashboardSectionTabs, type DashboardSection } from "../components/DashboardSectionTabs";
import { useAppStore } from "../store/appStore";

/** Display and return the dashboard page shell. */
export function DisplayDashboardPage() {
  const [activeChart, setActiveChart] = useState<ChartTab>("distribution");
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const analysisResult = useAppStore((state) => state.analysisResult);
  const jobResult = useAppStore((state) => state.jobResult);
  const parsedPreview = useAppStore((state) => state.parsedPreview);
  const setActiveView = useAppStore((state) => state.setActiveView);

  return (
    <section className="w-full space-y-6">
      {!analysisResult ? <ShowDashboardEmptyState onUploadClick={() => setActiveView("upload")} /> : null}
      {analysisResult ? <ShowDashboardSectionTabs activeSection={activeSection} onChange={setActiveSection} /> : null}
      {analysisResult ? <ShowDashboardContent activeChart={activeChart} activeSection={activeSection} analysisResult={analysisResult} jobResult={jobResult} onActiveChartChange={setActiveChart} onSelectedColumnChange={setSelectedColumn} parsedPreview={parsedPreview} selectedColumn={selectedColumn} /> : null}
    </section>
  );
}
