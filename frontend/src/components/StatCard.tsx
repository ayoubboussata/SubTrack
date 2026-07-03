interface Props {
  label: string
  value: string | number
  hint?: string
  accent?: boolean
}

export default function StatCard({ label, value, hint, accent }: Props) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
