import {
  formatCurrency,
  formatDays,
  formatHours,
  getFraming,
  getVerdict,
} from '../utils'

export default function ExpenseList({ expenses, onRemove }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
            Breakdown
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Every recurring charge, translated into labor
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {expenses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/12 bg-slate-950/45 p-8 text-center">
            <div className="text-lg font-medium text-white">Nothing here yet.</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add a recurring charge above and this list will turn into a tiny
              audit of your working life.
            </p>
          </div>
        ) : null}

        {expenses.map((expense) => (
          <article
            key={expense.id}
            className="grid gap-4 rounded-3xl border border-white/8 bg-slate-950/55 p-5 md:grid-cols-[1.2fr_0.8fr_0.9fr_auto]"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white">{expense.name}</h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {expense.frequency}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {formatCurrency(expense.yearlyCost)} per year. {getFraming(expense)}
              </p>
              <p className="mt-2 text-sm font-medium text-cyan-200">
                Verdict: {getVerdict(expense.yearlyHours)}
              </p>
            </div>

            <div>
              <div className="text-sm text-slate-400">Hours / year</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {formatHours(expense.yearlyHours)}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Days / year</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {formatDays(expense.yearlyDays)}
              </div>
            </div>

            <div className="flex items-start justify-end">
              <button
                type="button"
                onClick={() => onRemove(expense.id)}
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-rose-300/40 hover:text-rose-200"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
