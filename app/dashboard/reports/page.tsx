"use client"

import { useState, useEffect } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { generatePDFReport, downloadReport, type ReportData } from "@/lib/reportGenerator"
import { useStartupData } from "@/hooks/useStartupData"

export default function ReportsPage() {
  const { startup, loading: startupLoading, isReadOnly } = useStartupData()
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState({
    weekly: 0,
    monthly: 0,
    kpis: 0,
    milestones: 0,
    documents: 0,
    feedbacks: 0,
    marketResearch: false,
  })

  useEffect(() => {
    if (startup?.id) {
      fetchStats()
    }
  }, [startup])

  const fetchStats = async () => {
    if (!startup?.id) return
    try {
      const [weekly, monthly, kpis, milestones, documents, feedbacks, marketResearch] = await Promise.all([
        fetch(`/api/weekly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/monthly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/kpi?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/milestone?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/document?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/feedback?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/market-research`).then(r => r.json()).catch(() => []),
      ])

      setStats({
        weekly: Array.isArray(weekly) ? weekly.length : 0,
        monthly: Array.isArray(monthly) ? monthly.length : 0,
        kpis: Array.isArray(kpis) ? kpis.length : 0,
        milestones: Array.isArray(milestones) ? milestones.length : 0,
        documents: Array.isArray(documents) ? documents.length : 0,
        feedbacks: Array.isArray(feedbacks) ? feedbacks.length : 0,
        marketResearch: Array.isArray(marketResearch) && marketResearch.length > 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleGenerateReport = async () => {
    if (!startup) return

    setGenerating(true)
    try {
      // Fetch all data
      const [weeklyTrackers, monthlyTrackers, kpis, milestones, documents, feedbacks, marketResearch] = await Promise.all([
        fetch(`/api/weekly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/monthly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/kpi?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/milestone?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/document?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/feedback?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/market-research`).then(r => r.json()).catch(() => []),
      ])

      const reportData: ReportData = {
        startup,
        weeklyTrackers,
        monthlyTrackers,
        kpis,
        milestones,
        documents,
        feedbacks,
        marketResearch: Array.isArray(marketResearch) && marketResearch.length > 0 ? marketResearch[0] : undefined,
      }

      const doc = await generatePDFReport(reportData)
      downloadReport(doc, startup.name)
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error generating report. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  if (startupLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please create a startup profile first</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center text-gray-100">
          <FileDown className="w-7 h-7 mr-3 text-orange-600" />
          Generate Reports
        </h1>
        <p className="text-gray-400 mt-1">
          Create comprehensive PDF reports of your startup progress
        </p>
      </div>

      {/* Startup Info Card */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">{startup.name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Stage:</span>
            <span className="ml-2 font-medium text-gray-100">{startup.stage}</span>
          </div>
          <div>
            <span className="text-gray-400">Industry:</span>
            <span className="ml-2 font-medium text-gray-100">{startup.industry}</span>
          </div>
          <div>
            <span className="text-gray-400">Founded:</span>
            <span className="ml-2 font-medium text-gray-100">
              {new Date(startup.foundedDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Team Size:</span>
            <span className="ml-2 font-medium text-gray-100">{startup.teamSize}</span>
          </div>
        </div>
      </div>

      {/* Report Contents Preview */}
      <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Report Contents</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Startup Profile</span>
            <span className="text-sm text-gray-400">✓ Included</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Weekly Progress Trackers</span>
            <span className="text-sm font-medium text-orange-600">{stats.weekly} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Monthly Progress Reports</span>
            <span className="text-sm font-medium text-orange-600">{stats.monthly} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">KPI Metrics</span>
            <span className="text-sm font-medium text-orange-600">{stats.kpis} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Milestones & Timeline</span>
            <span className="text-sm font-medium text-orange-600">{stats.milestones} milestones</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Document Summary</span>
            <span className="text-sm font-medium text-orange-600">{stats.documents} documents</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Mentor Feedback</span>
            <span className="text-sm font-medium text-orange-600">{stats.feedbacks} meetings</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg">
            <span className="text-gray-100">Market Research & Analysis</span>
            <span className="text-sm text-gray-400">
              {stats.marketResearch ? "✓ Included" : "Not available"}
            </span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg shadow-sm p-8 text-center border border-purple-500/30">
        <h3 className="text-xl font-semibold mb-2 text-gray-100">Ready to Generate?</h3>
        <p className="text-gray-400 mb-6">
          Your comprehensive report will include all the data shown above in a professional PDF format
        </p>
        
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto text-lg font-medium"
        >
          {generating ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="w-6 h-6 mr-3" />
              Generate PDF Report
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Report will be downloaded automatically as a PDF file
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <h4 className="font-medium text-orange-200 mb-2">📄 Report Features</h4>
        <ul className="text-sm text-orange-300 space-y-1">
          <li>• Professional formatting with startup branding</li>
          <li>• Complete data summary across all modules</li>
          <li>• Progress statistics and KPI trends</li>
          <li>• Milestone completion tracking</li>
          <li>• Document and feedback summaries</li>
          <li>• Date-stamped for record keeping</li>
        </ul>
      </div>
    </div>
  )
}
