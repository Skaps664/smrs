"use client"

import { useState, useEffect } from "react"
import { Plus, History, Save, Trash2, Archive, CheckCircle, Clock, Eye, EyeOff } from "lucide-react"
import type { ValueProposition } from "@/types"

export default function ValuePropositionPage() {
  const [valuePropositions, setValuePropositions] = useState<ValueProposition[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<ValueProposition | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Form state for new/edit version
  const [formData, setFormData] = useState({
    versionName: "",
    status: "DRAFT" as "DRAFT" | "ACTIVE" | "ARCHIVED",
    gainCreators: [""],
    productsServices: [""],
    painRelievers: [""],
    customerGains: [""],
    customerPains: [""],
    customerJobs: [""],
    notes: "",
    targetAudience: "",
  })

  useEffect(() => {
    fetchValuePropositions()
  }, [])

  const fetchValuePropositions = async () => {
    try {
      const response = await fetch("/api/value-proposition")
      if (response.ok) {
        const data = await response.json()
        setValuePropositions(data)
        if (data.length > 0 && !selectedVersion) {
          setSelectedVersion(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching value propositions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/value-proposition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newVersion = await response.json()
        await fetchValuePropositions()
        setSelectedVersion(newVersion)
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error creating value proposition:", error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedVersion) return

    try {
      const response = await fetch("/api/value-proposition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedVersion.id, ...formData }),
      })

      if (response.ok) {
        await fetchValuePropositions()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating value proposition:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this version?")) return

    try {
      const response = await fetch(`/api/value-proposition?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchValuePropositions()
        if (selectedVersion?.id === id) {
          setSelectedVersion(valuePropositions[0] || null)
        }
      }
    } catch (error) {
      console.error("Error deleting value proposition:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      versionName: "",
      status: "DRAFT",
      gainCreators: [""],
      productsServices: [""],
      painRelievers: [""],
      customerGains: [""],
      customerPains: [""],
      customerJobs: [""],
      notes: "",
      targetAudience: "",
    })
  }

  const loadVersionToForm = (version: ValueProposition) => {
    setFormData({
      versionName: version.versionName,
      status: version.status,
      gainCreators: version.gainCreators.length > 0 ? version.gainCreators : [""],
      productsServices: version.productsServices.length > 0 ? version.productsServices : [""],
      painRelievers: version.painRelievers.length > 0 ? version.painRelievers : [""],
      customerGains: version.customerGains.length > 0 ? version.customerGains : [""],
      customerPains: version.customerPains.length > 0 ? version.customerPains : [""],
      customerJobs: version.customerJobs.length > 0 ? version.customerJobs : [""],
      notes: version.notes || "",
      targetAudience: version.targetAudience || "",
    })
  }

  const addArrayItem = (field: keyof typeof formData) => {
    if (Array.isArray(formData[field])) {
      setFormData({ ...formData, [field]: [...formData[field] as string[], ""] })
    }
  }

  const updateArrayItem = (field: keyof typeof formData, index: number, value: string) => {
    const arr = [...(formData[field] as string[])]
    arr[index] = value
    setFormData({ ...formData, [field]: arr })
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const arr = (formData[field] as string[]).filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: arr.length > 0 ? arr : [""] })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800"
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />
      case "DRAFT":
        return <Clock className="w-4 h-4" />
      case "ARCHIVED":
        return <Archive className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Value Proposition Canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Proposition Canvas</h1>
          <p className="text-gray-600">
            Design and iterate your value proposition with versioning
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showHistory
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showHistory ? <EyeOff className="w-4 h-4" /> : <History className="w-4 h-4" />}
            {showHistory ? "Hide History" : "Show History"}
          </button>
          {!isCreating && !isEditing && (
            <button
              onClick={() => {
                setIsCreating(true)
                resetForm()
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Version
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* History Sidebar */}
        {showHistory && (
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 max-h-[800px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-orange-600" />
              Version History
            </h2>
            {valuePropositions.length === 0 ? (
              <p className="text-gray-500 text-sm">No versions created yet</p>
            ) : (
              <div className="space-y-3">
                {valuePropositions.map((vp) => (
                  <div
                    key={vp.id}
                    onClick={() => {
                      setSelectedVersion(vp)
                      setIsCreating(false)
                      setIsEditing(false)
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVersion?.id === vp.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">v{vp.versionNumber}</span>
                      <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(vp.status)}`}>
                        {getStatusIcon(vp.status)}
                        {vp.status}
                      </div>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{vp.versionName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(vp.createdAt).toLocaleDateString()}
                    </p>
                    {selectedVersion?.id === vp.id && !isCreating && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            loadVersionToForm(vp)
                            setIsEditing(true)
                          }}
                          className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(vp.id)
                          }}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Canvas Area */}
        <div className={showHistory ? "lg:col-span-3" : "lg:col-span-4"}>
          {isCreating || isEditing ? (
            // Edit/Create Form
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  {isCreating ? "Create New Version" : "Edit Version"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Name *
                    </label>
                    <input
                      type="text"
                      value={formData.versionName}
                      onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
                      placeholder="e.g., Initial Canvas, Q2 2025 Pivot"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="Who is this canvas for?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Value Proposition Side */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-orange-900 mb-4">Value Proposition</h3>

                    {/* Gain Creators */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Gain Creators
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        How your products/services create customer gains
                      </p>
                      {formData.gainCreators.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("gainCreators", index, e.target.value)
                            }
                            placeholder="Describe a gain creator..."
                            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                          {formData.gainCreators.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("gainCreators", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("gainCreators")}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2"
                      >
                        + Add Gain Creator
                      </button>
                    </div>

                    {/* Products & Services */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Products & Services
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        Your core offerings
                      </p>
                      {formData.productsServices.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("productsServices", index, e.target.value)
                            }
                            placeholder="Product or service..."
                            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                          {formData.productsServices.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("productsServices", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("productsServices")}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2"
                      >
                        + Add Product/Service
                      </button>
                    </div>

                    {/* Pain Relievers */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Pain Relievers
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        How you eliminate or reduce customer pains
                      </p>
                      {formData.painRelievers.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("painRelievers", index, e.target.value)
                            }
                            placeholder="Describe a pain reliever..."
                            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                          {formData.painRelievers.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("painRelievers", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("painRelievers")}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2"
                      >
                        + Add Pain Reliever
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Segment Side */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Customer Segment</h3>

                    {/* Customer Gains */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Customer Gains
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        Outcomes and benefits customers want
                      </p>
                      {formData.customerGains.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("customerGains", index, e.target.value)
                            }
                            placeholder="What gains do customers expect?"
                            className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {formData.customerGains.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("customerGains", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("customerGains")}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        + Add Customer Gain
                      </button>
                    </div>

                    {/* Customer Pains */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Customer Pains
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        Problems and frustrations customers face
                      </p>
                      {formData.customerPains.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("customerPains", index, e.target.value)
                            }
                            placeholder="What frustrates customers?"
                            className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {formData.customerPains.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("customerPains", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("customerPains")}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        + Add Customer Pain
                      </button>
                    </div>

                    {/* Customer Jobs */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Customer Jobs
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        Functional, social, and emotional jobs customers need done
                      </p>
                      {formData.customerJobs.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem("customerJobs", index, e.target.value)
                            }
                            placeholder="What job needs to be done?"
                            className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {formData.customerJobs.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("customerJobs", index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("customerJobs")}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        + Add Customer Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any additional context or insights..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? "Create Version" : "Update Version"}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setIsEditing(false)
                    resetForm()
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedVersion ? (
            // View Mode
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedVersion.versionName}</h2>
                    <div
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(
                        selectedVersion.status
                      )}`}
                    >
                      {getStatusIcon(selectedVersion.status)}
                      {selectedVersion.status}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Version {selectedVersion.versionNumber} •{" "}
                    {new Date(selectedVersion.createdAt).toLocaleDateString()} •{" "}
                    {selectedVersion.targetAudience || "No target audience specified"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadVersionToForm(selectedVersion)
                    setIsEditing(true)
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Edit Version
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Value Proposition View */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-orange-900 mb-4">Value Proposition</h3>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Gain Creators</h4>
                    <ul className="space-y-2">
                      {selectedVersion.gainCreators.length > 0 &&
                      selectedVersion.gainCreators[0] ? (
                        selectedVersion.gainCreators.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No gain creators added</p>
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Products & Services</h4>
                    <ul className="space-y-2">
                      {selectedVersion.productsServices.length > 0 &&
                      selectedVersion.productsServices[0] ? (
                        selectedVersion.productsServices.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No products/services added</p>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Pain Relievers</h4>
                    <ul className="space-y-2">
                      {selectedVersion.painRelievers.length > 0 &&
                      selectedVersion.painRelievers[0] ? (
                        selectedVersion.painRelievers.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No pain relievers added</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Customer Segment View */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Customer Segment</h3>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Gains</h4>
                    <ul className="space-y-2">
                      {selectedVersion.customerGains.length > 0 &&
                      selectedVersion.customerGains[0] ? (
                        selectedVersion.customerGains.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No customer gains added</p>
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Pains</h4>
                    <ul className="space-y-2">
                      {selectedVersion.customerPains.length > 0 &&
                      selectedVersion.customerPains[0] ? (
                        selectedVersion.customerPains.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No customer pains added</p>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Jobs</h4>
                    <ul className="space-y-2">
                      {selectedVersion.customerJobs.length > 0 &&
                      selectedVersion.customerJobs[0] ? (
                        selectedVersion.customerJobs.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No customer jobs added</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {selectedVersion.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {selectedVersion.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Value Proposition Created Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start designing your value proposition canvas to align your products with customer
                  needs
                </p>
                <button
                  onClick={() => {
                    setIsCreating(true)
                    resetForm()
                  }}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Version
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
