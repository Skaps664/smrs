import { Plus, Trash2, HelpCircle, Lightbulb } from "lucide-react"
import { useState } from "react"

interface BlockEditorProps {
  title: string
  icon: React.ElementType
  color: string
  description: string
  prompts: string[]
  examples: string[]
  helpText: string
  items: any[]
  onAdd: () => void
  onUpdate: (index: number, field: string, value: any) => void
  onRemove: (index: number) => void
  fields: { name: string; label: string; type: string; options?: string[] }[]
}

export function BlockEditor({
  title,
  icon: Icon,
  color,
  description,
  prompts,
  examples,
  helpText,
  items,
  onAdd,
  onUpdate,
  onRemove,
  fields,
}: BlockEditorProps) {
  const [showHelp, setShowHelp] = useState(false)

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    green: "bg-green-50 border-green-200 text-green-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    pink: "bg-pink-50 border-pink-200 text-pink-900",
    red: "bg-red-50 border-red-200 text-red-900",
  }

  const buttonColorClasses = {
    blue: "text-blue-600 hover:text-blue-800",
    orange: "text-orange-600 hover:text-orange-800",
    green: "text-green-600 hover:text-green-800",
    purple: "text-purple-600 hover:text-purple-800",
    emerald: "text-emerald-600 hover:text-emerald-800",
    indigo: "text-indigo-600 hover:text-indigo-800",
    yellow: "text-yellow-600 hover:text-yellow-800",
    pink: "text-pink-600 hover:text-pink-800",
    red: "text-red-600 hover:text-red-800",
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm mt-1 opacity-90">{description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-gray-600 hover:text-gray-800"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Questions to Consider:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {prompts.map((prompt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Examples:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {examples.map((example, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400">→</span>
                  <span className="italic">{example}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
            <strong>Tip:</strong> {helpText}
          </p>
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={item[field.name] || ""}
                        onChange={(e) => onUpdate(index, field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item[field.name] || false}
                          onChange={(e) => onUpdate(index, field.name, e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        value={item[field.name] || ""}
                        onChange={(e) => onUpdate(index, field.name, e.target.value)}
                        placeholder={field.label}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onRemove(index)}
                className="mt-3 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className={`w-full py-3 border-2 border-dashed rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${buttonColorClasses[color as keyof typeof buttonColorClasses]} border-current`}
      >
        <Plus className="w-4 h-4" />
        Add {title}
      </button>
    </div>
  )
}

interface BlockViewProps {
  title: string
  icon: React.ElementType
  color: string
  items: any[]
  fields: { name: string; label: string; format?: (value: any) => string }[]
}

export function BlockView({ title, icon: Icon, color, items, fields }: BlockViewProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    orange: "bg-orange-50 border-orange-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    emerald: "bg-emerald-50 border-emerald-200",
    indigo: "bg-indigo-50 border-indigo-200",
    yellow: "bg-yellow-50 border-yellow-200",
    pink: "bg-pink-50 border-pink-200",
    red: "bg-red-50 border-red-200",
  }

  const dotColorClasses = {
    blue: "text-blue-600",
    orange: "text-orange-600",
    green: "text-green-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
    indigo: "text-indigo-600",
    yellow: "text-yellow-600",
    pink: "text-pink-600",
    red: "text-red-600",
  }

  return (
    <div className={`p-5 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No items added yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
              {fields.map((field, fieldIdx) => {
                const value = item[field.name]
                const displayValue = field.format ? field.format(value) : value
                if (!displayValue) return null
                return (
                  <div key={fieldIdx} className={fieldIdx > 0 ? "mt-2" : ""}>
                    {fieldIdx === 0 ? (
                      <div className="flex items-start gap-2">
                        <span className={`mt-1 ${dotColorClasses[color as keyof typeof dotColorClasses]}`}>
                          •
                        </span>
                        <div>
                          <p className="font-semibold text-sm">{displayValue}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 ml-4">
                        <span className="font-medium">{field.label}:</span> {displayValue}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
