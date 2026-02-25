"use client"

import { Eye, Search, ShoppingCart, Heart, Megaphone } from "lucide-react"

interface JourneyStage {
  touchpoints: string[]
  customerActions: string[]
  painPoints: string[]
  opportunities: string[]
}

interface CustomerJourneyData {
  awareness: JourneyStage
  consideration: JourneyStage
  decision: JourneyStage
  retention: JourneyStage
  advocacy: JourneyStage
}

interface CustomerJourneyProps {
  data: CustomerJourneyData
  onChange: (data: CustomerJourneyData) => void
}

export default function CustomerJourneyMap({ data, onChange }: CustomerJourneyProps) {
  const addItem = (stage: keyof CustomerJourneyData, field: keyof JourneyStage, value: string) => {
    if (!value.trim()) return
    onChange({
      ...data,
      [stage]: {
        ...data[stage],
        [field]: [...data[stage][field], value.trim()]
      }
    })
  }

  const removeItem = (stage: keyof CustomerJourneyData, field: keyof JourneyStage, index: number) => {
    onChange({
      ...data,
      [stage]: {
        ...data[stage],
        [field]: data[stage][field].filter((_, i) => i !== index)
      }
    })
  }

  const stages = [
    {
      key: 'awareness' as keyof CustomerJourneyData,
      title: 'Awareness',
      icon: Eye,
      color: 'purple',
      description: 'Customer becomes aware of problem/need'
    },
    {
      key: 'consideration' as keyof CustomerJourneyData,
      title: 'Consideration',
      icon: Search,
      color: 'blue',
      description: 'Customer researches solutions'
    },
    {
      key: 'decision' as keyof CustomerJourneyData,
      title: 'Decision',
      icon: ShoppingCart,
      color: 'green',
      description: 'Customer decides to purchase'
    },
    {
      key: 'retention' as keyof CustomerJourneyData,
      title: 'Retention',
      icon: Heart,
      color: 'orange',
      description: 'Customer continues using product'
    },
    {
      key: 'advocacy' as keyof CustomerJourneyData,
      title: 'Advocacy',
      icon: Megaphone,
      color: 'pink',
      description: 'Customer recommends to others'
    }
  ]

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-teal-500/15 rounded-lg">
          <Eye className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-100">Customer Journey Map</h2>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Map the customer experience from first awareness to brand advocacy
      </p>

      <div className="space-y-6">
        {stages.map((stage, stageIdx) => (
          <div key={stage.key} className="relative">
            {/* Stage Header */}
            <div className={`bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-600 rounded-t-xl p-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a1a1a]/20 rounded-full flex items-center justify-center">
                  <stage.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-75">Stage {stageIdx + 1}</span>
                    <span className="text-2xl font-black">{stage.title}</span>
                  </div>
                  <p className="text-sm opacity-90">{stage.description}</p>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="border-2 border-gray-700 rounded-b-xl p-5 bg-[#111]">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Touchpoints */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    📍 Touchpoints
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id={`${stage.key}-touchpoints`}
                      placeholder="e.g., Google search, social media"
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a] text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement
                          addItem(stage.key, 'touchpoints', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`${stage.key}-touchpoints`) as HTMLInputElement
                        addItem(stage.key, 'touchpoints', input.value)
                        input.value = ''
                      }}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {data[stage.key].touchpoints.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-gray-700 text-sm">
                        <span className="text-gray-300">{item}</span>
                        <button
                          onClick={() => removeItem(stage.key, 'touchpoints', idx)}
                          className="text-red-500 hover:text-red-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Actions */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    🎯 Customer Actions
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id={`${stage.key}-actions`}
                      placeholder="e.g., Reads reviews, compares prices"
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a] text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement
                          addItem(stage.key, 'customerActions', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`${stage.key}-actions`) as HTMLInputElement
                        addItem(stage.key, 'customerActions', input.value)
                        input.value = ''
                      }}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {data[stage.key].customerActions.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-gray-700 text-sm">
                        <span className="text-gray-300">{item}</span>
                        <button
                          onClick={() => removeItem(stage.key, 'customerActions', idx)}
                          className="text-red-500 hover:text-red-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pain Points */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    ⚠️ Pain Points
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id={`${stage.key}-pains`}
                      placeholder="e.g., Too many options, confusing"
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a] text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement
                          addItem(stage.key, 'painPoints', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`${stage.key}-pains`) as HTMLInputElement
                        addItem(stage.key, 'painPoints', input.value)
                        input.value = ''
                      }}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {data[stage.key].painPoints.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-gray-700 text-sm">
                        <span className="text-gray-300">{item}</span>
                        <button
                          onClick={() => removeItem(stage.key, 'painPoints', idx)}
                          className="text-red-500 hover:text-red-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    💡 Opportunities
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id={`${stage.key}-opps`}
                      placeholder="e.g., Simplify onboarding, add chat"
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-[#1a1a1a] text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement
                          addItem(stage.key, 'opportunities', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`${stage.key}-opps`) as HTMLInputElement
                        addItem(stage.key, 'opportunities', input.value)
                        input.value = ''
                      }}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {data[stage.key].opportunities.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded border border-gray-700 text-sm">
                        <span className="text-gray-300">{item}</span>
                        <button
                          onClick={() => removeItem(stage.key, 'opportunities', idx)}
                          className="text-red-500 hover:text-red-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow to next stage */}
            {stageIdx < stages.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="text-gray-400 text-2xl">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Customer Journey Tips */}
      <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
        <p className="text-sm text-teal-200">
          <strong>💡 Pro Tip:</strong> Identify pain points at each stage and design solutions to remove friction. 
          Great customer experiences drive retention and turn customers into advocates who bring in new business.
        </p>
      </div>
    </div>
  )
}
