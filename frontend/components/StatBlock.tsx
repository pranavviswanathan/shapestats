type Props = {
  label: string;
  value: string;
  hint?: string;
};

export function StatBlock({ label, value, hint }: Props) {
  return (
    <div className="card">
      <div className="text-[11px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-2 font-mono text-2xl tabular-nums text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-ink-500">{hint}</div> : null}
    </div>
  );
}
