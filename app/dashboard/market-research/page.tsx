"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, Save, Plus, Trash2, Info, ExternalLink, 
  Users, MapPin, DollarSign, Target, AlertCircle, Lightbulb,
  BarChart3, PieChart, Globe
} from "lucide-react"
import TamSamSomChart from "./components/TamSamSomChart"
import SwotAnalysis from "./components/SwotAnalysis"
import FourPsMarketing from "./components/FourPsMarketing"
import PortersFiveForces from "./components/PortersFiveForces"
import CustomerJourneyMap from "./components/CustomerJourneyMap"

interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface MarketResearchData {
  id?: string
  title: string
  tam: { value: number; currency: string; description: string }
  sam: { value: number; currency: string; description: string }
  som: { value: number; currency: string; description: string }
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  fourPs: {
    product: {
      description: string
      features: string[]
      benefits: string[]
      differentiation: string
    }
    price: {
      strategy: string
      pricePoint: string
      costStructure: string
      competitorPricing: string
    }
    place: {
      channels: string[]
      distribution: string
      coverage: string
      locations: string[]
    }
    promotion: {
      strategies: string[]
      budget: string
      channels: string[]
      messaging: string
    }
  }
  portersForces: {
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
  customerJourney: {
    awareness: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    consideration: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    decision: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    retention: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    advocacy: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
  }
  targetAudience: {
    segments: string[]
    ageRanges: string[]
    genders: string[]
    locations: string[]
    industries: string[]
    incomeLevels: string[]
    behaviors: string[]
    painPoints: string[]
    personas: Array<{
      name: string
      description: string
      demographics: string
      goals: string
    }>
  }
  competitorAnalysis: {
    directCompetitors: string[]
    indirectCompetitors: string[]
    marketGaps: string[]
  }
  marketTrends: string[]
  dataSources: string[]
  lastUpdated: string
}

const defaultData: MarketResearchData = {
  title: "New Market Research",
  tam: { value: 0, currency: "USD", description: "Total Addressable Market" },
  sam: { value: 0, currency: "USD", description: "Serviceable Available Market" },
  som: { value: 0, currency: "USD", description: "Serviceable Obtainable Market" },
  swot: {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  },
  fourPs: {
    product: {
      description: "",
      features: [],
      benefits: [],
      differentiation: ""
    },
    price: {
      strategy: "",
      pricePoint: "",
      costStructure: "",
      competitorPricing: ""
    },
    place: {
      channels: [],
      distribution: "",
      coverage: "",
      locations: []
    },
    promotion: {
      strategies: [],
      budget: "",
      channels: [],
      messaging: ""
    }
  },
  portersForces: {
    competitiveRivalry: { level: "", factors: [], description: "" },
    supplierPower: { level: "", factors: [], description: "" },
    buyerPower: { level: "", factors: [], description: "" },
    threatOfSubstitutes: { level: "", factors: [], description: "" },
    threatOfNewEntrants: { level: "", factors: [], description: "" }
  },
  customerJourney: {
    awareness: { touchpoints: [], customerActions: [], painPoints: [], opportunities: [] },
    consideration: { touchpoints: [], customerActions: [], painPoints: [], opportunities: [] },
    decision: { touchpoints: [], customerActions: [], painPoints: [], opportunities: [] },
    retention: { touchpoints: [], customerActions: [], painPoints: [], opportunities: [] },
    advocacy: { touchpoints: [], customerActions: [], painPoints: [], opportunities: [] }
  },
  targetAudience: {
    segments: [],
    ageRanges: [],
    genders: [],
    locations: [],
    industries: [],
    incomeLevels: [],
    behaviors: [],
    painPoints: [],
    personas: []
  },
  competitorAnalysis: {
    directCompetitors: [],
    indirectCompetitors: [],
    marketGaps: []
  },
  marketTrends: [],
  dataSources: [],
  lastUpdated: new Date().toISOString()
}

export default function MarketResearchPage() {
  const [data, setData] = useState<MarketResearchData>(defaultData)
  const [savedResearches, setSavedResearches] = useState<MarketResearchData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTips, setShowTips] = useState(true)

  // Load saved researches
  useEffect(() => {
    loadSavedResearches()
  }, [])

  const loadSavedResearches = async () => {
    try {
      const response = await fetch("/api/market-research")
      if (response.ok) {
        const researches = await response.json()
        setSavedResearches(researches)
      }
    } catch (error) {
      console.error("Failed to load researches:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const method = selectedId ? "PUT" : "POST"
      const url = selectedId 
        ? `/api/market-research?id=${selectedId}` 
        : "/api/market-research"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lastUpdated: new Date().toISOString() })
      })

      if (response.ok) {
        const saved = await response.json()
        setSelectedId(saved.id)
        await loadSavedResearches()
        alert("Market research saved successfully!")
      }
    } catch (error) {
      console.error("Failed to save:", error)
      alert("Failed to save market research")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research?")) return
    
    try {
      await fetch(`/api/market-research?id=${id}`, { method: "DELETE" })
      await loadSavedResearches()
      if (selectedId === id) {
        setData(defaultData)
        setSelectedId(null)
      }
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const handleLoad = (research: MarketResearchData) => {
    setData(research)
    setSelectedId(research.id || null)
  }

  const handleNew = () => {
    setData(defaultData)
    setSelectedId(null)
  }

  const addArrayItem = (path: string[], value: string) => {
    if (!value.trim()) return
    
    setData(prev => {
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      
      const key = path[path.length - 1]
      if (Array.isArray(current[key])) {
        current[key] = [...current[key], value.trim()]
      }
      
      return newData
    })
  }

  const removeArrayItem = (path: string[], index: number) => {
    setData(prev => {
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      
      const key = path[path.length - 1]
      if (Array.isArray(current[key])) {
        current[key] = current[key].filter((_: any, i: number) => i !== index)
      }
      
      return newData
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/15 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Market Research</h1>
              <p className="text-sm text-gray-400">Comprehensive market analysis and target audience insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNew}
              className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-[#111] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Research
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Research"}
            </button>
          </div>
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Research Title (e.g., Q1 2025 Market Analysis)"
          className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Saved Researches */}
      {savedResearches.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-4">Saved Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResearches.map((research) => (
              <div
                key={research.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedId === research.id
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 hover:border-orange-300"
                }`}
                onClick={() => handleLoad(research)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-100">{research.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(research.id!)
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Updated: {new Date(research.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips & Resources */}
      {showTips && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border-2 border-orange-500/30 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-100">Market Research Tips & Resources</h2>
            </div>
            <button onClick={() => setShowTips(false)} className="text-gray-400 hover:text-gray-400">
              ×
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-100 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-600" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Use multiple data sources to validate your findings</li>
                <li>• Interview at least 20-50 potential customers</li>
                <li>• Review competitor pricing and positioning</li>
                <li>• Track market trends quarterly</li>
                <li>• Define clear customer personas with real data</li>
                <li>• Calculate TAM using bottom-up and top-down approaches</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-100 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-orange-600" />
                Recommended Data Sources
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <a href="https://www.statista.com" target="_blank" className="text-orange-600 hover:underline">Statista</a> - Market statistics & industry reports</li>
                <li>• <a href="https://data.worldbank.org" target="_blank" className="text-orange-600 hover:underline">World Bank</a> - Global economic data</li>
                <li>• <a href="https://www.cbinsights.com" target="_blank" className="text-orange-600 hover:underline">CB Insights</a> - Tech market intelligence</li>
                <li>• <a href="https://www.gartner.com" target="_blank" className="text-orange-600 hover:underline">Gartner</a> - IT market research</li>
                <li>• <a href="https://www.census.gov" target="_blank" className="text-orange-600 hover:underline">US Census Bureau</a> - Demographics & economic data</li>
                <li>• <a href="https://trends.google.com" target="_blank" className="text-orange-600 hover:underline">Google Trends</a> - Search trends analysis</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAM/SAM/SOM Section */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-100">TAM / SAM / SOM Analysis</h2>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 top-6 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-bold mb-2">Market Sizing Framework:</p>
              <p><strong>TAM (Total Addressable Market):</strong> Total market demand for your product/service</p>
              <p className="mt-1"><strong>SAM (Serviceable Available Market):</strong> Portion of TAM you can reach with your business model</p>
              <p className="mt-1"><strong>SOM (Serviceable Obtainable Market):</strong> Realistic market share you can capture in near term</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div>
            <TamSamSomChart
              tam={data.tam.value}
              sam={data.sam.value}
              som={data.som.value}
            />
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            {/* TAM */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Total Addressable Market (TAM)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={data.tam.value || ""}
                  onChange={(e) => setData({ 
                    ...data, 
                    tam: { ...data.tam, value: parseFloat(e.target.value) || 0 } 
                  })}
                  placeholder="e.g., 50000000000"
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={data.tam.currency}
                  onChange={(e) => setData({ 
                    ...data, 
                    tam: { ...data.tam, currency: e.target.value } 
                  })}
                  className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <textarea
                value={data.tam.description}
                onChange={(e) => setData({ 
                  ...data, 
                  tam: { ...data.tam, description: e.target.value } 
                })}
                placeholder="Describe how you calculated TAM..."
                className="w-full mt-2 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={2}
              />
            </div>

            {/* SAM */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Serviceable Available Market (SAM)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={data.sam.value || ""}
                  onChange={(e) => setData({ 
                    ...data, 
                    sam: { ...data.sam, value: parseFloat(e.target.value) || 0 } 
                  })}
                  placeholder="e.g., 5000000000"
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={data.sam.currency}
                  onChange={(e) => setData({ 
                    ...data, 
                    sam: { ...data.sam, currency: e.target.value } 
                  })}
                  className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <textarea
                value={data.sam.description}
                onChange={(e) => setData({ 
                  ...data, 
                  sam: { ...data.sam, description: e.target.value } 
                })}
                placeholder="Describe your serviceable market..."
                className="w-full mt-2 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={2}
              />
            </div>

            {/* SOM */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Serviceable Obtainable Market (SOM)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={data.som.value || ""}
                  onChange={(e) => setData({ 
                    ...data, 
                    som: { ...data.som, value: parseFloat(e.target.value) || 0 } 
                  })}
                  placeholder="e.g., 500000000"
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={data.som.currency}
                  onChange={(e) => setData({ 
                    ...data, 
                    som: { ...data.som, currency: e.target.value } 
                  })}
                  className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <textarea
                value={data.som.description}
                onChange={(e) => setData({ 
                    ...data, 
                    som: { ...data.som, description: e.target.value } 
                })}
                placeholder="Describe your realistic market capture..."
                className="w-full mt-2 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Analysis */}
      <SwotAnalysis
        swot={data.swot}
        onChange={(newSwot: SwotData) => setData({ ...data, swot: newSwot })}
      />

      {/* Four P's Marketing Mix */}
      <FourPsMarketing
        data={data.fourPs}
        onChange={(newFourPs) => setData({ ...data, fourPs: newFourPs })}
      />

      {/* Porter's Five Forces */}
      <PortersFiveForces
        data={data.portersForces}
        onChange={(newForces) => setData({ ...data, portersForces: newForces })}
      />

      {/* Customer Journey Map */}
      <CustomerJourneyMap
        data={data.customerJourney}
        onChange={(newJourney) => setData({ ...data, customerJourney: newJourney })}
      />

      {/* Target Audience Section */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-100">Target Audience & Demographics</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Segments */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Customer Segments
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="segment-input"
                placeholder="e.g., Small business owners"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "segments"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("segment-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "segments"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.segments.map((segment, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{segment}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "segments"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Age Ranges */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Age Ranges
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="age-input"
                placeholder="e.g., 25-34"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "ageRanges"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("age-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "ageRanges"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.ageRanges.map((range, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{range}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "ageRanges"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Genders */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Gender Distribution
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="gender-input"
                placeholder="e.g., All genders, 60% Female, 40% Male"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "genders"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("gender-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "genders"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.genders.map((gender, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{gender}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "genders"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Geographic Locations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="location-input"
                placeholder="e.g., United States, Urban areas"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "locations"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("location-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "locations"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.locations.map((location, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{location}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "locations"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Target Industries
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="industry-input"
                placeholder="e.g., Technology, Healthcare"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "industries"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("industry-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "industries"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.industries.map((industry, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{industry}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "industries"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Income Levels */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              Income Levels
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="income-input"
                placeholder="e.g., $50k-$100k, High net worth"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "incomeLevels"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("income-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "incomeLevels"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.incomeLevels.map((level, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{level}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "incomeLevels"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Behaviors */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Customer Behaviors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="behavior-input"
                placeholder="e.g., Online shoppers, Early adopters"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "behaviors"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("behavior-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "behaviors"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.behaviors.map((behavior, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{behavior}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "behaviors"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Pain Points
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="pain-input"
                placeholder="e.g., Time-consuming processes"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["targetAudience", "painPoints"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("pain-input") as HTMLInputElement
                  addArrayItem(["targetAudience", "painPoints"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.targetAudience.painPoints.map((pain, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{pain}</span>
                  <button
                    onClick={() => removeArrayItem(["targetAudience", "painPoints"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-100">Competitor Analysis</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Direct Competitors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="direct-comp-input"
                placeholder="Company name"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["competitorAnalysis", "directCompetitors"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("direct-comp-input") as HTMLInputElement
                  addArrayItem(["competitorAnalysis", "directCompetitors"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.competitorAnalysis.directCompetitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{comp}</span>
                  <button
                    onClick={() => removeArrayItem(["competitorAnalysis", "directCompetitors"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Indirect Competitors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="indirect-comp-input"
                placeholder="Company name"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["competitorAnalysis", "indirectCompetitors"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("indirect-comp-input") as HTMLInputElement
                  addArrayItem(["competitorAnalysis", "indirectCompetitors"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.competitorAnalysis.indirectCompetitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{comp}</span>
                  <button
                    onClick={() => removeArrayItem(["competitorAnalysis", "indirectCompetitors"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Market Gaps / Opportunities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="gap-input"
                placeholder="Unmet need"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement
                    addArrayItem(["competitorAnalysis", "marketGaps"], input.value)
                    input.value = ""
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("gap-input") as HTMLInputElement
                  addArrayItem(["competitorAnalysis", "marketGaps"], input.value)
                  input.value = ""
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {data.competitorAnalysis.marketGaps.map((gap, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#111] rounded-lg">
                  <span className="text-sm text-gray-300">{gap}</span>
                  <button
                    onClick={() => removeArrayItem(["competitorAnalysis", "marketGaps"], idx)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-100">Market Trends</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            id="trend-input"
            placeholder="e.g., Growing demand for AI-powered solutions"
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const input = e.target as HTMLInputElement
                addArrayItem(["marketTrends"], input.value)
                input.value = ""
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById("trend-input") as HTMLInputElement
              addArrayItem(["marketTrends"], input.value)
              input.value = ""
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {data.marketTrends.map((trend, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
              <span className="text-sm text-gray-300">{trend}</span>
              <button
                onClick={() => removeArrayItem(["marketTrends"], idx)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-100">Data Sources & References</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            id="source-input"
            placeholder="e.g., Statista - SaaS Market Report 2025"
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const input = e.target as HTMLInputElement
                addArrayItem(["dataSources"], input.value)
                input.value = ""
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById("source-input") as HTMLInputElement
              addArrayItem(["dataSources"], input.value)
              input.value = ""
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {data.dataSources.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
              <span className="text-sm text-gray-300">{source}</span>
              <button
                onClick={() => removeArrayItem(["dataSources"], idx)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-lg font-bold"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "Saving..." : "Save Market Research"}
        </button>
      </div>
    </div>
  )
}
