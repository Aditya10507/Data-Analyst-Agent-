export type DashboardSection = "dashboard" | "analysis" | "data" | "insights" | "graphs" | "charts";

type DashboardSectionTabsProps = {
  activeSection: DashboardSection;
  onChange: (section: DashboardSection) => void;
};

type SectionTab = {
  label: string;
  value: DashboardSection;
};

const SECTION_TABS: SectionTab[] = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Analysis report", value: "analysis" },
  { label: "Data report", value: "data" },
  { label: "Insights", value: "insights" },
  { label: "Graphical representations", value: "graphs" },
  { label: "Chart representations", value: "charts" },
];

/** Show and return the top-level dashboard report navigation. */
export function ShowDashboardSectionTabs({ activeSection, onChange }: DashboardSectionTabsProps) {
  return (
    <nav aria-label="Dashboard sections" className="overflow-x-auto border-b border-slate-200 dark:border-slate-800">
      <div className="flex min-w-max gap-1 px-1">
        {SECTION_TABS.map((tab) => <ShowSectionTab key={tab.value} activeSection={activeSection} onChange={onChange} tab={tab} />)}
      </div>
    </nav>
  );
}

/** Show and return one dashboard section tab. */
function ShowSectionTab(props: { activeSection: DashboardSection; onChange: (section: DashboardSection) => void; tab: SectionTab }) {
  const isActive = props.activeSection === props.tab.value;
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      className={buildTabClass(isActive)}
      type="button"
      onClick={() => props.onChange(props.tab.value)}
    >
      {props.tab.label}
    </button>
  );
}

/** Build and return a dashboard section tab class name. */
function buildTabClass(isActive: boolean): string {
  const baseClass = "border-b-2 px-4 py-3 text-sm font-semibold transition-colors";
  return isActive ? `${baseClass} border-slate-950 text-slate-950 dark:border-white dark:text-white` : `${baseClass} border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-950 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white`;
}
