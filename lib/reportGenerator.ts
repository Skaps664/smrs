import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { ReportData, WeeklyTracker, MonthlyTracker, KPI, Milestone, Document, MentorFeedback, MarketResearchData } from "@/types"

export type { ReportData }

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

  // Market Research Section
  if (data.marketResearch) {
    const mr = data.marketResearch
    
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = 20
    }

    yPos += 15
    doc.setFontSize(16)
    doc.setTextColor(17, 24, 39)
    doc.text("Market Research & Analysis", 20, yPos)
    
    // TAM/SAM/SOM
    yPos += 12
    doc.setFontSize(12)
    doc.setTextColor(249, 115, 22) // Orange
    doc.text("Market Size (TAM/SAM/SOM)", 20, yPos)
    
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39)
    
    const formatCurrency = (value: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        notation: value >= 1e9 ? 'compact' : 'standard',
        maximumFractionDigits: 0
      }).format(value)
    }

    doc.text(`TAM: ${formatCurrency(mr.tam.value, mr.tam.currency)}`, 25, yPos)
    yPos += 5
    if (mr.tam.description) {
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)
      const tamDesc = doc.splitTextToSize(mr.tam.description, pageWidth - 50)
      doc.text(tamDesc, 30, yPos)
      yPos += tamDesc.length * 4
    }
    
    yPos += 3
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39)
    doc.text(`SAM: ${formatCurrency(mr.sam.value, mr.sam.currency)}`, 25, yPos)
    yPos += 5
    if (mr.sam.description) {
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)
      const samDesc = doc.splitTextToSize(mr.sam.description, pageWidth - 50)
      doc.text(samDesc, 30, yPos)
      yPos += samDesc.length * 4
    }
    
    yPos += 3
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39)
    doc.text(`SOM: ${formatCurrency(mr.som.value, mr.som.currency)}`, 25, yPos)
    yPos += 5
    if (mr.som.description) {
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)
      const somDesc = doc.splitTextToSize(mr.som.description, pageWidth - 50)
      doc.text(somDesc, 30, yPos)
      yPos += somDesc.length * 4
    }

    // SWOT Analysis
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    yPos += 12
    doc.setFontSize(12)
    doc.setTextColor(249, 115, 22) // Orange
    doc.text("SWOT Analysis", 20, yPos)
    
    yPos += 8
    doc.setFontSize(10)
    
    // Strengths
    if (mr.swot.strengths.length > 0) {
      doc.setTextColor(34, 197, 94) // Green
      doc.text(`Strengths (${mr.swot.strengths.length}):`, 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      doc.setTextColor(17, 24, 39)
      mr.swot.strengths.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
      if (mr.swot.strengths.length > 3) {
        doc.setTextColor(107, 114, 128)
        doc.text(`... and ${mr.swot.strengths.length - 3} more`, 30, yPos)
        yPos += 5
      }
    }
    
    // Weaknesses
    yPos += 3
    if (mr.swot.weaknesses.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(239, 68, 68) // Red
      doc.text(`Weaknesses (${mr.swot.weaknesses.length}):`, 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      doc.setTextColor(17, 24, 39)
      mr.swot.weaknesses.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
      if (mr.swot.weaknesses.length > 3) {
        doc.setTextColor(107, 114, 128)
        doc.text(`... and ${mr.swot.weaknesses.length - 3} more`, 30, yPos)
        yPos += 5
      }
    }
    
    // Opportunities
    yPos += 3
    if (mr.swot.opportunities.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(59, 130, 246) // Blue
      doc.text(`Opportunities (${mr.swot.opportunities.length}):`, 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      doc.setTextColor(17, 24, 39)
      mr.swot.opportunities.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
      if (mr.swot.opportunities.length > 3) {
        doc.setTextColor(107, 114, 128)
        doc.text(`... and ${mr.swot.opportunities.length - 3} more`, 30, yPos)
        yPos += 5
      }
    }
    
    // Threats
    yPos += 3
    if (mr.swot.threats.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(234, 179, 8) // Yellow
      doc.text(`Threats (${mr.swot.threats.length}):`, 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      doc.setTextColor(17, 24, 39)
      mr.swot.threats.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
      if (mr.swot.threats.length > 3) {
        doc.setTextColor(107, 114, 128)
        doc.text(`... and ${mr.swot.threats.length - 3} more`, 30, yPos)
        yPos += 5
      }
    }

    // Target Audience
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = 20
    }

    yPos += 12
    doc.setFontSize(12)
    doc.setTextColor(249, 115, 22) // Orange
    doc.text("Target Audience", 20, yPos)
    
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39)
    
    if (mr.targetAudience.segments.length > 0) {
      doc.text("Segments:", 25, yPos)
      yPos += 5
      doc.setFontSize(9)
      doc.text(mr.targetAudience.segments.join(", "), 30, yPos)
      yPos += 6
    }
    
    if (mr.targetAudience.locations.length > 0) {
      doc.setFontSize(10)
      doc.text("Geographic Focus:", 25, yPos)
      yPos += 5
      doc.setFontSize(9)
      doc.text(mr.targetAudience.locations.join(", "), 30, yPos)
      yPos += 6
    }
    
    if (mr.targetAudience.ageRanges.length > 0) {
      doc.setFontSize(10)
      doc.text("Age Ranges:", 25, yPos)
      yPos += 5
      doc.setFontSize(9)
      doc.text(mr.targetAudience.ageRanges.join(", "), 30, yPos)
      yPos += 6
    }
    
    if (mr.targetAudience.painPoints.length > 0) {
      doc.setFontSize(10)
      doc.text("Key Pain Points:", 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      mr.targetAudience.painPoints.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
    }

    // Competitive Analysis
    if (yPos > pageHeight - 50) {
      doc.addPage()
      yPos = 20
    }

    yPos += 12
    doc.setFontSize(12)
    doc.setTextColor(249, 115, 22) // Orange
    doc.text("Competitive Landscape", 20, yPos)
    
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39)
    
    if (mr.competitorAnalysis.directCompetitors.length > 0) {
      doc.text(`Direct Competitors: ${mr.competitorAnalysis.directCompetitors.length}`, 25, yPos)
      yPos += 5
      doc.setFontSize(9)
      doc.text(mr.competitorAnalysis.directCompetitors.slice(0, 5).join(", "), 30, yPos)
      yPos += 6
    }
    
    if (mr.competitorAnalysis.marketGaps.length > 0) {
      yPos += 3
      doc.setFontSize(10)
      doc.text("Market Opportunities:", 25, yPos)
      yPos += 6
      doc.setFontSize(9)
      mr.competitorAnalysis.marketGaps.slice(0, 3).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 55)
        doc.text(itemText, 30, yPos)
        yPos += itemText.length * 4 + 1
      })
    }

    // Market Trends
    if (mr.marketTrends.length > 0) {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = 20
      }

      yPos += 12
      doc.setFontSize(12)
      doc.setTextColor(249, 115, 22) // Orange
      doc.text("Market Trends", 20, yPos)
      
      yPos += 8
      doc.setFontSize(9)
      doc.setTextColor(17, 24, 39)
      mr.marketTrends.slice(0, 5).forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 50)
        doc.text(itemText, 25, yPos)
        yPos += itemText.length * 4 + 1
      })
    }
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
    const recent: WeeklyTracker = data.weeklyTrackers[0]
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
    const recent: MonthlyTracker = data.monthlyTrackers[0]
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
    const count = data.kpis.filter((k: KPI) => k.category === cat).length
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
  const completedMilestones = data.milestones.filter((m: Milestone) => m.completed).length
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
    const count = data.documents.filter((d: Document) => d.category === cat).length
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
      .filter((f: MentorFeedback) => f.progressScore)
      .reduce((acc: number, f: MentorFeedback) => acc + (f.progressScore || 0), 0) / 
      data.feedbacks.filter((f: MentorFeedback) => f.progressScore).length
    
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
