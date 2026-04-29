'use client'

import { ScoringResult, TIER_CONFIG } from '@/lib/scoring'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  results: ScoringResult[]
}

export default function ScoringComparison({ results }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Scoring Method Comparison</h3>
        <p className="text-sm text-blue-800">
          Different scoring methods can provide varying perspectives. This comparison shows how the same responses are interpreted using different standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result) => {
          const tierConfig = TIER_CONFIG[result.tier]
          return (
            <div
              key={result.method}
              className={`rounded-lg border-2 p-6 ${tierConfig.bg} ${tierConfig.border}`}
            >
              <h3 className="font-semibold text-gray-900 mb-4">{result.label}</h3>

              {/* Score Display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">{result.totalScore}</span>
                  <span className="text-sm text-gray-600">/100</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${result.totalScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Thresholds */}
              <div className="mb-4 p-3 bg-white bg-opacity-50 rounded text-xs text-gray-700 space-y-1">
                <div>No indicators: &lt; {result.thresholds.low}</div>
                <div>Some indicators: {result.thresholds.low}-{result.thresholds.high - 1}</div>
                <div>Strong indicators: ≥ {result.thresholds.high}</div>
              </div>

              {/* Tier Badge */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${tierConfig.bg}`}>
                {result.tier === 'no_indicators' ? (
                  <CheckCircle className={`w-5 h-5 ${tierConfig.color}`} />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${tierConfig.color}`} />
                )}
                <span className={`font-semibold text-sm ${tierConfig.color}`}>
                  {tierConfig.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Domain Scores Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Domain Scores Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Domain</th>
                {results.map((result) => (
                  <th
                    key={result.method}
                    className="text-right px-4 py-3 font-semibold text-gray-700"
                  >
                    {result.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results[0]?.domainScores.map((domainScore) => (
                <tr key={domainScore.domain} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{domainScore.label}</td>
                  {results.map((result) => {
                    const score = result.domainScores.find(
                      (d) => d.domain === domainScore.domain
                    )?.score || 0
                    return (
                      <td key={result.method} className="text-right px-4 py-3 text-gray-900">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${score}%`,
                                backgroundColor: domainScore.color,
                              }}
                            />
                          </div>
                          <span className="w-10 text-right font-semibold">{score}%</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
