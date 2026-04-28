import { useEffect, useMemo, useState } from 'react'
import AnimatedStat from './components/AnimatedStat'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ReceiptCard from './components/ReceiptCard'
import WorkYearBar from './components/WorkYearBar'
import {
  formatCurrency,
  formatDays,
  formatHours,
  getAverageComparison,
  getSummaryFraming,
  getVerdict,
  totals,
} from './utils'

const initialDraft = {
  name: '',
  cost: '',
  frequency: 'monthly',
}

const fadeInClass =
  'animate-[fade-in_450ms_ease-out] motion-reduce:animate-none'

export default function App() {
  const [hourlyWage, setHourlyWage] = useState('')
  const [draft, setDraft] = useState(initialDraft)
  const [step, setStep] = useState(1)
  const [expenses, setExpenses] = useState(() => {
    const saved = window.localStorage.getItem('worth-it-expenses')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    window.localStorage.setItem('worth-it-expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    if (step >= 2 && expenses.length > 0) {
      setStep(3)
    }
  }, [expenses, step])

  const { detailed, summary } = useMemo(
    () => totals(expenses, hourlyWage),
    [expenses, hourlyWage],
  )

  const nationalAverage = useMemo(
    () => getAverageComparison(hourlyWage),
    [hourlyWage],
  )

  const addExpense = () => {
    if (!draft.name.trim() || Number(draft.cost) <= 0) return false

    setExpenses((current) => [
      ...current,
      {
        id: Date.now(),
        name: draft.name.trim(),
        cost: draft.cost,
        frequency: draft.frequency,
      },
    ])

    return true
  }

  const removeExpense = (id) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }

  const continueToExpenses = () => {
    if (Number(hourlyWage) > 0) {
      setStep(2)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-0 h-[560px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_38%),radial-gradient(circle_at_20%_20%,_rgba(168,85,247,0.18),_transparent_26%),linear-gradient(180deg,#020617_0%,#020617_72%,#020617_100%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section
          className={`overflow-hidden rounded-[36px] border border-white/10 bg-white/6 px-5 py-8 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:px-8 lg:px-10 lg:py-10 ${fadeInClass}`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-200/85">
                Is It Worth It?
              </p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                See what your subscriptions cost in work, not dollars.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                First, what do you earn per hour?
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                  Step 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Enter your hourly wage
                </h2>
              </div>

              <label className="mt-6 block space-y-2">
                <span className="text-sm font-medium text-slate-200">Hourly wage</span>
                <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition focus-within:border-cyan-300/60">
                  <span className="text-lg text-slate-400">$</span>
                  <input
                    value={hourlyWage}
                    onChange={(event) => setHourlyWage(event.target.value)}
                    type="number"
                    min="1"
                    step="0.01"
                    className="h-full w-full bg-transparent pl-3 text-lg font-medium text-white outline-none"
                  />
                  <span className="text-sm text-slate-400">/ hour</span>
                </div>
              </label>

              <button
                type="button"
                onClick={continueToExpenses}
                disabled={Number(hourlyWage) <= 0}
                className="mt-6 h-12 rounded-2xl bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/45 disabled:text-slate-900/70"
              >
                Continue
              </button>
            </div>
          </div>
        </section>

        {step >= 2 ? (
          <div className={fadeInClass}>
            <ExpenseForm
              draft={draft}
              setDraft={setDraft}
              onAdd={addExpense}
              hasExpenses={expenses.length > 0}
            />
          </div>
        ) : null}

        {step >= 3 ? (
          <div className={`flex flex-col gap-8 ${fadeInClass}`}>
            <WorkYearBar expenses={detailed} totalHours={summary.yearlyHours} />

            <section className="grid gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/6 px-5 py-8 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-200/85">
                  Your totals
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Here is the full picture.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Same data, same math, just revealed at the moment it becomes
                  useful.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <AnimatedStat
                    value={summary.yearlyHours}
                    formatter={(value) => `${formatHours(value)} h`}
                    label="Hours of work per year"
                    tone="accent"
                  />
                  <AnimatedStat
                    value={summary.yearlyDays}
                    formatter={(value) => `${formatDays(value)} days`}
                    label="Full workdays per year"
                  />
                  <AnimatedStat
                    value={summary.yearlyCost}
                    formatter={formatCurrency}
                    label="Total yearly subscription cost"
                  />
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-5 sm:p-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                    Your wage
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {formatCurrency(Number(hourlyWage || 0))} per hour
                  </h2>
                </div>

                <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/7 p-4">
                  <div className="text-sm font-medium text-cyan-100">
                    {getSummaryFraming(summary)}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">
                    Verdict: {getVerdict(summary.yearlyHours)}. This bundle costs
                    you{' '}
                    <span className="font-semibold text-white">
                      {formatHours(summary.dailyHours)}
                    </span>{' '}
                    hours a day,{' '}
                    <span className="font-semibold text-white">
                      {formatHours(summary.monthlyHours)}
                    </span>{' '}
                    hours a month, and{' '}
                    <span className="font-semibold text-white">
                      {formatHours(summary.yearlyHours)}
                    </span>{' '}
                    hours a year.
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <div className="text-slate-400">Per day</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {formatHours(summary.dailyHours)} h
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <div className="text-slate-400">Per month</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {formatHours(summary.monthlyHours)} h
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <div className="text-slate-400">Per year</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {formatHours(summary.yearlyHours)} h
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                  Combined total
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Your yearly subscription drag
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <AnimatedStat
                    value={summary.yearlyHours}
                    formatter={(value) => `${formatHours(value)} h`}
                    label="Hours worked yearly"
                  />
                  <AnimatedStat
                    value={summary.yearlyDays}
                    formatter={(value) => `${formatDays(value)} days`}
                    label="Workdays yearly"
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                  National average
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  How you compare
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  At your wage, the average American subscription spend of{' '}
                  <span className="font-semibold text-white">
                    {formatCurrency(nationalAverage.annualSpend)}
                  </span>{' '}
                  per year works out to about{' '}
                  <span className="font-semibold text-cyan-100">
                    {formatHours(nationalAverage.hours)} hours
                  </span>{' '}
                  or{' '}
                  <span className="font-semibold text-cyan-100">
                    {formatDays(nationalAverage.days)} workdays
                  </span>
                  . Source basis: Bango&apos;s March 13, 2025 U.S.
                  subscription study.
                </p>
              </div>
            </section>
            <ExpenseList expenses={detailed} onRemove={removeExpense} />
            <ReceiptCard
              expenses={detailed}
              summary={summary}
              hourlyWage={hourlyWage}
            />
          </div>
        ) : null}
      </main>
    </div>
  )
}
