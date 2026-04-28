import { HOURS_PER_WORK_YEAR } from '../data'
import { formatHours } from '../utils'

const colors = [
  'from-cyan-300 to-sky-400',
  'from-fuchsia-300 to-violet-400',
  'from-emerald-300 to-teal-400',
  'from-amber-300 to-orange-400',
  'from-rose-300 to-pink-400',
  'from-indigo-300 to-blue-400',
]

export default function WorkYearBar({ expenses, totalHours }) {
  const remainingHours = Math.max(HOURS_PER_WORK_YEAR - totalHours, 0)

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
            2,000-hour work year
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            How much of your year goes to subscriptions
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-300">
          Think of this as a tiny timeline of your working year. Every slice is
          time you are putting in just to keep these charges alive.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-full border border-white/10 bg-slate-950/70">
        <div className="flex h-7 w-full">
          {expenses.map((expense, index) => {
            const width = Math.max(
              (expense.yearlyHours / HOURS_PER_WORK_YEAR) * 100,
              expense.yearlyHours > 0 ? 1.25 : 0,
            )

            return (
              <div
                key={expense.id}
                className={`h-full bg-linear-to-r ${colors[index % colors.length]} transition-all duration-700`}
                style={{ width: `${Math.min(width, 100)}%` }}
                title={`${expense.name}: ${formatHours(expense.yearlyHours)} hours`}
              />
            )
          })}
          <div
            className="h-full bg-lime-300/75"
            style={{
              width: `${Math.max((remainingHours / HOURS_PER_WORK_YEAR) * 100, 0)}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {expenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/45 px-4 py-6 text-sm text-slate-300">
            Add a few expenses and the bar will show how much of a 2,000-hour
            work year they consume.
          </div>
        ) : null}

        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3"
          >
            <span
              className={`h-3 w-3 shrink-0 rounded-full bg-linear-to-r ${colors[index % colors.length]}`}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">
                {expense.name}
              </div>
              <div className="text-sm text-slate-400">
                {formatHours(expense.yearlyHours)} hours/year
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-lime-300/75" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">
              Everything else
            </div>
            <div className="text-sm text-slate-400">
              {formatHours(remainingHours)} hours/year
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
