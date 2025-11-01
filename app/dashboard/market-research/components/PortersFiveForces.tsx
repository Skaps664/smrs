"use client"

import { Shield, Users, TrendingDown, AlertTriangle, UserPlus } from "lucide-react"

interface PortersForcesData {
  competitiveRivalry: {
    level: string
    factors: string[]
    description: string
  }
  supplierPower: {
    level: string
    factors: string[]
    description: string
  }
  buyerPower: {
    level: string
    factors: string[]
    description: string
  }
  threatOfSubstitutes: {
    level: string
    factors: string[]
    description: string
  }
  threatOfNewEntrants: {
    level: string
    factors: string[]
    description: string
  }
}

interface PortersFiveForcesProps {
  data: PortersForcesData
  onChange: (data: PortersForcesData) => void
}

export default function PortersFiveForces({ data, onChange }: PortersFiveForcesProps) {
  const updateField = (force: keyof PortersForcesData, field: string, value: any) => {
    onChange({
      ...data,
      [force]: {
        ...data[force],
        [field]: value
      }
    })
  }

  const addFactor = (force: keyof PortersForcesData, value: string) => {
    if (!value.trim()) return
    onChange({
      ...data,
      [force]: {
        ...data[force],
        factors: [...data[force].factors, value.trim()]
      }
    })
  }

  const removeFactor = (force: keyof PortersForcesData, index: number) => {
    onChange({
      ...data,
      [force]: {
        ...data[force],
        factors: data[force].factors.filter((_, i) => i !== index)
      }
    })
  }

  const forces = [
    {
      key: 'competitiveRivalry' as keyof PortersForcesData,
      title: 'Competitive Rivalry',
      icon: Shield,
      color: 'red',
      description: 'Intensity of competition in your industry'
    },
    {
      key: 'supplierPower' as keyof PortersForcesData,
      title: 'Supplier Power',
      icon: Users,
      color: 'blue',
      description: 'Bargaining power of suppliers'
    },
    {
      key: 'buyerPower' as keyof PortersForcesData,
      title: 'Buyer Power',
      icon: TrendingDown,
      color: 'green',
      description: 'Bargaining power of customers'
    },
    {
      key: 'threatOfSubstitutes' as keyof PortersForcesData,
      title: 'Threat of Substitutes',
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Likelihood of alternative solutions'
    },
    {
      key: 'threatOfNewEntrants' as keyof PortersForcesData,
      title: 'Threat of New Entrants',
      icon: UserPlus,
      color: 'purple',
      description: 'Ease of new competitors entering'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Porter's Five Forces Analysis</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Analyze competitive forces that shape your industry and determine profitability potential
      </p>

      <div className="space-y-6">
        {forces.map((force) => (
          <div key={force.key} className={`border-2 border-${force.color}-200 rounded-xl p-5 bg-${force.color}-50`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 bg-${force.color}-500 rounded-lg`}>
                  <force.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold text-${force.color}-900`}>{force.title}</h3>
                  <p className={`text-xs text-${force.color}-700`}>{force.description}</p>
                </div>
              </div>
              <select
                value={data[force.key].level}
                onChange={(e) => updateField(force.key, 'level', e.target.value)}
                className={`px-3 py-1 border border-${force.color}-300 rounded-lg focus:ring-2 focus:ring-${force.color}-500 bg-white text-sm font-bold`}
              >
                <option value="">Level...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Key Factors
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id={`${force.key}-factor`}
                    placeholder="Add a factor influencing this force..."
                    className={`flex-1 px-3 py-2 border border-${force.color}-300 rounded-lg focus:ring-2 focus:ring-${force.color}-500 bg-white text-sm`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        addFactor(force.key, input.value)
                        input.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`${force.key}-factor`) as HTMLInputElement
                      addFactor(force.key, input.value)
                      input.value = ''
                    }}
                    className={`px-3 py-2 bg-${force.color}-600 text-white rounded-lg hover:bg-${force.color}-700 text-sm`}
                  >
                    +
                  </button>
                </div>
                <div className="space-y-1">
                  {data[force.key].factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-sm">
                      <span className="text-gray-700">• {factor}</span>
                      <button
                        onClick={() => removeFactor(force.key, idx)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Analysis & Impact
                </label>
                <textarea
                  value={data[force.key].description}
                  onChange={(e) => updateField(force.key, 'description', e.target.value)}
                  placeholder="Describe how this force affects your business..."
                  className={`w-full px-3 py-2 border border-${force.color}-300 rounded-lg focus:ring-2 focus:ring-${force.color}-500 bg-white text-sm`}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Porter's Five Forces Tips */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-indigo-900 mb-2">
          <strong>💡 Strategic Insight:</strong> Industries with high competitive rivalry, buyer power, supplier power, 
          threat of substitutes, and low barriers to entry tend to have lower profit margins.
        </p>
        <p className="text-xs text-indigo-800">
          Use this analysis to identify your industry's attractiveness and develop strategies to improve your competitive position.
        </p>
      </div>
    </div>
  )
}
