import {
  frequencyOptions,
  HOURS_PER_WORKDAY,
  NATIONAL_AVERAGE_ANNUAL_SUBSCRIPTIONS,
} from './data'

const frequencyMap = Object.fromEntries(
  frequencyOptions.map((option) => [option.value, option.perYear]),
)

export function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function annualCost(cost, frequency) {
  return toNumber(cost) * (frequencyMap[frequency] ?? 0)
}

export function monthlyCost(cost, frequency) {
  return annualCost(cost, frequency) / 12
}

export function dailyCost(cost, frequency) {
  return annualCost(cost, frequency) / 365
}

export function expenseMetrics(expense, hourlyWage) {
  const yearlyCost = annualCost(expense.cost, expense.frequency)
  const monthCost = yearlyCost / 12
  const dayCost = yearlyCost / 365
  const wage = Math.max(toNumber(hourlyWage), 0.01)
  const yearlyHours = yearlyCost / wage
  const monthlyHours = monthCost / wage
  const dailyHours = dayCost / wage
  const yearlyDays = yearlyHours / HOURS_PER_WORKDAY

  return {
    ...expense,
    yearlyCost,
    monthCost,
    dayCost,
    yearlyHours,
    monthlyHours,
    dailyHours,
    yearlyDays,
  }
}

export function totals(expenses, hourlyWage) {
  const detailed = expenses.map((expense) => expenseMetrics(expense, hourlyWage))

  const summary = detailed.reduce(
    (acc, expense) => {
      acc.yearlyCost += expense.yearlyCost
      acc.monthCost += expense.monthCost
      acc.dayCost += expense.dayCost
      acc.yearlyHours += expense.yearlyHours
      acc.monthlyHours += expense.monthlyHours
      acc.dailyHours += expense.dailyHours
      acc.yearlyDays += expense.yearlyDays
      return acc
    },
    {
      yearlyCost: 0,
      monthCost: 0,
      dayCost: 0,
      yearlyHours: 0,
      monthlyHours: 0,
      dailyHours: 0,
      yearlyDays: 0,
    },
  )

  return { detailed, summary }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value)
}

export function formatHours(value) {
  if (value >= 100) return value.toFixed(0)
  if (value >= 10) return value.toFixed(1)
  return value.toFixed(2)
}

export function formatDays(value) {
  return value >= 10 ? value.toFixed(1) : value.toFixed(2)
}

export function formatTimeFromHours(hours) {
  if (hours >= 1) {
    return `${hours.toFixed(hours >= 10 ? 0 : 1)} hours`
  }

  const minutes = hours * 60

  if (minutes >= 1) {
    return `${minutes.toFixed(minutes >= 10 ? 0 : 1)} minutes`
  }

  return `${Math.round(minutes * 60)} seconds`
}

export function getVerdict(hours) {
  if (hours < 6) return 'Pretty painless'
  if (hours < 20) return 'Not nothing'
  if (hours < 60) return 'Starting to sting'
  return 'Ouch'
}

export function getFraming(expense) {
  if (expense.yearlyDays >= 1) {
    const days = expense.yearlyDays.toFixed(expense.yearlyDays >= 10 ? 0 : 1)
    return `That is ${days} full workdays a year.`
  }

  return `You work ${formatTimeFromHours(expense.dailyHours)} a day to pay for this.`
}

export function getSummaryFraming(summary) {
  if (summary.yearlyDays >= 1) {
    return `Across everything, that is ${formatDays(summary.yearlyDays)} workdays a year.`
  }

  return `Across everything, that is ${formatTimeFromHours(summary.dailyHours)} every day.`
}

export function getAverageComparison(hourlyWage) {
  const wage = Math.max(toNumber(hourlyWage), 0.01)
  const averageHours = NATIONAL_AVERAGE_ANNUAL_SUBSCRIPTIONS / wage
  return {
    annualSpend: NATIONAL_AVERAGE_ANNUAL_SUBSCRIPTIONS,
    hours: averageHours,
    days: averageHours / HOURS_PER_WORKDAY,
  }
}
