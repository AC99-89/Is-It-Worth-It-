import { formatCurrency, formatDays, formatHours, getSummaryFraming } from '../utils'

export default function ReceiptCard({ expenses, summary, hourlyWage }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
          Shareable receipt
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Built to be screenshot and judged lovingly
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your subscription stack, your wage, your annual total. Clean enough to
          share, spicy enough to motivate a cancellation spree.
        </p>
      </div>

      <div className="rounded-[32px] border border-cyan-200/15 bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.24),_transparent_35%),linear-gradient(145deg,rgba(15,23,42,0.96),rgba(3,7,18,0.96))] p-6 shadow-2xl shadow-cyan-950/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-cyan-100/70">
              Is It Worth It?
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Subscription receipt
            </h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-slate-300">
            Wage
            <div className="mt-1 text-sm font-semibold text-white">
              {formatCurrency(Number(hourlyWage || 0))}/hr
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {expenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 bg-white/5 px-4 py-6 text-sm text-slate-300">
              Your receipt wakes up as soon as you add some subscriptions.
            </div>
          ) : null}

          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium text-white">{expense.name}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {expense.frequency}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-cyan-100">
                  {formatHours(expense.yearlyHours)} h
                </div>
                <div className="text-xs text-slate-400">
                  {formatCurrency(expense.yearlyCost)}/year
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Annual cost
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {formatCurrency(summary.yearlyCost)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Hours worked
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {formatHours(summary.yearlyHours)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Workdays
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {formatDays(summary.yearlyDays)}
            </div>
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-cyan-200/10 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-cyan-50">
          {getSummaryFraming(summary)}
        </p>
      </div>
    </section>
  )
}
