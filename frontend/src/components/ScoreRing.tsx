import React, { useEffect, useState } from "react"

interface ScoreRingProps {
  value: number
  label: string
  tone?: "high" | "medium" | "low"
  size?: number
}

const toneVar: Record<NonNullable<ScoreRingProps["tone"]>, string> = {
  high: "var(--score-high)",
  medium: "var(--score-medium)",
  low: "var(--score-low)",
}

function toneFromValue(value: number): "high" | "medium" | "low" {
  if (value >= 70) return "high"
  if (value >= 40) return "medium"
  return "low"
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ value, label, tone, size = 64 }) => {
  const clamped = Math.max(0, Math.min(100, value))
  const resolvedTone = tone ?? toneFromValue(clamped)
  const color = toneVar[resolvedTone]

  const stroke = 5
  const radius = size / 2 - stroke
  const circumference = 2 * Math.PI * radius

  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(clamped))
    return () => cancelAnimationFrame(raf)
  }, [clamped])

  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1.5" role="img" aria-label={`${label}: ${clamped} out of 100`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
            {clamped}
          </span>
        </div>
      </div>
      <span className="label-eyebrow">{label}</span>
    </div>
  )
}
