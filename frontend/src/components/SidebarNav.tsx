import { BarChart3, FileUp, History, X } from "lucide-react";
import { useAppStore } from "../store/appStore";
import type { AppView } from "../types/app";
import { ShowRecentDownloads } from "./RecentDownloads";

type SidebarNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  icon: typeof FileUp;
  label: string;
  view: AppView;
};

const NAV_ITEMS: NavItem[] = [
  { icon: FileUp, label: "Upload", view: "upload" },
  { icon: BarChart3, label: "Dashboard", view: "dashboard" },
  { icon: History, label: "History", view: "history" },
];

/** Show and return the workspace navigation drawer. */
export function ShowSidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const activeView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close workspace menu" className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px]" onClick={onClose} type="button" />
      <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <ShowDrawerHeader onClose={onClose} />
        <nav className="mt-8 space-y-1">
          {NAV_ITEMS.map((item) => <ShowNavItem key={item.view} activeView={activeView} item={item} onClose={onClose} setActiveView={setActiveView} />)}
        </nav>
        <ShowRecentDownloads />
      </aside>
    </div>
  );
}

/** Show and return the workspace drawer heading. */
function ShowDrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI Analyst</p><h1 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Workspace</h1></div>
      <button aria-label="Close workspace menu" className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
    </div>
  );
}

/** Show and return one workspace navigation item. */
function ShowNavItem(props: { activeView: AppView; item: NavItem; onClose: () => void; setActiveView: (view: AppView) => void }) {
  const Icon = props.item.icon;
  const isActive = props.activeView === props.item.view;
  return <button className={buildNavClass(isActive)} type="button" onClick={() => selectView(props.item.view, props.setActiveView, props.onClose)}><Icon className="h-4 w-4" />{props.item.label}</button>;
}

/** Change the view, close the drawer, and return no content. */
function selectView(view: AppView, setActiveView: (view: AppView) => void, onClose: () => void): void {
  setActiveView(view);
  onClose();
}

/** Build and return a workspace navigation item class name. */
function buildNavClass(isActive: boolean): string {
  const baseClass = "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium";
  return isActive ? `${baseClass} bg-slate-950 text-white dark:bg-white dark:text-slate-950` : `${baseClass} text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800`;
}
