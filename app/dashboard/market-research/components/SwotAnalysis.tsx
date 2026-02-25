"use client"

import { Plus, Trash2, TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface SwotAnalysisProps {
  swot: SwotData
  onChange: (swot: SwotData) => void
}

export default function SwotAnalysis({ swot, onChange }: SwotAnalysisProps) {
  const [inputs, setInputs] = useState({
    strength: "",
    weakness: "",
    opportunity: "",
    threat: ""
  })

  const addItem = (category: keyof SwotData, value: string) => {
    if (!value.trim()) return
    onChange({
      ...swot,
      [category]: [...swot[category], value.trim()]
    })
    setInputs({ ...inputs, [category.slice(0, -1)] : "" })
  }

  const removeItem = (category: keyof SwotData, index: number) => {
    onChange({
      ...swot,
      [category]: swot[category].filter((_, i) => i !== index)
    })
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-bold text-gray-100">SWOT Analysis</h2>
        <div className="group relative">
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs text-gray-400 cursor-help">
            ?
          </div>
          <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <p><strong>Strengths:</strong> Internal positive attributes</p>
            <p><strong>Weaknesses:</strong> Internal limitations</p>
            <p><strong>Opportunities:</strong> External favorable conditions</p>
            <p><strong>Threats:</strong> External challenges</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="border-2 border-green-500/30 rounded-xl p-5 bg-green-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-200">Strengths</h3>
          </div>
          <p className="text-xs text-green-400 mb-3">Internal advantages & core competencies</p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputs.strength}
              onChange={(e) => setInputs({ ...inputs, strength: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addItem("strengths", inputs.strength)
                }
              }}
              placeholder="e.g., Strong technical team"
              className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-[#1a1a1a]"
            />
            <button
              onClick={() => addItem("strengths", inputs.strength)}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {swot.strengths.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-[#1a1a1a] rounded-lg border border-green-500/30">
                <span className="text-sm text-gray-300 flex-1">• {item}</span>
                <button
                  onClick={() => removeItem("strengths", idx)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="border-2 border-red-500/30 rounded-xl p-5 bg-red-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-red-200">Weaknesses</h3>
          </div>
          <p className="text-xs text-red-400 mb-3">Internal limitations & areas for improvement</p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputs.weakness}
              onChange={(e) => setInputs({ ...inputs, weakness: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addItem("weaknesses", inputs.weakness)
                }
              }}
              placeholder="e.g., Limited marketing budget"
              className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-[#1a1a1a]"
            />
            <button
              onClick={() => addItem("weaknesses", inputs.weakness)}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {swot.weaknesses.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-[#1a1a1a] rounded-lg border border-red-500/30">
                <span className="text-sm text-gray-300 flex-1">• {item}</span>
                <button
                  onClick={() => removeItem("weaknesses", idx)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="border-2 border-blue-500/30 rounded-xl p-5 bg-blue-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-200">Opportunities</h3>
          </div>
          <p className="text-xs text-blue-400 mb-3">External factors to leverage for growth</p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputs.opportunity}
              onChange={(e) => setInputs({ ...inputs, opportunity: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addItem("opportunities", inputs.opportunity)
                }
              }}
              placeholder="e.g., Growing market demand"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-[#1a1a1a]"
            />
            <button
              onClick={() => addItem("opportunities", inputs.opportunity)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {swot.opportunities.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-[#1a1a1a] rounded-lg border border-blue-500/30">
                <span className="text-sm text-gray-300 flex-1">• {item}</span>
                <button
                  onClick={() => removeItem("opportunities", idx)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Threats */}
        <div className="border-2 border-yellow-500/30 rounded-xl p-5 bg-yellow-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-yellow-200">Threats</h3>
          </div>
          <p className="text-xs text-yellow-400 mb-3">External challenges & potential risks</p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputs.threat}
              onChange={(e) => setInputs({ ...inputs, threat: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addItem("threats", inputs.threat)
                }
              }}
              placeholder="e.g., New competitors entering"
              className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-[#1a1a1a]"
            />
            <button
              onClick={() => addItem("threats", inputs.threat)}
              className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {swot.threats.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-[#1a1a1a] rounded-lg border border-yellow-500/30">
                <span className="text-sm text-gray-300 flex-1">• {item}</span>
                <button
                  onClick={() => removeItem("threats", idx)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-sm text-amber-200">
          <strong>💡 Tip:</strong> Use SWOT to develop strategies: leverage strengths to capitalize on opportunities, 
          use strengths to mitigate threats, improve weaknesses to seize opportunities, and minimize weaknesses to avoid threats.
        </p>
      </div>
    </div>
  )
}
