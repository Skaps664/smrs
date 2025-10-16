import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface ReportData {
  startup: any
  weeklyTrackers: any[]
  monthlyTrackers: any[]
  kpis: any[]
  milestones: any[]
  documents: any[]
  feedbacks: any[]
}

export async function generatePDFReport(data: ReportData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Title
  doc.setFontSize(24)
  doc.setTextColor(99, 102, 241) // Indigo
  doc.text("Startup Progress Report", pageWidth / 2, yPos, { align: "center" })
  
  yPos += 15
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128) // Gray
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" })

  // Startup Info
  yPos += 20
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39) // Dark gray
  doc.text("Startup Profile", 20, yPos)
  
  yPos += 10
  doc.setFontSize(11)
  doc.text(`Name: ${data.startup.name}`, 20, yPos)
  yPos += 7
  doc.text(`Stage: ${data.startup.stage}`, 20, yPos)
  yPos += 7
  doc.text(`Industry: ${data.startup.industry}`, 20, yPos)
  yPos += 7
  doc.text(`Founded: ${new Date(data.startup.foundedDate).toLocaleDateString()}`, 20, yPos)

  if (data.startup.description) {
    yPos += 10
    doc.setFontSize(10)
    const splitText = doc.splitTextToSize(data.startup.description, pageWidth - 40)
    doc.text(splitText, 20, yPos)
    yPos += splitText.length * 5
  }

  // Check if we need a new page
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Weekly Progress Summary
  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Weekly Progress", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Total Entries: ${data.weeklyTrackers.length}`, 20, yPos)

  if (data.weeklyTrackers.length > 0 && yPos < pageHeight - 60) {
    yPos += 10
    const recent = data.weeklyTrackers[0]
    doc.setFontSize(9)
    doc.text(`Latest Entry (${new Date(recent.startDate).toLocaleDateString()}):`, 20, yPos)
    yPos += 7
    doc.text(`• Milestones: ${recent.milestonesAchieved.length}`, 25, yPos)
    yPos += 5
    doc.text(`• New Activities: ${recent.newActivities.length}`, 25, yPos)
    yPos += 5
    doc.text(`• Challenges: ${recent.challenges.length}`, 25, yPos)
  }

  // Monthly Progress Summary
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Monthly Progress", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Total Entries: ${data.monthlyTrackers.length}`, 20, yPos)

  if (data.monthlyTrackers.length > 0 && yPos < pageHeight - 40) {
    yPos += 10
    const recent = data.monthlyTrackers[0]
    doc.setFontSize(9)
    doc.text(`Latest Month:`, 20, yPos)
    yPos += 7
    if (recent.summary) {
      const summaryText = doc.splitTextToSize(recent.summary, pageWidth - 40)
      doc.text(summaryText, 25, yPos)
      yPos += summaryText.length * 5
    }
  }

  // KPI Summary
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Key Performance Indicators", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Total KPI Entries: ${data.kpis.length}`, 20, yPos)

  const categories = ["MARKETING", "SALES", "PRODUCT", "OPERATIONS"]
  categories.forEach(cat => {
    const count = data.kpis.filter((k: any) => k.category === cat).length
    yPos += 7
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = 20
    }
    doc.text(`${cat}: ${count} entries`, 25, yPos)
  })

  // Milestones
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Milestones", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  const completedMilestones = data.milestones.filter((m: any) => m.completed).length
  doc.text(`Total: ${data.milestones.length} | Completed: ${completedMilestones}`, 20, yPos)
  yPos += 7
  const progress = data.milestones.length > 0
    ? Math.round((completedMilestones / data.milestones.length) * 100)
    : 0
  doc.text(`Progress: ${progress}%`, 20, yPos)

  // Documents
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Documents", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Total Documents: ${data.documents.length}`, 20, yPos)

  const docCategories = ["LEGAL", "FINANCIAL", "PITCH_DECK", "PRODUCT_PHOTOS", "CERTIFICATES", "OTHER"]
  docCategories.forEach(cat => {
    const count = data.documents.filter((d: any) => d.category === cat).length
    if (count > 0) {
      yPos += 7
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${cat}: ${count} documents`, 25, yPos)
    }
  })

  // Mentor Feedback
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  yPos += 15
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text("Mentor Feedback", 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(`Total Meetings: ${data.feedbacks.length}`, 20, yPos)

  if (data.feedbacks.length > 0) {
    const avgScore = data.feedbacks
      .filter((f: any) => f.progressScore)
      .reduce((acc: number, f: any) => acc + f.progressScore, 0) / 
      data.feedbacks.filter((f: any) => f.progressScore).length
    
    yPos += 7
    doc.text(`Average Progress Score: ${avgScore.toFixed(1)}/10`, 20, yPos)
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Page ${i} of ${totalPages} | ${data.startup.name} | Startup Management System`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    )
  }

  return doc
}

export function downloadReport(doc: jsPDF, startupName: string) {
  const filename = `${startupName.replace(/\s+/g, "-")}-report-${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(filename)
}

export async function captureChartImage(elementId: string): Promise<string> {
  const element = document.getElementById(elementId)
  if (!element) throw new Error("Chart element not found")

  const canvas = await html2canvas(element)
  return canvas.toDataURL("image/png")
}
