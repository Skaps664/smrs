"use client"

import { useState, useEffect } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { generatePDFReport, downloadReport, type ReportData } from "@/lib/reportGenerator"

export default function ReportsPage() {
  const [startup, setStartup] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState({
    weekly: 0,
    monthly: 0,
    kpis: 0,
    milestones: 0,
    documents: 0,
    feedbacks: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const startupRes = await fetch("/api/startup")
      const startupData = await startupRes.json()
      if (startupData.length > 0) {
        setStartup(startupData[0])
        
        // Fetch stats for all sections
        const [weekly, monthly, kpis, milestones, documents, feedbacks] = await Promise.all([
          fetch(`/api/weekly?startupId=${startupData[0].id}`).then(r => r.json()),
          fetch(`/api/monthly?startupId=${startupData[0].id}`).then(r => r.json()),
          fetch(`/api/kpi?startupId=${startupData[0].id}`).then(r => r.json()),
          fetch(`/api/milestone?startupId=${startupData[0].id}`).then(r => r.json()),
          fetch(`/api/document?startupId=${startupData[0].id}`).then(r => r.json()),
          fetch(`/api/feedback?startupId=${startupData[0].id}`).then(r => r.json()),
        ])

        setStats({
          weekly: weekly.length || 0,
          monthly: monthly.length || 0,
          kpis: kpis.length || 0,
          milestones: milestones.length || 0,
          documents: documents.length || 0,
          feedbacks: feedbacks.length || 0,
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleGenerateReport = async () => {
    if (!startup) return

    setGenerating(true)
    try {
      // Fetch all data
      const [weeklyTrackers, monthlyTrackers, kpis, milestones, documents, feedbacks] = await Promise.all([
        fetch(`/api/weekly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/monthly?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/kpi?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/milestone?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/document?startupId=${startup.id}`).then(r => r.json()),
        fetch(`/api/feedback?startupId=${startup.id}`).then(r => r.json()),
      ])

      const reportData: ReportData = {
        startup,
        weeklyTrackers,
        monthlyTrackers,
        kpis,
        milestones,
        documents,
        feedbacks,
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

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center text-gray-900">
          <FileDown className="w-7 h-7 mr-3 text-orange-600" />
          Generate Reports
        </h1>
        <p className="text-gray-600 mt-1">
          Create comprehensive PDF reports of your startup progress
        </p>
      </div>

      {/* Startup Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">{startup.name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Stage:</span>
            <span className="ml-2 font-medium text-gray-900">{startup.stage}</span>
          </div>
          <div>
            <span className="text-gray-600">Industry:</span>
            <span className="ml-2 font-medium text-gray-900">{startup.industry}</span>
          </div>
          <div>
            <span className="text-gray-600">Founded:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(startup.foundedDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Team Size:</span>
            <span className="ml-2 font-medium text-gray-900">{startup.teamSize}</span>
          </div>
        </div>
      </div>

      {/* Report Contents Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Report Contents</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Startup Profile</span>
            <span className="text-sm text-gray-600">✓ Included</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Weekly Progress Trackers</span>
            <span className="text-sm font-medium text-orange-600">{stats.weekly} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Monthly Progress Reports</span>
            <span className="text-sm font-medium text-orange-600">{stats.monthly} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">KPI Metrics</span>
            <span className="text-sm font-medium text-orange-600">{stats.kpis} entries</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Milestones & Timeline</span>
            <span className="text-sm font-medium text-orange-600">{stats.milestones} milestones</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Document Summary</span>
            <span className="text-sm font-medium text-orange-600">{stats.documents} documents</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">Mentor Feedback</span>
            <span className="text-sm font-medium text-orange-600">{stats.feedbacks} meetings</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-8 text-center border border-purple-200">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Ready to Generate?</h3>
        <p className="text-gray-600 mb-6">
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

        <p className="text-xs text-gray-500 mt-4">
          Report will be downloaded automatically as a PDF file
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">📄 Report Features</h4>
        <ul className="text-sm text-orange-800 space-y-1">
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
