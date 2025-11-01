"use client"

import { useState, useEffect } from "react"
import { BarChart3, Plus, X, TrendingUp } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { useStartupData } from "@/hooks/useStartupData"
import MentorFeedbackButton from "@/components/MentorFeedbackButton"

const categories = [
  { value: "MARKETING", label: "Marketing", color: "#f59e0b" },
  { value: "SALES", label: "Sales", color: "#f97316" },
  { value: "PRODUCT", label: "Product", color: "#fb923c" },
  { value: "OPERATIONS", label: "Operations", color: "#fdba74" },
]

const categoryFields = {
  MARKETING: [
    { name: "socialFollowers", label: "Social Followers", type: "number" },
    { name: "reach", label: "Reach", type: "number" },
    { name: "engagementRate", label: "Engagement Rate (%)", type: "number", step: "0.01" },
    { name: "adSpend", label: "Ad Spend ($)", type: "number", step: "0.01" },
    { name: "leadsGenerated", label: "Leads Generated", type: "number" },
  ],
  SALES: [
    { name: "ordersPlaced", label: "Orders Placed", type: "number" },
    { name: "unitsSold", label: "Units Sold", type: "number" },
    { name: "revenue", label: "Revenue ($)", type: "number", step: "0.01" },
    { name: "profitMargin", label: "Profit Margin (%)", type: "number", step: "0.01" },
    { name: "customerReturnRate", label: "Customer Return Rate (%)", type: "number", step: "0.01" },
  ],
  PRODUCT: [
    { name: "featuresCompleted", label: "Features Completed", type: "number" },
    { name: "prototypesTested", label: "Prototypes Tested", type: "number" },
    { name: "qaResults", label: "QA Results", type: "text" },
  ],
  OPERATIONS: [
    { name: "suppliersOnboarded", label: "Suppliers Onboarded", type: "number" },
    { name: "employeesAdded", label: "Employees Added", type: "number" },
    { name: "collaborators", label: "Collaborators", type: "number" },
  ],
}

export default function KPIDashboardPage() {
  const { startup, loading: startupLoading, isReadOnly } = useStartupData()
  const [kpis, setKpis] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("MARKETING")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split("T")[0],
    category: "MARKETING",
    notes: "",
  })

  useEffect(() => {
    if (startup?.id) {
      fetchKPIs()
    }
  }, [startup])

  const fetchKPIs = async () => {
    if (!startup?.id) return
    
    try {
      const kpiRes = await fetch(`/api/kpi?startupId=${startup.id}`)
      const kpiData = await kpiRes.json()
      
      // Handle both array response and error response
      if (Array.isArray(kpiData)) {
        setKpis(kpiData)
      } else {
        console.error("Invalid KPI data:", kpiData)
        setKpis([])
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
      setKpis([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startup) return

    setLoading(true)
    try {
      const payload = {
        startupId: startup.id,
        ...formData,
      }

      const res = await fetch("/api/kpi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchKPIs()
        setFormData({
          date: new Date().toISOString().split("T")[0],
          category: "MARKETING",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error saving KPI:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
      </div>
    )
  }

  const filteredKpis = kpis.filter(k => k.category === activeCategory)
  const chartData = filteredKpis
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(kpi => ({
      date: format(new Date(kpi.date), "MMM dd"),
      ...kpi,
    }))

  const getChartKeys = (category: string) => {
    return categoryFields[category as keyof typeof categoryFields]
      .filter(f => f.type === "number")
      .map(f => f.name)
  }

  const currentCategoryFields = categoryFields[activeCategory as keyof typeof categoryFields]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900">
            <BarChart3 className="w-7 h-7 mr-3 text-orange-600" />
            KPI Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track key metrics and visualize trends</p>
        </div>
        {!showForm && !isReadOnly && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add KPI Entry
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === cat.value
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{
                backgroundColor: activeCategory === cat.value ? cat.color : undefined,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add KPI Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add KPI Entry</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categoryFields[formData.category as keyof typeof categoryFields].map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2 text-gray-900">
                    {field.label}
                  </label>
                  {field.type === "text" ? (
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                  ) : (
                    <input
                      type="number"
                      step={field.step || "1"}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional context or observations..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save KPI Entry"}
            </button>
          </form>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            {categories.find(c => c.value === activeCategory)?.label} Trends
          </h3>

          {/* Line Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                <Legend />
                {getChartKeys(activeCategory).slice(0, 3).map((key, index) => {
                  const colors = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b"]
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[index]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          {getChartKeys(activeCategory).length > 0 && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                  <Legend />
                  {getChartKeys(activeCategory).slice(0, 3).map((key, index) => {
                    const colors = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b"]
                    return (
                      <Bar key={key} dataKey={key} fill={colors[index]} />
                    )
                  })}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No KPI data for {categories.find(c => c.value === activeCategory)?.label}</p>
          <p className="text-sm text-gray-500 mt-2">Add your first entry to see trends</p>
        </div>
      )}

      {/* Data Table */}
      {filteredKpis.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Entries</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-900">Date</th>
                  {currentCategoryFields.slice(0, 4).map(field => (
                    <th key={field.name} className="text-left py-3 px-4 text-gray-900">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredKpis.slice(0, 10).map(kpi => (
                  <tr key={kpi.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">
                      {format(new Date(kpi.date), "MMM dd, yyyy")}
                    </td>
                    {currentCategoryFields.slice(0, 4).map(field => (
                      <td key={field.name} className="py-3 px-4 text-gray-700">
                        {kpi[field.name] !== null && kpi[field.name] !== undefined
                          ? kpi[field.name]
                          : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mentor Feedback Button */}
      <MentorFeedbackButton
        section="KPI Dashboard"
        sectionData={{
          startupName: startup?.name,
          totalKPIs: kpis.length,
          categories: Array.from(new Set(kpis.map(k => k.category))),
        }}
      />
    </div>
  )
}
