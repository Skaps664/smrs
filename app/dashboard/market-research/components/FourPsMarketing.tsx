"use client"

import { Package, DollarSign, MapPin, Megaphone, Info } from "lucide-react"

interface FourPsData {
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

interface FourPsProps {
  data: FourPsData
  onChange: (data: FourPsData) => void
}

export default function FourPsMarketing({ data, onChange }: FourPsProps) {
  const updateField = (category: keyof FourPsData, field: string, value: any) => {
    onChange({
      ...data,
      [category]: {
        ...data[category],
        [field]: value
      }
    })
  }

  const addArrayItem = (category: keyof FourPsData, field: string, value: string) => {
    if (!value.trim()) return
    const current = (data[category] as any)[field]
    if (Array.isArray(current)) {
      onChange({
        ...data,
        [category]: {
          ...data[category],
          [field]: [...current, value.trim()]
        }
      })
    }
  }

  const removeArrayItem = (category: keyof FourPsData, field: string, index: number) => {
    const current = (data[category] as any)[field]
    if (Array.isArray(current)) {
      onChange({
        ...data,
        [category]: {
          ...data[category],
          [field]: current.filter((_, i) => i !== index)
        }
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Package className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Four P's Marketing Mix</h2>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute left-0 top-6 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <p className="font-bold mb-2">Marketing Mix Framework:</p>
            <p><strong>Product:</strong> What you're selling and its features/benefits</p>
            <p className="mt-1"><strong>Price:</strong> Pricing strategy and value perception</p>
            <p className="mt-1"><strong>Place:</strong> Distribution channels and market coverage</p>
            <p className="mt-1"><strong>Promotion:</strong> Marketing communications and awareness</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PRODUCT */}
        <div className="border-2 border-purple-200 rounded-xl p-5 bg-purple-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-purple-900">Product</h3>
          </div>
          <p className="text-xs text-purple-700 mb-3">What you offer and how it solves problems</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Product Description
              </label>
              <textarea
                value={data.product.description}
                onChange={(e) => updateField('product', 'description', e.target.value)}
                placeholder="Describe your product/service..."
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Key Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="product-features"
                  placeholder="e.g., Cloud-based platform"
                  className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('product', 'features', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('product-features') as HTMLInputElement
                    addArrayItem('product', 'features', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-purple-200 text-sm">
                    <span className="text-gray-700">• {feature}</span>
                    <button
                      onClick={() => removeArrayItem('product', 'features', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Key Benefits
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="product-benefits"
                  placeholder="e.g., Saves 10 hours per week"
                  className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('product', 'benefits', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('product-benefits') as HTMLInputElement
                    addArrayItem('product', 'benefits', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.product.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-purple-200 text-sm">
                    <span className="text-gray-700">• {benefit}</span>
                    <button
                      onClick={() => removeArrayItem('product', 'benefits', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Differentiation
              </label>
              <textarea
                value={data.product.differentiation}
                onChange={(e) => updateField('product', 'differentiation', e.target.value)}
                placeholder="What makes your product unique?"
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* PRICE */}
        <div className="border-2 border-green-200 rounded-xl p-5 bg-green-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-900">Price</h3>
          </div>
          <p className="text-xs text-green-700 mb-3">Pricing strategy and value capture</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pricing Strategy
              </label>
              <select
                value={data.price.strategy}
                onChange={(e) => updateField('price', 'strategy', e.target.value)}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-sm"
              >
                <option value="">Select strategy...</option>
                <option value="premium">Premium Pricing</option>
                <option value="penetration">Penetration Pricing</option>
                <option value="competitive">Competitive Pricing</option>
                <option value="value-based">Value-Based Pricing</option>
                <option value="freemium">Freemium Model</option>
                <option value="subscription">Subscription Model</option>
                <option value="cost-plus">Cost-Plus Pricing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price Point
              </label>
              <input
                type="text"
                value={data.price.pricePoint}
                onChange={(e) => updateField('price', 'pricePoint', e.target.value)}
                placeholder="e.g., $49/month or $499 one-time"
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Cost Structure
              </label>
              <textarea
                value={data.price.costStructure}
                onChange={(e) => updateField('price', 'costStructure', e.target.value)}
                placeholder="Fixed costs, variable costs, margins..."
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Competitor Pricing
              </label>
              <textarea
                value={data.price.competitorPricing}
                onChange={(e) => updateField('price', 'competitorPricing', e.target.value)}
                placeholder="How competitors price similar offerings..."
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* PLACE */}
        <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Place</h3>
          </div>
          <p className="text-xs text-blue-700 mb-3">Distribution channels and accessibility</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Distribution Channels
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="place-channels"
                  placeholder="e.g., Direct sales, E-commerce"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('place', 'channels', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('place-channels') as HTMLInputElement
                    addArrayItem('place', 'channels', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.place.channels.map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 text-sm">
                    <span className="text-gray-700">• {channel}</span>
                    <button
                      onClick={() => removeArrayItem('place', 'channels', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Distribution Strategy
              </label>
              <textarea
                value={data.place.distribution}
                onChange={(e) => updateField('place', 'distribution', e.target.value)}
                placeholder="How products/services reach customers..."
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Market Coverage
              </label>
              <select
                value={data.place.coverage}
                onChange={(e) => updateField('place', 'coverage', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="">Select coverage...</option>
                <option value="intensive">Intensive (Maximum outlets)</option>
                <option value="selective">Selective (Limited partners)</option>
                <option value="exclusive">Exclusive (Single distributor)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Geographic Locations
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="place-locations"
                  placeholder="e.g., North America, Online"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('place', 'locations', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('place-locations') as HTMLInputElement
                    addArrayItem('place', 'locations', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.place.locations.map((location, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 text-sm">
                    <span className="text-gray-700">• {location}</span>
                    <button
                      onClick={() => removeArrayItem('place', 'locations', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PROMOTION */}
        <div className="border-2 border-orange-200 rounded-xl p-5 bg-orange-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-orange-900">Promotion</h3>
          </div>
          <p className="text-xs text-orange-700 mb-3">Marketing communications and customer acquisition</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Promotional Strategies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="promotion-strategies"
                  placeholder="e.g., Content marketing, SEO"
                  className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('promotion', 'strategies', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('promotion-strategies') as HTMLInputElement
                    addArrayItem('promotion', 'strategies', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.promotion.strategies.map((strategy, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200 text-sm">
                    <span className="text-gray-700">• {strategy}</span>
                    <button
                      onClick={() => removeArrayItem('promotion', 'strategies', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Marketing Budget
              </label>
              <input
                type="text"
                value={data.promotion.budget}
                onChange={(e) => updateField('promotion', 'budget', e.target.value)}
                placeholder="e.g., $10,000/month or 20% of revenue"
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Marketing Channels
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="promotion-channels"
                  placeholder="e.g., Facebook Ads, Google Ads"
                  className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      addArrayItem('promotion', 'channels', input.value)
                      input.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('promotion-channels') as HTMLInputElement
                    addArrayItem('promotion', 'channels', input.value)
                    input.value = ''
                  }}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {data.promotion.channels.map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200 text-sm">
                    <span className="text-gray-700">• {channel}</span>
                    <button
                      onClick={() => removeArrayItem('promotion', 'channels', idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Key Messaging
              </label>
              <textarea
                value={data.promotion.messaging}
                onChange={(e) => updateField('promotion', 'messaging', e.target.value)}
                placeholder="Your value proposition and key messages..."
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Mix Tips */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>💡 Strategic Tip:</strong> The 4 P's should work together cohesively. Premium products require premium pricing and selective distribution. 
          Value products need volume distribution and cost-effective promotion. Ensure consistency across all four elements.
        </p>
      </div>
    </div>
  )
}
