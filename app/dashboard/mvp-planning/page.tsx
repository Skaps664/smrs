"use client"

import { useState, useEffect } from "react"
import { Rocket, Save, Plus, Trash2, CheckCircle2, Circle, AlertCircle, Lightbulb, Target, TrendingUp, Users, Zap, Clock, DollarSign, BarChart3 } from "lucide-react"
import { useReadOnly } from "@/contexts/ReadOnlyContext"

interface MVPFeature {
  id: string
  name: string
  description: string
  priority: "Must Have" | "Should Have" | "Could Have" | "Won't Have"
  effort: "Low" | "Medium" | "High"
  impact: "Low" | "Medium" | "High"
  status: "Planned" | "In Progress" | "Completed" | "Dropped"
}

interface MVPHypothesis {
  id: string
  assumption: string
  testMethod: string
  successCriteria: string
  result?: string
}

interface MVPData {
  id?: string
  title: string
  mvpType: string
  coreValue: string
  targetCustomer: string
  problemStatement: string
  proposedSolution: string
  features: MVPFeature[]
  hypotheses: MVPHypothesis[]
  successMetrics: {
    metric: string
    target: string
    timeframe: string
  }[]
  budget: {
    estimated: string
    breakdown: { category: string; amount: string }[]
  }
  timeline: {
    phase: string
    duration: string
    deliverables: string
  }[]
  risks: string[]
  learningGoals: string[]
  nextSteps: string[]
  lastUpdated: string
}

const defaultData: MVPData = {
  title: "New MVP Plan",
  mvpType: "",
  coreValue: "",
  targetCustomer: "",
  problemStatement: "",
  proposedSolution: "",
  features: [],
  hypotheses: [],
  successMetrics: [],
  budget: {
    estimated: "",
    breakdown: []
  },
  timeline: [],
  risks: [],
  learningGoals: [],
  nextSteps: [],
  lastUpdated: new Date().toISOString()
}

export default function MVPPlanningPage() {
  const { viewingStartupId, isReadOnly } = useReadOnly()
  const [data, setData] = useState<MVPData>(defaultData)
  const [savedPlans, setSavedPlans] = useState<MVPData[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [viewingStartupId])

  const loadPlans = async () => {
    try {
      const url = viewingStartupId
        ? `/api/mvp-planning?startupId=${viewingStartupId}`
        : `/api/mvp-planning`
      const response = await fetch(url)
      if (response.ok) {
        const plans = await response.json()
        setSavedPlans(plans)
        if (plans.length > 0 && !isEditing) {
          setData(plans[0])
        }
      }
    } catch (error) {
      console.error("Error loading MVP plans:", error)
    }
  }

  const savePlan = async () => {
    setIsSaving(true)
    try {
      const method = data.id ? "PUT" : "POST"

      const payload = viewingStartupId
        ? { ...data, startupId: viewingStartupId, lastUpdated: new Date().toISOString() }
        : { ...data, lastUpdated: new Date().toISOString() }

      const response = await fetch("/api/mvp-planning", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await loadPlans()
        setIsEditing(false)
        alert("MVP plan saved successfully!")
      }
    } catch (error) {
      console.error("Error saving MVP plan:", error)
      alert("Error saving MVP plan")
    } finally {
      setIsSaving(false)
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this MVP plan?")) return

    try {
      const response = await fetch(`/api/mvp-planning?id=${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        await loadPlans()
        if (data.id === id) {
          setData(defaultData)
        }
      }
    } catch (error) {
      console.error("Error deleting MVP plan:", error)
    }
  }

  const addFeature = () => {
    const newFeature: MVPFeature = {
      id: Date.now().toString(),
      name: "",
      description: "",
      priority: "Must Have",
      effort: "Medium",
      impact: "Medium",
      status: "Planned"
    }
    setData({ ...data, features: [...data.features, newFeature] })
  }

  const updateFeature = (id: string, field: keyof MVPFeature, value: any) => {
    setData({
      ...data,
      features: data.features.map(f => f.id === id ? { ...f, [field]: value } : f)
    })
  }

  const removeFeature = (id: string) => {
    setData({ ...data, features: data.features.filter(f => f.id !== id) })
  }

  const addHypothesis = () => {
    const newHypothesis: MVPHypothesis = {
      id: Date.now().toString(),
      assumption: "",
      testMethod: "",
      successCriteria: "",
      result: ""
    }
    setData({ ...data, hypotheses: [...data.hypotheses, newHypothesis] })
  }

  const updateHypothesis = (id: string, field: keyof MVPHypothesis, value: string) => {
    setData({
      ...data,
      hypotheses: data.hypotheses.map(h => h.id === id ? { ...h, [field]: value } : h)
    })
  }

  const removeHypothesis = (id: string) => {
    setData({ ...data, hypotheses: data.hypotheses.filter(h => h.id !== id) })
  }

  const priorityColors = {
    "Must Have": "bg-red-500/15 text-red-300 border-red-300",
    "Should Have": "bg-orange-500/15 text-orange-300 border-orange-300",
    "Could Have": "bg-yellow-500/15 text-yellow-300 border-yellow-300",
    "Won't Have": "bg-[#141414] text-gray-200 border-gray-600"
  }

  const effortColors = {
    "Low": "bg-green-500/15 text-green-300",
    "Medium": "bg-yellow-500/15 text-yellow-300",
    "High": "bg-red-500/15 text-red-300"
  }

  const impactColors = {
    "Low": "bg-[#141414] text-gray-200",
    "Medium": "bg-amber-500/15 text-amber-300",
    "High": "bg-orange-500/15 text-orange-300"
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-gray-100">
            <Rocket className="w-8 h-8 mr-3 text-orange-600" />
            MVP Planning & Strategy
          </h1>
          <p className="text-gray-400 mt-2">
            Build your Minimum Viable Product with proven methodologies from Lean Startup, Y Combinator, and industry leaders
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setData(defaultData)
              setIsEditing(true)
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
          <button
            onClick={savePlan}
            disabled={isSaving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </div>

      {/* MVP Education Section */}
      <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl shadow-sm border-2 border-orange-500/30 p-6">
        <h2 className="text-xl font-bold text-orange-200 mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          What is an MVP?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-orange-200 mb-2">Definition (Eric Ries - Lean Startup)</h3>
            <p className="text-gray-300">
              "The Minimum Viable Product is that version of a new product which allows a team to collect the maximum amount
              of validated learning about customers with the least effort."
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-orange-200 mb-2">Y Combinator Perspective</h3>
            <p className="text-gray-300">
              "Build something people want. Talk to users, iterate quickly, and focus on solving a real problem for a small
              group of people rather than building everything for everyone."
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-orange-600 mr-2" />
              <h4 className="font-semibold text-gray-100">Core Purpose</h4>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Test assumptions quickly</li>
              <li>• Minimize wasted resources</li>
              <li>• Learn from real users</li>
              <li>• Validate product-market fit</li>
            </ul>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-gray-100">Key Principles</h4>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Focus on core value proposition</li>
              <li>• Build-Measure-Learn loop</li>
              <li>• Fail fast, iterate faster</li>
              <li>• Data-driven decisions</li>
            </ul>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h4 className="font-semibold text-gray-100">Common Mistakes</h4>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Building too many features</li>
              <li>• Not talking to users</li>
              <li>• Perfectionism over shipping</li>
              <li>• Ignoring metrics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Saved Plans */}
      {savedPlans.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-4">
          <h3 className="font-semibold text-gray-100 mb-3">Your MVP Plans</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {savedPlans.map(plan => (
              <div
                key={plan.id}
                className="border rounded-lg p-3 hover:border-orange-500 cursor-pointer transition-colors"
                onClick={() => {
                  setData(plan)
                  setIsEditing(false)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-100">{plan.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{plan.mvpType}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(plan.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePlan(plan.id!)
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MVP Plan Details */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                MVP Plan Title *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Social Media Analytics MVP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                MVP Type
              </label>
              <select
                value={data.mvpType}
                onChange={(e) => setData({ ...data, mvpType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Type</option>
                <option value="Landing Page MVP">Landing Page MVP (Pre-launch validation)</option>
                <option value="Concierge MVP">Concierge MVP (Manual service)</option>
                <option value="Wizard of Oz MVP">Wizard of Oz MVP (Fake backend)</option>
                <option value="Piecemeal MVP">Piecemeal MVP (Existing tools)</option>
                <option value="Single Feature MVP">Single Feature MVP (Core functionality)</option>
                <option value="Prototype MVP">Prototype MVP (Clickable demo)</option>
                <option value="Explainer Video MVP">Explainer Video MVP (Dropbox style)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Core Value Proposition *
            </label>
            <textarea
              value={data.coreValue}
              onChange={(e) => setData({ ...data, coreValue: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={2}
              placeholder="What is the single most important value your MVP provides?"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Customer Segment
              </label>
              <input
                type="text"
                value={data.targetCustomer}
                onChange={(e) => setData({ ...data, targetCustomer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Small business owners in e-commerce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problem Statement
              </label>
              <input
                type="text"
                value={data.problemStatement}
                onChange={(e) => setData({ ...data, problemStatement: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="What specific problem does this solve?"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposed Solution
            </label>
            <textarea
              value={data.proposedSolution}
              onChange={(e) => setData({ ...data, proposedSolution: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="How will your MVP solve this problem?"
            />
          </div>
        </div>

        {/* Feature Prioritization (MoSCoW Method) */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-100">Feature Prioritization (MoSCoW Method)</h2>
              <p className="text-sm text-gray-400 mt-1">
                Prioritize features: Must Have (critical), Should Have (important), Could Have (nice to have), Won't Have (not now)
              </p>
            </div>
            <button
              onClick={addFeature}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {data.features.map(feature => (
              <div key={feature.id} className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="grid md:grid-cols-12 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Feature Name</label>
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => updateFeature(feature.id, "name", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="e.g., User login"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Priority</label>
                    <select
                      value={feature.priority}
                      onChange={(e) => updateFeature(feature.id, "priority", e.target.value)}
                      className={`w-full px-2 py-2 border rounded text-xs font-medium ${priorityColors[feature.priority]}`}
                    >
                      <option value="Must Have">Must Have</option>
                      <option value="Should Have">Should Have</option>
                      <option value="Could Have">Could Have</option>
                      <option value="Won't Have">Won't Have</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Effort</label>
                    <select
                      value={feature.effort}
                      onChange={(e) => updateFeature(feature.id, "effort", e.target.value)}
                      className={`w-full px-2 py-2 border rounded text-xs font-medium ${effortColors[feature.effort]}`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Med</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Impact</label>
                    <select
                      value={feature.impact}
                      onChange={(e) => updateFeature(feature.id, "impact", e.target.value)}
                      className={`w-full px-2 py-2 border rounded text-xs font-medium ${impactColors[feature.impact]}`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Med</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      onClick={() => removeFeature(feature.id)}
                      className="text-red-500 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.features.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Rocket className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No features added yet. Click "Add Feature" to start.</p>
            </div>
          )}
        </div>

        {/* Hypotheses & Validation (Build-Measure-Learn) */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-100">Hypotheses & Validation</h2>
              <p className="text-sm text-gray-400 mt-1">
                Build-Measure-Learn cycle: Define assumptions, test methods, and success criteria
              </p>
            </div>
            <button
              onClick={addHypothesis}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Hypothesis
            </button>
          </div>

          <div className="space-y-4">
            {data.hypotheses.map(hypothesis => (
              <div key={hypothesis.id} className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Assumption to Test</label>
                    <input
                      type="text"
                      value={hypothesis.assumption}
                      onChange={(e) => updateHypothesis(hypothesis.id, "assumption", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="e.g., Users will pay $10/month for this feature"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Test Method</label>
                    <input
                      type="text"
                      value={hypothesis.testMethod}
                      onChange={(e) => updateHypothesis(hypothesis.id, "testMethod", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="e.g., Landing page with pricing, A/B test"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Success Criteria</label>
                    <input
                      type="text"
                      value={hypothesis.successCriteria}
                      onChange={(e) => updateHypothesis(hypothesis.id, "successCriteria", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="e.g., 10% conversion rate, 50 sign-ups"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Test Result (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={hypothesis.result || ""}
                        onChange={(e) => updateHypothesis(hypothesis.id, "result", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded text-sm"
                        placeholder="Record your findings..."
                      />
                      <button
                        onClick={() => removeHypothesis(hypothesis.id)}
                        className="text-red-500 hover:text-red-400 px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.hypotheses.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hypotheses defined yet. Start with your riskiest assumptions.</p>
            </div>
          )}
        </div>

        {/* Success Metrics */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Success Metrics (AARRR - Pirate Metrics)</h2>
          <p className="text-sm text-gray-400 mb-4">
            Define metrics for Acquisition, Activation, Retention, Revenue, and Referral
          </p>

          <div className="space-y-3">
            {data.successMetrics.map((metric, index) => (
              <div key={index} className="grid md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Metric</label>
                  <input
                    type="text"
                    value={metric.metric}
                    onChange={(e) => {
                      const updated = [...data.successMetrics]
                      updated[index].metric = e.target.value
                      setData({ ...data, successMetrics: updated })
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="e.g., Daily Active Users (DAU)"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Target</label>
                  <input
                    type="text"
                    value={metric.target}
                    onChange={(e) => {
                      const updated = [...data.successMetrics]
                      updated[index].target = e.target.value
                      setData({ ...data, successMetrics: updated })
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="e.g., 1000 users"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={metric.timeframe}
                    onChange={(e) => {
                      const updated = [...data.successMetrics]
                      updated[index].timeframe = e.target.value
                      setData({ ...data, successMetrics: updated })
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="e.g., 3 months"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    onClick={() => {
                      const updated = data.successMetrics.filter((_, i) => i !== index)
                      setData({ ...data, successMetrics: updated })
                    }}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setData({
                  ...data,
                  successMetrics: [...data.successMetrics, { metric: "", target: "", timeframe: "" }]
                })
              }}
              className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Metric
            </button>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Budget Estimation
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Estimated Budget
              </label>
              <input
                type="text"
                value={data.budget.estimated}
                onChange={(e) => setData({ ...data, budget: { ...data.budget, estimated: e.target.value } })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., $25,000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Budget Breakdown</label>
              {data.budget.breakdown.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => {
                      const updated = [...data.budget.breakdown]
                      updated[index].category = e.target.value
                      setData({ ...data, budget: { ...data.budget, breakdown: updated } })
                    }}
                    className="col-span-7 px-3 py-2 border rounded text-sm"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) => {
                      const updated = [...data.budget.breakdown]
                      updated[index].amount = e.target.value
                      setData({ ...data, budget: { ...data.budget, breakdown: updated } })
                    }}
                    className="col-span-4 px-3 py-2 border rounded text-sm"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => {
                      const updated = data.budget.breakdown.filter((_, i) => i !== index)
                      setData({ ...data, budget: { ...data.budget, breakdown: updated } })
                    }}
                    className="col-span-1 text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setData({
                    ...data,
                    budget: {
                      ...data.budget,
                      breakdown: [...data.budget.breakdown, { category: "", amount: "" }]
                    }
                  })
                }}
                className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Timeline & Phases
            </h2>

            <div className="space-y-3">
              {data.timeline.map((phase, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      value={phase.phase}
                      onChange={(e) => {
                        const updated = [...data.timeline]
                        updated[index].phase = e.target.value
                        setData({ ...data, timeline: updated })
                      }}
                      className="col-span-7 px-3 py-2 border rounded text-sm"
                      placeholder="Phase name"
                    />
                    <input
                      type="text"
                      value={phase.duration}
                      onChange={(e) => {
                        const updated = [...data.timeline]
                        updated[index].duration = e.target.value
                        setData({ ...data, timeline: updated })
                      }}
                      className="col-span-4 px-3 py-2 border rounded text-sm"
                      placeholder="Duration"
                    />
                    <button
                      onClick={() => {
                        const updated = data.timeline.filter((_, i) => i !== index)
                        setData({ ...data, timeline: updated })
                      }}
                      className="col-span-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={phase.deliverables}
                    onChange={(e) => {
                      const updated = [...data.timeline]
                      updated[index].deliverables = e.target.value
                      setData({ ...data, timeline: updated })
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows={2}
                    placeholder="Deliverables & milestones"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setData({
                    ...data,
                    timeline: [...data.timeline, { phase: "", duration: "", deliverables: "" }]
                  })
                }}
                className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Phase
              </button>
            </div>
          </div>
        </div>

        {/* Risks, Learning Goals, Next Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Risks & Challenges
            </h2>
            <div className="space-y-2">
              {data.risks.map((risk, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={risk}
                    onChange={(e) => {
                      const updated = [...data.risks]
                      updated[index] = e.target.value
                      setData({ ...data, risks: updated })
                    }}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="Risk or challenge"
                  />
                  <button
                    onClick={() => {
                      const updated = data.risks.filter((_, i) => i !== index)
                      setData({ ...data, risks: updated })
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setData({ ...data, risks: [...data.risks, ""] })}
                className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Risk
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
              Learning Goals
            </h2>
            <div className="space-y-2">
              {data.learningGoals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => {
                      const updated = [...data.learningGoals]
                      updated[index] = e.target.value
                      setData({ ...data, learningGoals: updated })
                    }}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="What do you want to learn?"
                  />
                  <button
                    onClick={() => {
                      const updated = data.learningGoals.filter((_, i) => i !== index)
                      setData({ ...data, learningGoals: updated })
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setData({ ...data, learningGoals: [...data.learningGoals, ""] })}
                className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Next Steps
            </h2>
            <div className="space-y-2">
              {data.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => {
                      const updated = [...data.nextSteps]
                      updated[index] = e.target.value
                      setData({ ...data, nextSteps: updated })
                    }}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="Action item"
                  />
                  <button
                    onClick={() => {
                      const updated = data.nextSteps.filter((_, i) => i !== index)
                      setData({ ...data, nextSteps: updated })
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setData({ ...data, nextSteps: [...data.nextSteps, ""] })}
                className="text-orange-600 hover:text-orange-400 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Resources & Best Practices */}
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl shadow-sm border-2 border-orange-500/30 p-6">
          <h2 className="text-xl font-bold text-orange-200 mb-4">📚 Recommended Resources & Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-orange-200 mb-2">Essential Reading</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>The Lean Startup</strong> - Eric Ries (Build-Measure-Learn)</li>
                <li>• <strong>The Mom Test</strong> - Rob Fitzpatrick (Customer interviews)</li>
                <li>• <strong>Sprint</strong> - Jake Knapp (Google Ventures 5-day process)</li>
                <li>• <strong>Inspired</strong> - Marty Cagan (Product management)</li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-orange-200 mb-2">Online Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Y Combinator</strong> - Startup School (free courses)</li>
                <li>• <strong>Product Hunt</strong> - Launch platform & inspiration</li>
                <li>• <strong>Indie Hackers</strong> - Community & case studies</li>
                <li>• <strong>GV Library</strong> - Design sprint resources</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-[#1a1a1a] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-orange-200 mb-2">Key Success Factors from Y Combinator</h3>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-300">
              <div>
                <strong className="text-orange-400">1. Talk to Users</strong>
                <p>Do 50+ user interviews before building anything significant</p>
              </div>
              <div>
                <strong className="text-orange-400">2. Build Fast, Launch Faster</strong>
                <p>Ship in weeks, not months. Iterate based on feedback</p>
              </div>
              <div>
                <strong className="text-orange-400">3. Focus on One Thing</strong>
                <p>Do one thing exceptionally well rather than many things poorly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
