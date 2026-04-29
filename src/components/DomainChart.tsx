'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
import type { DomainScore } from '@/types'

interface Props {
  domainScores: DomainScore[]
}

interface BarShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  color?: string
}

function ColoredBar({ x = 0, y = 0, width = 0, height = 0, color = '#6366f1' }: BarShapeProps) {
  return <rect x={x} y={y} width={width} height={height} fill={color} rx={6} ry={6} />
}

export function DomainBarChart({ domainScores }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={domainScores} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={150}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [`${Number(value)}%`, 'Score']}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="score" shape={<ColoredBar />} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DomainRadarChart({ domainScores }: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={domainScores} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
        <Radar
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip formatter={(value) => [`${Number(value)}%`, 'Score']} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
