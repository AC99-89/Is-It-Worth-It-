import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

export default function AnimatedStat({
  value,
  formatter,
  label,
  tone = 'default',
}) {
  const animated = useAnimatedNumber(value)

  return (
    <div
      className={`rounded-3xl border px-5 py-4 backdrop-blur-sm ${
        tone === 'accent'
          ? 'border-cyan-300/30 bg-cyan-300/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {formatter(animated)}
      </div>
      <div className="mt-2 text-sm text-slate-300">{label}</div>
    </div>
  )
}
