import { frequencyOptions } from '../data'

const emptyExpense = {
  name: '',
  cost: '',
  frequency: 'monthly',
}

export default function ExpenseForm({ draft, setDraft, onAdd, hasExpenses }) {
  const canAdd = draft.name.trim() && Number(draft.cost) > 0

  const update = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
            Add an expense
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {hasExpenses
              ? 'Add another subscription.'
              : 'Now add your first subscription.'}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-300">
          {hasExpenses
            ? 'Keep stacking recurring charges here and we will keep translating them into hours of your life at work.'
            : 'Name it, price it, pick how often it hits, and we will translate it into hours of your life at work.'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Expense name</span>
          <input
            value={draft.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Netflix"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/8"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Cost</span>
          <input
            value={draft.cost}
            onChange={(event) => update('cost', event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="15.99"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/8"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Frequency</span>
          <select
            value={draft.frequency}
            onChange={(event) => update('frequency', event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-300/60"
          >
            {frequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              if (onAdd()) {
                setDraft(emptyExpense)
              }
            }}
            disabled={!canAdd}
            className="h-12 w-full rounded-2xl bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/45 disabled:text-slate-900/70 md:w-auto"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  )
}
