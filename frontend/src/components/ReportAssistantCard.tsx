import { Bot, Send, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useReportAssistant } from "../hooks/useReportAssistant";
import type { JobResult } from "../types/files";
import { ShowAssistantMessageBubble } from "./AssistantMessageBubble";

type ReportAssistantCardProps = {
  jobResult: JobResult;
};

const SUGGESTED_QUESTIONS = [
  "Why are null values high?",
  "Which column affects results most?",
  "Explain this chart",
  "What action should I take?",
];

/** Show and return the report-aware assistant chat card. */
export function ShowReportAssistantCard({ jobResult }: ReportAssistantCardProps) {
  const assistant = useReportAssistant({ jobId: jobResult.job_id });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[min(24rem,calc(100vw-2.5rem))]">
      {isOpen ? <ShowAssistantPanel assistant={assistant} onClose={() => setIsOpen(false)} /> : <ShowAssistantButton onOpen={() => setIsOpen(true)} />}
    </div>
  );
}

/** Show and return the floating assistant open button. */
function ShowAssistantButton({ onOpen }: { onOpen: () => void }) {
  return <button className="ml-auto flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-800 dark:bg-white dark:text-slate-950" onClick={onOpen} type="button"><Bot className="h-4 w-4" />Ask AI Analyst</button>;
}

/** Show and return the expanded floating assistant panel. */
function ShowAssistantPanel({ assistant, onClose }: { assistant: ReturnType<typeof useReportAssistant>; onClose: () => void }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold text-slate-950 dark:text-white">AI Analyst</h3><p className="mt-1 text-xs text-slate-500">Answers only from this report.</p></div><button aria-label="Close AI Analyst" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} type="button"><X className="h-4 w-4" /></button></div>
      <ShowSuggestedQuestions assistant={assistant} />
      <ShowAssistantMessages assistant={assistant} />
      {assistant.errorMessage ? <p className="mt-2 text-xs font-medium text-red-600">{assistant.errorMessage}</p> : null}
      <ShowAssistantForm assistant={assistant} />
    </section>
  );
}

/** Show and return assistant shortcut questions. */
function ShowSuggestedQuestions({ assistant }: { assistant: ReturnType<typeof useReportAssistant> }) {
  return <div className="mt-3 flex flex-wrap gap-2">{SUGGESTED_QUESTIONS.map((question) => <button key={question} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-slate-950 dark:text-indigo-300 dark:ring-slate-800" type="button" disabled={assistant.isLoading} onClick={() => void assistant.submitQuestion(question)}>{question}</button>)}</div>;
}

/** Show and return report assistant messages. */
function ShowAssistantMessages({ assistant }: { assistant: ReturnType<typeof useReportAssistant> }) {
  return <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">{assistant.messages.map((message) => <ShowAssistantMessageBubble key={message.id} message={message} />)}</div>;
}

/** Show and return the assistant question form. */
function ShowAssistantForm({ assistant }: { assistant: ReturnType<typeof useReportAssistant> }) {
  return <form className="mt-4 flex gap-2" onSubmit={(event) => void handleSubmit(event, () => assistant.submitQuestion())}><input className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-2 text-xs text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white" placeholder="Ask about charts..." value={assistant.draft} onChange={(event) => assistant.setDraft(event.target.value)} /><button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60" type="submit" disabled={assistant.isLoading}><Send className="h-4 w-4" aria-hidden="true" /></button></form>;
}

/** Submit the assistant question and return no content. */
async function handleSubmit(event: FormEvent<HTMLFormElement>, submitQuestion: () => Promise<void>): Promise<void> {
  event.preventDefault();
  await submitQuestion();
}
