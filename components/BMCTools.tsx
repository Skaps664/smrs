import { useState } from "react"
import { Sparkles, TrendingUp, Calculator, Users, DollarSign, Lightbulb, Target, Zap } from "lucide-react"

// AI Idea Generator Component
export function IdeaGenerator({ blockType, onInsert }: { blockType: string; onInsert: (idea: string) => void }) {
  const [generating, setGenerating] = useState(false)

  const ideaTemplates: Record<string, string[]> = {
    customerSegments: [
      "Early adopters (Tech-savvy innovators aged 25-40)",
      "Small businesses (10-50 employees, $1-10M revenue)",
      "Enterprise clients (Fortune 500 companies)",
      "Prosumers (Professional consumers with high purchasing power)",
      "SMBs in specific vertical (Healthcare, Finance, Retail)",
    ],
    valuePropositions: [
      "10x faster than traditional methods",
      "Save $50K annually on operational costs",
      "Increase conversion rates by 35%",
      "24/7 automated solution with human-level accuracy",
      "Zero setup time with instant results",
    ],
    revenueStreams: [
      "Freemium: Free basic, $29-$99/mo premium tiers",
      "Enterprise licensing: $10K-$100K annual contracts",
      "Transaction fees: 2-5% per transaction",
      "Usage-based: Pay per API call/user/feature",
      "Hybrid: Base subscription + usage overage",
    ],
  }

  const generateIdea = () => {
    setGenerating(true)
    setTimeout(() => {
      const templates = ideaTemplates[blockType] || ["Generic business model idea"]
      const randomIdea = templates[Math.floor(Math.random() * templates.length)]
      onInsert(randomIdea)
      setGenerating(false)
    }, 800)
  }

  return (
    <button
      onClick={generateIdea}
      disabled={generating}
      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
    >
      {generating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          AI Generate
        </>
      )}
    </button>
  )
}

// Market Size Calculator
export function MarketSizeCalculator() {
  const [tam, setTam] = useState("")
  const [sam, setSam] = useState("")
  const [penetration, setPenetration] = useState("5")
  
  const calculateSOM = () => {
    const tamNum = parseFloat(tam) || 0
    const samNum = parseFloat(sam) || tamNum * 0.3 // Default SAM to 30% of TAM
    const pen = parseFloat(penetration) / 100
    return (samNum * pen).toFixed(2)
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-blue-600" />
        <h4 className="font-bold text-blue-200">Market Size Calculator</h4>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-blue-300 mb-1">
            TAM - Total Addressable Market ($M)
          </label>
          <input
            type="number"
            value={tam}
            onChange={(e) => setTam(e.target.value)}
            placeholder="e.g., 1000"
            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-300 mb-1">
            SAM - Serviceable Available Market ($M)
          </label>
          <input
            type="number"
            value={sam}
            onChange={(e) => setSam(e.target.value)}
            placeholder={`e.g., ${(parseFloat(tam) * 0.3 || 300).toFixed(0)}`}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-300 mb-1">
            Target Market Penetration (%)
          </label>
          <input
            type="range"
            value={penetration}
            onChange={(e) => setPenetration(e.target.value)}
            min="1"
            max="20"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-blue-400">
            <span>1%</span>
            <span className="font-bold">{penetration}%</span>
            <span>20%</span>
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg border-2 border-blue-300">
          <p className="text-xs text-blue-400 mb-1">SOM - Serviceable Obtainable Market</p>
          <p className="text-2xl font-bold text-blue-200">${calculateSOM()}M</p>
          <p className="text-xs text-blue-600 mt-1">Your realistic market opportunity</p>
        </div>
      </div>
    </div>
  )
}

// Pricing Strategy Calculator
export function PricingCalculator() {
  const [cac, setCac] = useState("")
  const [ltv, setLtv] = useState("")
  const [margin, setMargin] = useState("70")

  const getLTVtoCAC = () => {
    const ltvNum = parseFloat(ltv) || 0
    const cacNum = parseFloat(cac) || 1
    return (ltvNum / cacNum).toFixed(1)
  }

  const getHealthStatus = () => {
    const ratio = parseFloat(getLTVtoCAC())
    if (ratio >= 3) return { color: "green", text: "Healthy", emoji: "✅" }
    if (ratio >= 2) return { color: "yellow", text: "Moderate", emoji: "⚠️" }
    return { color: "red", text: "Unhealthy", emoji: "❌" }
  }

  const status = getHealthStatus()

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-500/10 border-2 border-emerald-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-5 h-5 text-emerald-600" />
        <h4 className="font-bold text-emerald-200">Pricing Health Check</h4>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-emerald-300 mb-1">
            Customer Acquisition Cost (CAC) $
          </label>
          <input
            type="number"
            value={cac}
            onChange={(e) => setCac(e.target.value)}
            placeholder="e.g., 200"
            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-emerald-300 mb-1">
            Customer Lifetime Value (LTV) $
          </label>
          <input
            type="number"
            value={ltv}
            onChange={(e) => setLtv(e.target.value)}
            placeholder="e.g., 600"
            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-emerald-300 mb-1">
            Gross Margin (%)
          </label>
          <input
            type="range"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            min="20"
            max="95"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-emerald-400">
            <span>20%</span>
            <span className="font-bold">{margin}%</span>
            <span>95%</span>
          </div>
        </div>
        <div className={`bg-${status.color}-100 border-2 border-${status.color}-300 p-3 rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-300">LTV:CAC Ratio</p>
            <span className="text-2xl">{status.emoji}</span>
          </div>
          <p className="text-3xl font-bold text-gray-100">{getLTVtoCAC()}:1</p>
          <p className={`text-xs text-${status.color}-700 mt-1 font-medium`}>
            {status.text} • Target: 3:1 or higher
          </p>
        </div>
        <div className="text-xs text-emerald-400 space-y-1">
          <p>💡 <strong>Rule of thumb:</strong></p>
          <p>• LTV should be 3x+ your CAC</p>
          <p>• Payback period: CAC / (MRR × margin) months</p>
        </div>
      </div>
    </div>
  )
}

// Break-even Calculator
export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("")
  const [variableCost, setVariableCost] = useState("")
  const [price, setPrice] = useState("")

  const calculateBreakEven = () => {
    const fc = parseFloat(fixedCosts) || 0
    const vc = parseFloat(variableCost) || 0
    const p = parseFloat(price) || 1
    const contribution = p - vc
    if (contribution <= 0) return "N/A"
    return Math.ceil(fc / contribution).toLocaleString()
  }

  const calculateRevenue = () => {
    const units = calculateBreakEven()
    if (units === "N/A") return "N/A"
    return (parseFloat(units.replace(/,/g, "")) * parseFloat(price || "0")).toLocaleString()
  }

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-orange-600" />
        <h4 className="font-bold text-orange-200">Break-Even Analysis</h4>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-orange-300 mb-1">
            Monthly Fixed Costs ($)
          </label>
          <input
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-orange-300 mb-1">
            Variable Cost per Unit ($)
          </label>
          <input
            type="number"
            value={variableCost}
            onChange={(e) => setVariableCost(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-orange-300 mb-1">
            Selling Price per Unit ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 50"
            className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a1a] p-3 rounded-lg border-2 border-orange-300">
            <p className="text-xs text-orange-400 mb-1">Break-Even Units</p>
            <p className="text-xl font-bold text-orange-200">{calculateBreakEven()}</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border-2 border-orange-300">
            <p className="text-xs text-orange-400 mb-1">Break-Even Revenue</p>
            <p className="text-xl font-bold text-orange-200">${calculateRevenue()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Example Templates
export function ExampleTemplates({ blockType, onSelect }: { blockType: string; onSelect: (example: any) => void }) {
  const examples: Record<string, any[]> = {
    customerSegments: [
      {
        name: "Airbnb Example",
        data: [
          { segment: "Travelers", description: "Budget-conscious millennials seeking unique experiences", size: "100M users", demographics: "Age 25-40, Urban, Middle-income" },
          { segment: "Hosts", description: "Property owners seeking extra income", size: "4M hosts", demographics: "Homeowners, Entrepreneurial" }
        ]
      },
      {
        name: "Slack Example",
        data: [
          { segment: "Tech Startups", description: "10-100 employee tech companies", size: "50K companies", demographics: "Cloud-native, Remote-first" },
          { segment: "Enterprise IT", description: "Fortune 1000 IT departments", size: "1K companies", demographics: "Large teams, Security-focused" }
        ]
      },
    ],
    revenueStreams: [
      {
        name: "Spotify Model",
        data: [
          { stream: "Premium Subscriptions", type: "Recurring", pricingModel: "Tiered", frequency: "Monthly" },
          { stream: "Ad-Supported Free Tier", type: "Advertising", pricingModel: "CPM", frequency: "Continuous" }
        ]
      },
      {
        name: "AWS Model",
        data: [
          { stream: "Pay-as-you-go", type: "Usage-based", pricingModel: "Dynamic", frequency: "Per-second billing" },
          { stream: "Reserved Instances", type: "Commitment", pricingModel: "Discount", frequency: "1-3 year contracts" }
        ]
      },
    ],
  }

  const blockExamples = examples[blockType] || []

  if (blockExamples.length === 0) return null

  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-purple-600" />
        <h5 className="text-sm font-bold text-purple-200">Learn from Successful Companies</h5>
      </div>
      <div className="space-y-2">
        {blockExamples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(example.data)}
            className="w-full text-left px-3 py-2 bg-[#1a1a1a] border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <p className="text-sm font-semibold text-purple-200">{example.name}</p>
            <p className="text-xs text-purple-600">Click to use as template</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// Tutorial Video Embed
export function TutorialVideo({ title, videoId }: { title: string; videoId: string }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="p-3 bg-gray-800">
        <p className="text-sm font-medium text-white">{title}</p>
      </div>
    </div>
  )
}

// Quick Stats Dashboard
export function QuickStats({ canvas }: { canvas: any }) {
  const stats = [
    {
      label: "Customer Segments",
      value: canvas.customerSegments?.length || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Revenue Streams",
      value: canvas.revenueStreams?.length || 0,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Key Activities",
      value: canvas.keyActivities?.length || 0,
      icon: Zap,
      color: "yellow",
    },
    {
      label: "Partnerships",
      value: canvas.keyPartnerships?.length || 0,
      icon: TrendingUp,
      color: "pink",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={idx}
            className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 rounded-lg p-3 text-center`}
          >
            <Icon className={`w-6 h-6 text-${stat.color}-600 mx-auto mb-2`} />
            <p className={`text-2xl font-bold text-${stat.color}-900`}>{stat.value}</p>
            <p className={`text-xs text-${stat.color}-700`}>{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
