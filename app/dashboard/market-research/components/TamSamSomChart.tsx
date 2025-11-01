"use client"

interface TamSamSomChartProps {
  tam: number
  sam: number
  som: number
}

export default function TamSamSomChart({ tam, sam, som }: TamSamSomChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`
    }
    return `$${value}`
  }

  // Calculate percentages for positioning
  const tamRadius = 180
  const samRadius = tam > 0 ? Math.sqrt(sam / tam) * tamRadius : 120
  const somRadius = tam > 0 ? Math.sqrt(som / tam) * tamRadius : 60

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-lg">
        {/* TAM Circle (Outer) */}
        <circle
          cx="200"
          cy="200"
          r={tamRadius}
          fill="#FED7AA"
          stroke="#FB923C"
          strokeWidth="3"
          opacity="0.6"
        />
        <text
          x="200"
          y="40"
          textAnchor="middle"
          className="text-sm font-bold fill-orange-700"
        >
          TAM
        </text>
        <text
          x="200"
          y="60"
          textAnchor="middle"
          className="text-xl font-black fill-orange-800"
        >
          {formatValue(tam)}
        </text>

        {/* SAM Circle (Middle) */}
        <circle
          cx="200"
          cy="200"
          r={samRadius}
          fill="#FCD34D"
          stroke="#F59E0B"
          strokeWidth="3"
          opacity="0.7"
        />
        <text
          x="200"
          y="200"
          textAnchor="middle"
          className="text-sm font-bold fill-amber-800"
        >
          SAM
        </text>
        <text
          x="200"
          y="220"
          textAnchor="middle"
          className="text-lg font-black fill-amber-900"
        >
          {formatValue(sam)}
        </text>

        {/* SOM Circle (Inner) */}
        <circle
          cx="200"
          cy="200"
          r={somRadius}
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="3"
          opacity="0.9"
        />
        <text
          x="200"
          y="270"
          textAnchor="middle"
          className="text-sm font-bold fill-yellow-900"
        >
          SOM
        </text>
        <text
          x="200"
          y="290"
          textAnchor="middle"
          className="text-base font-black fill-yellow-950"
        >
          {formatValue(som)}
        </text>

        {/* Percentage labels */}
        {tam > 0 && sam > 0 && (
          <text
            x="320"
            y="150"
            textAnchor="start"
            className="text-xs fill-amber-700"
          >
            {((sam / tam) * 100).toFixed(1)}% of TAM
          </text>
        )}
        {sam > 0 && som > 0 && (
          <text
            x="320"
            y="250"
            textAnchor="start"
            className="text-xs fill-yellow-700"
          >
            {((som / sam) * 100).toFixed(1)}% of SAM
          </text>
        )}
      </svg>
    </div>
  )
}
