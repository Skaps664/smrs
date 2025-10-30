"use client"

import { useState, useEffect } from "react"
import { 
  Plus, History, Save, Trash2, Archive, CheckCircle, Clock, Eye, EyeOff, 
  HelpCircle, Lightbulb, Users, Gift, MessageSquare, DollarSign, 
  Boxes, Zap, Handshake, Receipt, TrendingUp, Info, Play, BookOpen, X
} from "lucide-react"
import type { 
  BusinessModelCanvas, 
  CustomerSegment,
  ValuePropositionBMC,
  Channel,
  CustomerRelationship,
  RevenueStream,
  KeyResource,
  KeyActivity,
  KeyPartnership,
  CostStructure
} from "@/types"

// Block definitions with prompts and examples
const BMC_BLOCKS = {
  customerSegments: {
    title: "Customer Segments",
    icon: Users,
    color: "blue",
    description: "Who are your most important customers? What are the different groups of people or organizations you aim to reach and serve?",
    prompts: [
      "Who are you creating value for?",
      "Who are your most important customers?",
      "Are they mass market, niche market, segmented, diversified, or multi-sided platforms?",
    ],
    examples: [
      "Young professionals (25-35) seeking career growth",
      "Small businesses with 10-50 employees",
      "Enterprise clients in financial services",
    ],
    helpText: "Define distinct groups of customers with common needs, behaviors, and attributes. Consider demographics, psychographics, and behavioral patterns.",
  },
  valuePropositions: {
    title: "Value Propositions",
    icon: Gift,
    color: "orange",
    description: "What value do you deliver to the customer? Which problems are you helping to solve? What bundles of products/services are you offering?",
    prompts: [
      "What core value do you deliver to customers?",
      "Which customer problems are you solving?",
      "What makes you different from competitors?",
      "What job are you helping customers get done?",
    ],
    examples: [
      "Save 10 hours/week on administrative tasks",
      "Increase sales by 25% through data-driven insights",
      "24/7 automated customer support",
    ],
    helpText: "Describe the bundle of benefits that creates value for a specific customer segment. Focus on quantifiable outcomes and emotional benefits.",
  },
  channels: {
    title: "Channels",
    icon: TrendingUp,
    color: "green",
    description: "Through which channels do your customers want to be reached? How are you reaching them now? How are your channels integrated?",
    prompts: [
      "How do customers discover your product?",
      "How do customers purchase from you?",
      "How do you deliver value to customers?",
      "What are your post-purchase touchpoints?",
    ],
    examples: [
      "Direct sales team for enterprise clients",
      "E-commerce website with payment gateway",
      "Mobile app with in-app purchases",
      "Partner network and resellers",
    ],
    helpText: "Map out customer touchpoints across awareness, evaluation, purchase, delivery, and after-sales phases. Consider owned vs. partner channels.",
  },
  customerRelationships: {
    title: "Customer Relationships",
    icon: MessageSquare,
    color: "purple",
    description: "What type of relationship does each customer segment expect? How costly are they? How are they integrated with the rest of your business model?",
    prompts: [
      "How do you acquire new customers?",
      "How do you retain existing customers?",
      "How do you grow revenue from customers?",
      "Is it automated or personal assistance?",
    ],
    examples: [
      "Personal onboarding and dedicated account manager",
      "Self-service platform with community support",
      "Automated email nurturing campaigns",
      "Co-creation with early adopters",
    ],
    helpText: "Define the type of relationship you establish with each customer segment (personal, automated, communities, co-creation, etc.).",
  },
  revenueStreams: {
    title: "Revenue Streams",
    icon: DollarSign,
    color: "emerald",
    description: "For what value are your customers willing to pay? What and how do they currently pay? How would they prefer to pay?",
    prompts: [
      "What are customers willing to pay for?",
      "How do they currently pay?",
      "What is your pricing model?",
      "What percentage of total revenue does each stream represent?",
    ],
    examples: [
      "Monthly SaaS subscription ($49-$199/month)",
      "Transaction fees (2.9% + $0.30 per transaction)",
      "One-time license fees ($5,000-$50,000)",
      "Freemium model with premium features",
    ],
    helpText: "Identify all revenue sources. Consider asset sale, usage fees, subscription, licensing, advertising, etc. Include pricing mechanisms.",
  },
  keyResources: {
    title: "Key Resources",
    icon: Boxes,
    color: "indigo",
    description: "What key resources do your value propositions require? What about distribution channels, customer relationships, and revenue streams?",
    prompts: [
      "What physical, intellectual, human, and financial resources do you need?",
      "What assets are most important to your business?",
      "What do you own vs. lease vs. acquire from partners?",
    ],
    examples: [
      "Proprietary AI algorithm and IP portfolio",
      "20-person engineering team",
      "Cloud infrastructure (AWS)",
      "Brand reputation and customer data",
    ],
    helpText: "List physical (equipment, buildings), intellectual (patents, copyrights, data), human (talent, expertise), and financial resources.",
  },
  keyActivities: {
    title: "Key Activities",
    icon: Zap,
    color: "yellow",
    description: "What key activities do your value propositions require? What about distribution channels, customer relationships, and revenue streams?",
    prompts: [
      "What are the most important actions your company must take to operate?",
      "What activities are essential to deliver your value proposition?",
      "Production, problem solving, or platform/network activities?",
    ],
    examples: [
      "Software development and product updates",
      "Customer acquisition and marketing campaigns",
      "Quality assurance and testing",
      "Customer success and support",
    ],
    helpText: "Focus on production (manufacturing, design), problem-solving (consulting, R&D), and platform/network (managing platforms) activities.",
  },
  keyPartnerships: {
    title: "Key Partnerships",
    icon: Handshake,
    color: "pink",
    description: "Who are your key partners and suppliers? Which key resources are you acquiring from them? Which key activities do partners perform?",
    prompts: [
      "Who are your strategic partners?",
      "Why do you partner with them?",
      "What resources or activities do they provide?",
      "Are they for optimization, risk reduction, or resource acquisition?",
    ],
    examples: [
      "Payment processor (Stripe) for transactions",
      "AWS for cloud infrastructure",
      "Marketing agency for demand generation",
      "Integration partners for ecosystem expansion",
    ],
    helpText: "Identify strategic alliances, co-opetition, joint ventures, and supplier relationships. Focus on optimization, risk mitigation, or resource acquisition.",
  },
  costStructure: {
    title: "Cost Structure",
    icon: Receipt,
    color: "red",
    description: "What are the most important costs in your business model? Which key resources and activities are most expensive?",
    prompts: [
      "What are your biggest costs?",
      "Which resources are most expensive?",
      "Which activities are most expensive?",
      "Are you cost-driven or value-driven?",
    ],
    examples: [
      "Engineering salaries ($500K/year)",
      "Cloud hosting and infrastructure ($50K/year)",
      "Customer acquisition cost ($200 per customer)",
      "Office and operations ($100K/year)",
    ],
    helpText: "List all major costs. Distinguish between fixed (salaries, rent) and variable (per-unit costs). Identify cost structure type: cost-driven vs value-driven.",
  },
}

export default function BusinessModelCanvasPage() {
  const [businessModels, setBusinessModels] = useState<BusinessModelCanvas[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<BusinessModelCanvas | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeBlock, setActiveBlock] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    versionName: "",
    status: "DRAFT" as "DRAFT" | "ACTIVE" | "ARCHIVED" | "TESTING",
    customerSegments: [] as CustomerSegment[],
    valuePropositions: [] as ValuePropositionBMC[],
    channels: [] as Channel[],
    customerRelationships: [] as CustomerRelationship[],
    revenueStreams: [] as RevenueStream[],
    keyResources: [] as KeyResource[],
    keyActivities: [] as KeyActivity[],
    keyPartnerships: [] as KeyPartnership[],
    costStructure: [] as CostStructure[],
    notes: "",
    targetMarket: "",
  })

  // Simple text fields for easier editing
  const [simpleFields, setSimpleFields] = useState({
    customerSegmentsText: "",
    valuePropositionsText: "",
    channelsText: "",
    customerRelationshipsText: "",
    revenueStreamsText: "",
    keyResourcesText: "",
    keyActivitiesText: "",
    keyPartnershipsText: "",
    costStructureText: "",
  })

  useEffect(() => {
    fetchBusinessModels()
  }, [])

  const fetchBusinessModels = async () => {
    try {
      const response = await fetch("/api/business-model")
      if (response.ok) {
        const data = await response.json()
        setBusinessModels(data)
        if (data.length > 0 && !selectedVersion) {
          setSelectedVersion(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching business models:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletion = () => {
    const blocks = [
      simpleFields.customerSegmentsText,
      simpleFields.valuePropositionsText,
      simpleFields.channelsText,
      simpleFields.customerRelationshipsText,
      simpleFields.revenueStreamsText,
      simpleFields.keyResourcesText,
      simpleFields.keyActivitiesText,
      simpleFields.keyPartnershipsText,
      simpleFields.costStructureText,
    ]
    const completed = blocks.filter(block => block.trim().length > 0).length
    return Math.round((completed / 9) * 100)
  }

  const handleCreate = async () => {
    try {
      // Convert simple text fields to structured data
      const structuredData = {
        ...formData,
        customerSegments: simpleFields.customerSegmentsText ? [{ 
          segment: "Customer Segments", 
          description: simpleFields.customerSegmentsText 
        }] : [],
        valuePropositions: simpleFields.valuePropositionsText ? [{ 
          proposition: "Value Propositions", 
          description: simpleFields.valuePropositionsText 
        }] : [],
        channels: simpleFields.channelsText ? [{ 
          channel: "Channels", 
          description: simpleFields.channelsText 
        }] : [],
        customerRelationships: simpleFields.customerRelationshipsText ? [{ 
          type: "Customer Relationships", 
          description: simpleFields.customerRelationshipsText 
        }] : [],
        revenueStreams: simpleFields.revenueStreamsText ? [{ 
          stream: "Revenue Streams", 
          description: simpleFields.revenueStreamsText 
        }] : [],
        keyResources: simpleFields.keyResourcesText ? [{ 
          resource: "Key Resources", 
          description: simpleFields.keyResourcesText 
        }] : [],
        keyActivities: simpleFields.keyActivitiesText ? [{ 
          activity: "Key Activities", 
          description: simpleFields.keyActivitiesText 
        }] : [],
        keyPartnerships: simpleFields.keyPartnershipsText ? [{ 
          partner: "Key Partnerships", 
          description: simpleFields.keyPartnershipsText 
        }] : [],
        costStructure: simpleFields.costStructureText ? [{ 
          cost: "Cost Structure", 
          description: simpleFields.costStructureText 
        }] : [],
      }

      const completionPercentage = calculateCompletion()
      const response = await fetch("/api/business-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...structuredData, completionPercentage }),
      })

      if (response.ok) {
        const newVersion = await response.json()
        await fetchBusinessModels()
        setSelectedVersion(newVersion)
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error creating business model:", error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedVersion) return

    try {
      // Convert simple text fields to structured data
      const structuredData = {
        ...formData,
        customerSegments: simpleFields.customerSegmentsText ? [{ 
          segment: "Customer Segments", 
          description: simpleFields.customerSegmentsText 
        }] : [],
        valuePropositions: simpleFields.valuePropositionsText ? [{ 
          proposition: "Value Propositions", 
          description: simpleFields.valuePropositionsText 
        }] : [],
        channels: simpleFields.channelsText ? [{ 
          channel: "Channels", 
          description: simpleFields.channelsText 
        }] : [],
        customerRelationships: simpleFields.customerRelationshipsText ? [{ 
          type: "Customer Relationships", 
          description: simpleFields.customerRelationshipsText 
        }] : [],
        revenueStreams: simpleFields.revenueStreamsText ? [{ 
          stream: "Revenue Streams", 
          description: simpleFields.revenueStreamsText 
        }] : [],
        keyResources: simpleFields.keyResourcesText ? [{ 
          resource: "Key Resources", 
          description: simpleFields.keyResourcesText 
        }] : [],
        keyActivities: simpleFields.keyActivitiesText ? [{ 
          activity: "Key Activities", 
          description: simpleFields.keyActivitiesText 
        }] : [],
        keyPartnerships: simpleFields.keyPartnershipsText ? [{ 
          partner: "Key Partnerships", 
          description: simpleFields.keyPartnershipsText 
        }] : [],
        costStructure: simpleFields.costStructureText ? [{ 
          cost: "Cost Structure", 
          description: simpleFields.costStructureText 
        }] : [],
      }

      const completionPercentage = calculateCompletion()
      const response = await fetch("/api/business-model", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedVersion.id, ...structuredData, completionPercentage }),
      })

      if (response.ok) {
        await fetchBusinessModels()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating business model:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business model canvas?")) return

    try {
      const response = await fetch(`/api/business-model?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchBusinessModels()
        if (selectedVersion?.id === id) {
          setSelectedVersion(businessModels[0] || null)
        }
      }
    } catch (error) {
      console.error("Error deleting business model:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      versionName: "",
      status: "DRAFT",
      customerSegments: [],
      valuePropositions: [],
      channels: [],
      customerRelationships: [],
      revenueStreams: [],
      keyResources: [],
      keyActivities: [],
      keyPartnerships: [],
      costStructure: [],
      notes: "",
      targetMarket: "",
    })
    setSimpleFields({
      customerSegmentsText: "",
      valuePropositionsText: "",
      channelsText: "",
      customerRelationshipsText: "",
      revenueStreamsText: "",
      keyResourcesText: "",
      keyActivitiesText: "",
      keyPartnershipsText: "",
      costStructureText: "",
    })
  }

  const loadVersionToForm = (version: BusinessModelCanvas) => {
    setFormData({
      versionName: version.versionName,
      status: version.status,
      customerSegments: version.customerSegments || [],
      valuePropositions: version.valuePropositions || [],
      channels: version.channels || [],
      customerRelationships: version.customerRelationships || [],
      revenueStreams: version.revenueStreams || [],
      keyResources: version.keyResources || [],
      keyActivities: version.keyActivities || [],
      keyPartnerships: version.keyPartnerships || [],
      costStructure: version.costStructure || [],
      notes: version.notes || "",
      targetMarket: version.targetMarket || "",
    })
    
    // Load simple text fields from structured data
    setSimpleFields({
      customerSegmentsText: version.customerSegments?.map(s => `${s.segment}: ${s.description || ''}`).join('\n\n') || "",
      valuePropositionsText: version.valuePropositions?.map(v => `${v.proposition}: ${v.problem || ''} - ${v.solution || ''}`).join('\n\n') || "",
      channelsText: version.channels?.map(c => `${c.channel}: ${c.phase || ''}`).join('\n\n') || "",
      customerRelationshipsText: version.customerRelationships?.map(r => `${r.type}: ${r.description || ''}`).join('\n\n') || "",
      revenueStreamsText: version.revenueStreams?.map(r => `${r.stream}: ${r.pricingModel || ''}`).join('\n\n') || "",
      keyResourcesText: version.keyResources?.map(r => `${r.resource}: ${r.type || ''}`).join('\n\n') || "",
      keyActivitiesText: version.keyActivities?.map(a => `${a.activity}: ${a.category || ''}`).join('\n\n') || "",
      keyPartnershipsText: version.keyPartnerships?.map(p => `${p.partner}: ${p.value || ''}`).join('\n\n') || "",
      costStructureText: version.costStructure?.map(c => `${c.cost}: ${c.type || ''}`).join('\n\n') || "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800"
      case "TESTING":
        return "bg-blue-100 text-blue-800"
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
      case "TESTING":
        return <Info className="w-4 h-4" />
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
          <p className="text-gray-600">Loading Business Model Canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Model Canvas</h1>
          <p className="text-gray-600">
            Strategic management tool to visualize, design, and innovate your business model
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-start md:justify-end">
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4" />
            Watch Tutorial
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showHistory
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showHistory ? <EyeOff className="w-4 h-4" /> : <History className="w-4 h-4" />}
            History
          </button>
          {!isCreating && !isEditing && (
            <button
              onClick={() => {
                setIsCreating(true)
                resetForm()
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              New Canvas
            </button>
          )}
        </div>
      </div>

      {/* Tutorial Video Modal - Full Screen Popup */}
      {showTutorial && (
        <div 
          className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowTutorial(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Business Model Canvas Masterclass</h2>
                  <p className="text-blue-100 text-sm">Complete guide from beginner to expert</p>
                </div>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Introduction Section */}
              <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  What is Business Model Canvas?
                </h3>
                <p className="text-blue-800 leading-relaxed mb-4">
                  The Business Model Canvas is a strategic management tool that helps you visualize, design, and reinvent your business model. 
                  It consists of 9 building blocks that cover the four main areas of a business: customers, offer, infrastructure, and financial viability.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">✅ Perfect For:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Startups validating business ideas</li>
                      <li>• Existing businesses pivoting</li>
                      <li>• Teams aligning on strategy</li>
                      <li>• Investors evaluating opportunities</li>
                    </ul>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🎯 Key Benefits:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Visualize entire business on one page</li>
                      <li>• Test assumptions quickly</li>
                      <li>• Communicate clearly with stakeholders</li>
                      <li>• Iterate and improve rapidly</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Video Tutorials Grid */}
              <div className="space-y-8">
                {/* Video 1 - Complete Overview */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Part 1: Complete Business Model Canvas Overview (16 min)
                    </h3>
                    <p className="text-sm text-orange-100 mt-1">Perfect for beginners - covers all 9 building blocks with examples</p>
                  </div>
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/QoAOzMTLP5s"
                      title="Business Model Canvas Explained"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <strong>What you'll learn:</strong> Introduction to all 9 blocks, how they interconnect, and real-world examples from successful companies.
                    </p>
                  </div>
                </div>

                {/* Video 2 - Practical Tutorial */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Part 2: How to Create Your Business Model Canvas (12 min)
                    </h3>
                    <p className="text-sm text-green-100 mt-1">Step-by-step practical guide to filling out your canvas</p>
                  </div>
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/IP0cUBWTgpY"
                      title="How to Create Business Model Canvas"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <strong>What you'll learn:</strong> Practical workshop-style tutorial showing exactly how to brainstorm and fill each block with your business ideas.
                    </p>
                  </div>
                </div>

                {/* Video 3 - Real Examples */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Part 3: Real Business Model Examples - Uber, Airbnb, Netflix (10 min)
                    </h3>
                    <p className="text-sm text-purple-100 mt-1">Analyze successful business models to learn patterns</p>
                  </div>
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/0Im0-Ht6YiM"
                      title="Business Model Canvas Examples"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <strong>What you'll learn:</strong> Deep dive into how tech giants structured their business models, key patterns to replicate, and lessons learned.
                    </p>
                  </div>
                </div>

                {/* Video 4 - Advanced Strategies */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Part 4: Testing & Validating Your Business Model (14 min)
                    </h3>
                    <p className="text-sm text-indigo-100 mt-1">Learn how to test assumptions and iterate your model</p>
                  </div>
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/Wvk1oXz6pYc"
                      title="Business Model Validation"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <strong>What you'll learn:</strong> How to test your business model hypotheses, get customer feedback, and iterate based on real data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Reference Guide */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-orange-200 rounded-lg p-5">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Customer Side
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li><strong>Customer Segments:</strong> Who are you serving?</li>
                    <li><strong>Value Propositions:</strong> What problems do you solve?</li>
                    <li><strong>Channels:</strong> How do you reach customers?</li>
                    <li><strong>Customer Relationships:</strong> How do you interact?</li>
                    <li><strong>Revenue Streams:</strong> How do you make money?</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Boxes className="w-5 h-5" />
                    Infrastructure
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li><strong>Key Resources:</strong> What assets do you need?</li>
                    <li><strong>Key Activities:</strong> What must you do?</li>
                    <li><strong>Key Partnerships:</strong> Who helps you?</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-5">
                  <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Viability
                  </h4>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li><strong>Cost Structure:</strong> What are your expenses?</li>
                    <li><strong>Revenue Model:</strong> How much do you charge?</li>
                    <li><strong>Profitability:</strong> Revenue &gt; Costs?</li>
                  </ul>
                </div>
              </div>

              {/* Pro Tips Section */}
              <div className="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Pro Tips for Success
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">✍️ When Creating:</h4>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• Start with Customer Segments - everything flows from understanding your customers</li>
                      <li>• Use sticky notes initially - embrace messy brainstorming</li>
                      <li>• Work with your team - diverse perspectives = better model</li>
                      <li>• Be specific with numbers - "SMBs 10-50 employees" not just "small businesses"</li>
                      <li>• Draw connections between blocks - they all interact!</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">🔄 When Iterating:</h4>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• Test ONE assumption at a time - don't change everything at once</li>
                      <li>• Talk to real customers weekly - they'll tell you what's wrong</li>
                      <li>• Create new versions regularly - track your evolution</li>
                      <li>• Compare with competitors - learn from their models</li>
                      <li>• Celebrate pivots - changing is progress, not failure!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Common Mistakes to Avoid */}
              <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  Common Mistakes to Avoid
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">❌ Don't Do This:</h4>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li>• Making it perfect before testing with customers</li>
                      <li>• Targeting "everyone" as your customer segment</li>
                      <li>• Ignoring the cost structure (most critical!)</li>
                      <li>• Creating alone without team input</li>
                      <li>• Treating it as a one-time exercise</li>
                      <li>• Being vague - "good quality" tells you nothing</li>
                    </ul>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Do This Instead:</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Create quickly, test with 5-10 customers, iterate</li>
                      <li>• Define specific niches: "Remote SaaS teams 10-50 people"</li>
                      <li>• Calculate break-even point in first draft</li>
                      <li>• Run workshops with co-founders and key team members</li>
                      <li>• Review and update monthly or after major learnings</li>
                      <li>• Be quantifiable: "Reduce costs by 40%" or "Save 10 hours/week"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Steps */}
              <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Ready to Get Started? Follow These Steps:
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">1.</span>
                    <span>Watch Part 1 video above to understand all 9 blocks (16 minutes well spent!)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">2.</span>
                    <span>Click "New Canvas" button and start with Customer Segments - who exactly will pay you?</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">3.</span>
                    <span>Fill out Value Propositions next - what specific problem do you solve for them?</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">4.</span>
                    <span>Work through Revenue Streams and Cost Structure - the money matters most!</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">5.</span>
                    <span>Complete remaining blocks, save as "Draft v1", then test with 5 real potential customers</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-lg">6.</span>
                    <span>Come back here weekly, watch Part 4, and iterate based on what you learned!</span>
                  </li>
                </ol>
              </div>

              {/* Close Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Close Tutorial & Start Creating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-lg p-6 max-h-[900px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-orange-600" />
              Versions
            </h2>
            {businessModels.length === 0 ? (
              <p className="text-gray-500 text-sm">No canvases created yet</p>
            ) : (
              <div className="space-y-3">
                {businessModels.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => {
                      setSelectedVersion(bm)
                      setIsCreating(false)
                      setIsEditing(false)
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVersion?.id === bm.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">v{bm.versionNumber}</span>
                      <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(bm.status)}`}>
                        {getStatusIcon(bm.status)}
                        {bm.status}
                      </div>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{bm.versionName}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(bm.createdAt).toLocaleDateString()}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${bm.completionPercentage || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{bm.completionPercentage || 0}% complete</p>
                    {selectedVersion?.id === bm.id && !isCreating && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            loadVersionToForm(bm)
                            setIsEditing(true)
                          }}
                          className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(bm.id)
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
        <div className="flex-1 min-w-0">
          {isCreating || isEditing ? (
            // Edit/Create Mode - Will add detailed forms in next part
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  {isCreating ? "Create New Canvas" : "Edit Canvas"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Name *
                    </label>
                    <input
                      type="text"
                      value={formData.versionName}
                      onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
                      placeholder="e.g., Initial Model, Post-Pivot, Q3 2025"
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
                          status: e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED" | "TESTING",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="TESTING">Testing</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market
                  </label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    placeholder="Who is this business model targeting?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Completion Progress */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Canvas Completion</span>
                    <span className="text-sm font-bold text-orange-600">{calculateCompletion()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all"
                      style={{ width: `${calculateCompletion()}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 9 Building Blocks - Simplified Editors */}
              <div className="space-y-6 max-w-4xl">
                {/* 1. Customer Segments */}
                <div className="bg-blue-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-blue-900" />
                    <h3 className="text-lg font-bold text-blue-900">1. Customer Segments</h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-4">Who are your most important customers?</p>
                  
                  <textarea
                    value={simpleFields.customerSegmentsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, customerSegmentsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Small businesses with 10-50 employees who need accounting software&#10;&#10;Tech-savvy millennials aged 25-35 who prefer mobile apps&#10;&#10;Enterprise companies with 500+ employees needing custom solutions"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                    <p className="text-sm text-blue-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Think of your customers like groups of friends at school. Each group has different interests! 
                      For example: "Tech-savvy small business owners aged 30-45 who hate doing paperwork" or 
                      "Busy parents who need to save time on grocery shopping". Be specific about WHO they are, 
                      WHAT problems they have, and HOW MANY of them exist.
                    </p>
                  </div>
                </div>

                {/* 2. Value Propositions */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Gift className="w-6 h-6 text-orange-900" />
                    <h3 className="text-lg font-bold text-orange-900">2. Value Propositions</h3>
                  </div>
                  <p className="text-sm text-orange-800 mb-4">What value do you deliver to customers?</p>
                  
                  <textarea
                    value={simpleFields.valuePropositionsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, valuePropositionsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Save 10 hours per week on manual data entry through AI automation&#10;&#10;Reduce operational costs by 40% with smart workflow optimization&#10;&#10;Get 99.9% uptime guarantee with 24/7 support"
                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                    <p className="text-sm text-orange-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-orange-800 leading-relaxed">
                      What's the SUPERPOWER you give to customers? Like a magic wand! For example: "Our app turns 
                      8 hours of boring work into just 30 minutes" or "We make sure you never forget your mom's 
                      birthday again!" Answer these: What PAIN do they have? What's your SOLUTION? Why are you 
                      BETTER than others doing the same thing?
                    </p>
                  </div>
                </div>

                {/* 3. Channels */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-900" />
                    <h3 className="text-lg font-bold text-green-900">3. Channels</h3>
                  </div>
                  <p className="text-sm text-green-800 mb-4">How do you reach and serve customers?</p>
                  <textarea
                    value={simpleFields.channelsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, channelsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Instagram & Facebook ads to create awareness&#10;&#10;Company website for product information and purchases&#10;&#10;Email marketing for customer retention&#10;&#10;Mobile app for direct sales"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-green-800 leading-relaxed">
                      This is HOW customers find you and buy from you - like the path to a treasure! Examples: 
                      "They find us on Instagram ads" → "They visit our website" → "They buy through our app" → 
                      "We deliver via email". Think of it as: How do they DISCOVER you? How do they BUY? 
                      How do they GET your product/service?
                    </p>
                  </div>
                </div>

                {/* 4. Customer Relationships */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-900" />
                    <h3 className="text-lg font-bold text-purple-900">4. Customer Relationships</h3>
                  </div>
                  <p className="text-sm text-purple-800 mb-4">How do you interact with each customer segment?</p>
                  <textarea
                    value={simpleFields.customerRelationshipsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, customerRelationshipsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;24/7 live chat support for premium customers&#10;&#10;Self-service knowledge base and tutorials&#10;&#10;Monthly webinars and training sessions&#10;&#10;Dedicated account manager for enterprise clients"
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-purple-100 border border-purple-300 rounded-lg">
                    <p className="text-sm text-purple-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      How do you treat your customers? Like friends at a party! Are you: The helpful host who 
                      personally helps everyone (Personal assistance)? Or do you set up a buffet where people 
                      help themselves (Self-service)? Examples: "24/7 live chat support", "Automated email tips", 
                      "Private Facebook community where customers help each other"
                    </p>
                  </div>
                </div>

                {/* 5. Revenue Streams */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-emerald-900" />
                    <h3 className="text-lg font-bold text-emerald-900">5. Revenue Streams</h3>
                  </div>
                  <p className="text-sm text-emerald-800 mb-4">How do you generate revenue from each customer segment?</p>
                  
                  <textarea
                    value={simpleFields.revenueStreamsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, revenueStreamsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Monthly SaaS subscription - $49/month per user&#10;&#10;One-time software license - $299&#10;&#10;Commission-based - 10% of each transaction&#10;&#10;Freemium model - Free basic + Premium $99/year"
                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-lg">
                    <p className="text-sm text-emerald-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      This is your MONEY MACHINE! How do people pay you? Like a lemonade stand: Do they pay 
                      $1 each time (One-time sale)? Or $5 every month to get lemonade whenever they want 
                      (Subscription)? Examples: "Monthly subscription $49/month", "One-time purchase $299", 
                      "Pay per use - $0.10 per minute", "Free basic + Premium $99/year"
                    </p>
                  </div>
                </div>

                {/* 6. Key Resources */}
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Boxes className="w-6 h-6 text-indigo-900" />
                    <h3 className="text-lg font-bold text-indigo-900">6. Key Resources</h3>
                  </div>
                  <p className="text-sm text-indigo-800 mb-4">What key assets are essential to your business model?</p>
                  <textarea
                    value={simpleFields.keyResourcesText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, keyResourcesText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Team of 10 experienced software developers&#10;&#10;Proprietary AI algorithm with patents&#10;&#10;$500K in funding for operations&#10;&#10;Modern office space and computers&#10;&#10;Strong brand reputation in the market"
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-indigo-100 border border-indigo-300 rounded-lg">
                    <p className="text-sm text-indigo-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      What STUFF do you absolutely NEED to run your business? Like ingredients for baking cookies! 
                      This could be: THINGS you can touch (computers, office, factory), SMART STUFF (your app code, 
                      patents, brand name), PEOPLE (developers, salespeople), or MONEY (cash in the bank). 
                      Example: "10 software developers", "Our secret recipe", "$100K in bank"
                    </p>
                  </div>
                </div>

                {/* 7. Key Activities */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-900" />
                    <h3 className="text-lg font-bold text-yellow-900">7. Key Activities</h3>
                  </div>
                  <p className="text-sm text-yellow-800 mb-4">What key actions must you perform to operate successfully?</p>
                  <textarea
                    value={simpleFields.keyActivitiesText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, keyActivitiesText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Daily software development and coding&#10;&#10;Customer support and problem solving&#10;&#10;Marketing and social media campaigns&#10;&#10;Product testing and quality assurance&#10;&#10;Sales calls and customer acquisition"
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      What do you DO every day to keep your business running? Like daily chores! If you're 
                      making an app: "Write code every day", "Fix bugs", "Talk to customers". If you're selling 
                      cookies: "Bake cookies", "Deliver to stores", "Create new recipes". What are the MOST 
                      IMPORTANT tasks you must do to make money?
                    </p>
                  </div>
                </div>

                {/* 8. Key Partnerships */}
                <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Handshake className="w-6 h-6 text-pink-900" />
                    <h3 className="text-lg font-bold text-pink-900">8. Key Partnerships</h3>
                  </div>
                  <p className="text-sm text-pink-800 mb-4">Who are your key partners and suppliers?</p>
                  <textarea
                    value={simpleFields.keyPartnershipsText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, keyPartnershipsText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Amazon Web Services for cloud hosting&#10;&#10;FedEx for product delivery and logistics&#10;&#10;Payment processor like Stripe or PayPal&#10;&#10;Marketing agency for advertising campaigns&#10;&#10;Legal firm for contracts and compliance"
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-pink-100 border border-pink-300 rounded-lg">
                    <p className="text-sm text-pink-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-pink-800 leading-relaxed">
                      Who are your HELPERS and FRIENDS in business? You can't do everything alone! Like having 
                      teammates. Examples: "Amazon Web Services hosts our website", "FedEx delivers our packages", 
                      "Local bakery supplies our ingredients", "Marketing agency creates our ads". Who do you 
                      DEPEND ON? Who helps make your business work?
                    </p>
                  </div>
                </div>

                {/* 9. Cost Structure */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Receipt className="w-6 h-6 text-red-900" />
                    <h3 className="text-lg font-bold text-red-900">9. Cost Structure</h3>
                  </div>
                  <p className="text-sm text-red-800 mb-4">What are the most important costs in your business model?</p>
                  <textarea
                    value={simpleFields.costStructureText}
                    onChange={(e) => setSimpleFields({ ...simpleFields, costStructureText: e.target.value })}
                    rows={6}
                    placeholder="Example:&#10;&#10;Employee salaries - $25,000/month (5 employees)&#10;&#10;Office rent and utilities - $3,000/month&#10;&#10;Cloud hosting (AWS) - $500/month&#10;&#10;Marketing and advertising - $2,000/month&#10;&#10;Software licenses and tools - $300/month"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm text-red-900 font-semibold mb-2">🎯 Super Simple Tip:</p>
                    <p className="text-xs text-red-800 leading-relaxed">
                      What do you SPEND money on? Your piggy bank going OUT! Think about: Money you pay EVERY 
                      month no matter what (rent, salaries, website hosting) = FIXED costs. Money that changes 
                      based on sales (shipping, materials) = VARIABLE costs. Examples: "Office rent $2000/month", 
                      "5 employees × $5000/month = $25000", "Facebook ads $500/month"
                    </p>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Any additional context, assumptions, or insights about your business model..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? "Create Canvas" : "Update Canvas"}
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
            // View Mode - Will add detailed view in next part
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
                    {selectedVersion.completionPercentage || 0}% complete
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadVersionToForm(selectedVersion)
                    setIsEditing(true)
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Edit Canvas
                </button>
              </div>

              {/* Business Model Canvas - 9 Block View */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Column - Key Partners & Activities & Resources */}
                <div className="space-y-4">
                  {/* Key Partnerships */}
                  <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-5 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Handshake className="w-5 h-5 text-pink-900" />
                      <h3 className="font-bold text-pink-900">Key Partnerships</h3>
                    </div>
                    {selectedVersion.keyPartnerships.length === 0 ? (
                      <p className="text-sm text-pink-700 italic">No partnerships added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.keyPartnerships.map((p: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-pink-900">{p.partner}</p>
                            <p className="text-xs text-pink-700">{p.type} • {p.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Key Activities */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-900" />
                      <h3 className="font-bold text-yellow-900">Key Activities</h3>
                    </div>
                    {selectedVersion.keyActivities.length === 0 ? (
                      <p className="text-sm text-yellow-700 italic">No activities added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.keyActivities.map((a: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-yellow-900">{a.activity}</p>
                            <p className="text-xs text-yellow-700">{a.category} • {a.frequency}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Key Resources */}
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Boxes className="w-5 h-5 text-indigo-900" />
                      <h3 className="font-bold text-indigo-900">Key Resources</h3>
                    </div>
                    {selectedVersion.keyResources.length === 0 ? (
                      <p className="text-sm text-indigo-700 italic">No resources added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.keyResources.map((r: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-indigo-900">{r.resource}</p>
                            <p className="text-xs text-indigo-700">{r.type} • {r.ownership}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Column - Value Props, Customer Relationships, Channels, Customer Segments */}
                <div className="space-y-4">
                  {/* Value Propositions */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 min-h-[250px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-5 h-5 text-orange-900" />
                      <h3 className="font-bold text-orange-900">Value Propositions</h3>
                    </div>
                    {selectedVersion.valuePropositions.length === 0 ? (
                      <p className="text-sm text-orange-700 italic">No value propositions added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.valuePropositions.map((v: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded text-sm">
                            <p className="font-semibold text-orange-900 mb-1">{v.proposition}</p>
                            <p className="text-xs text-orange-700 mb-1"><strong>Problem:</strong> {v.problem}</p>
                            <p className="text-xs text-orange-700"><strong>Solution:</strong> {v.solution}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Customer Relationships */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 min-h-[150px]">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-purple-900" />
                      <h3 className="font-bold text-purple-900">Customer Relationships</h3>
                    </div>
                    {selectedVersion.customerRelationships.length === 0 ? (
                      <p className="text-sm text-purple-700 italic">No relationships defined</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.customerRelationships.map((cr: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-purple-900">{cr.type}</p>
                            <p className="text-xs text-purple-700">{cr.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Channels */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-900" />
                      <h3 className="font-bold text-green-900">Channels</h3>
                    </div>
                    {selectedVersion.channels.length === 0 ? (
                      <p className="text-sm text-green-700 italic">No channels added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.channels.map((c: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-green-900">{c.channel}</p>
                            <p className="text-xs text-green-700">{c.phase} • {c.type} • {c.direct ? 'Direct' : 'Partner'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Customer Segments, Revenue, Costs */}
                <div className="space-y-4">
                  {/* Customer Segments */}
                  <div className="bg-blue-50 border-2 border-orange-200 rounded-xl p-5 min-h-[250px]">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-blue-900" />
                      <h3 className="font-bold text-blue-900">Customer Segments</h3>
                    </div>
                    {selectedVersion.customerSegments.length === 0 ? (
                      <p className="text-sm text-blue-700 italic">No segments defined</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.customerSegments.map((cs: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded text-sm">
                            <p className="font-semibold text-blue-900 mb-1">{cs.segment}</p>
                            <p className="text-xs text-blue-700 mb-1">{cs.description}</p>
                            {cs.size && <p className="text-xs text-blue-600">Size: {cs.size}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Revenue Streams */}
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-emerald-900" />
                      <h3 className="font-bold text-emerald-900">Revenue Streams</h3>
                    </div>
                    {selectedVersion.revenueStreams.length === 0 ? (
                      <p className="text-sm text-emerald-700 italic">No revenue streams added</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedVersion.revenueStreams.map((rs: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm">
                            <p className="font-semibold text-emerald-900">{rs.stream}</p>
                            <p className="text-xs text-emerald-700">{rs.type} • {rs.pricingModel} • {rs.frequency}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cost Structure - Full Width at Bottom */}
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-5 h-5 text-red-900" />
                  <h3 className="font-bold text-red-900">Cost Structure</h3>
                </div>
                {selectedVersion.costStructure.length === 0 ? (
                  <p className="text-sm text-red-700 italic">No costs defined</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedVersion.costStructure.map((cost: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded text-sm">
                        <p className="font-semibold text-red-900">{cost.cost}</p>
                        <p className="text-xs text-red-700">{cost.type} • {cost.fixed ? 'Fixed' : 'Variable'} • {cost.frequency}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedVersion.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedVersion.notes}</p>
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
                  No Business Model Canvas Created Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start designing your business model to understand how you create, deliver, and capture value
                </p>
                <button
                  onClick={() => {
                    setIsCreating(true)
                    resetForm()
                  }}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Canvas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
