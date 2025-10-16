"use client"

import { useState, useEffect } from "react"
import { FileText, Plus, X, Upload, Download, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import type { Startup, Document } from "@/types"

const categories = [
  { value: "LEGAL", label: "Legal", color: "bg-red-100 text-red-700" },
  { value: "FINANCIAL", label: "Financial", color: "bg-green-100 text-green-700" },
  { value: "PITCH_DECK", label: "Pitch Deck", color: "bg-blue-100 text-blue-700" },
  { value: "PRODUCT_PHOTOS", label: "Product Photos", color: "bg-purple-100 text-purple-700" },
  { value: "CERTIFICATES", label: "Certificates", color: "bg-yellow-100 text-yellow-700" },
  { value: "OTHER", label: "Other", color: "bg-gray-100 text-gray-700" },
]

export default function DocumentsPage() {
  const [startup, setStartup] = useState<Startup | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "LEGAL",
    fileUrl: "",
    fileType: "",
    fileSize: "",
    expiryDate: "",
    notes: "",
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
        
        const docsRes = await fetch(`/api/document?startupId=${startupData[0].id}`)
        const docsData = await docsRes.json()
        setDocuments(docsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Convert file to base64 for storage (simple implementation)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({
          ...formData,
          name: formData.name || file.name,
          fileUrl: base64String,
          fileType: file.type,
          fileSize: file.size.toString(),
        })
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error reading file:", error)
      setUploading(false)
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

      const res = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        fetchData()
        setFormData({
          name: "",
          category: "LEGAL",
          fileUrl: "",
          fileType: "",
          fileSize: "",
          expiryDate: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error saving document:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const res = await fetch(`/api/document?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const handleDownload = (doc: Document) => {
    const link = document.createElement("a")
    link.href = doc.fileUrl
    link.download = doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a startup profile first</p>
      </div>
    )
  }

  const getDocsByCategory = (category: string) => {
    return documents.filter(d => d.category === category)
  }

  const isExpiring = (doc: Document) => {
    if (!doc.expiryDate) return false
    const daysUntilExpiry = Math.floor(
      (new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 30
  }

  const isExpired = (doc: Document) => {
    if (!doc.expiryDate) return false
    return new Date(doc.expiryDate) < new Date()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-gray-900">
            <FileText className="w-7 h-7 mr-3 text-indigo-600" />
            Document Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and organize your startup documents
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Document
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Expiring Soon (30 days)</p>
          <p className="text-2xl font-bold text-yellow-700">
            {documents.filter(isExpiring).length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-bold text-red-700">
            {documents.filter(isExpired).length}
          </p>
        </div>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                File Upload
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-900"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                {formData.fileUrl && !uploading && (
                  <p className="text-sm text-green-600 mt-2">✓ File ready</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Business Registration"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.fileUrl}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>
      )}

      {/* Documents by Category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryDocs = getDocsByCategory(category.value)
          
          return (
            <div key={category.value} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full font-medium text-sm ${category.color}`}>
                    {category.label}
                  </div>
                  <span className="ml-3 text-sm text-gray-500">
                    {categoryDocs.length} document{categoryDocs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {categoryDocs.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No documents in this category</p>
              ) : (
                <div className="space-y-2">
                  {categoryDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`border rounded-lg p-4 flex items-center justify-between ${
                        isExpired(doc)
                          ? "bg-red-50 border-red-200"
                          : isExpiring(doc)
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          {(isExpired(doc) || isExpiring(doc)) && (
                            <AlertCircle
                              className={`w-4 h-4 ${
                                isExpired(doc) ? "text-red-600" : "text-yellow-600"
                              }`}
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 space-x-3">
                          <span>Uploaded: {format(new Date(doc.createdAt), "MMM dd, yyyy")}</span>
                          {doc.fileSize && (
                            <span>Size: {(Number(doc.fileSize) / 1024).toFixed(1)} KB</span>
                          )}
                          {doc.expiryDate && (
                            <span className={isExpired(doc) ? "text-red-600 font-medium" : ""}>
                              Expires: {format(new Date(doc.expiryDate), "MMM dd, yyyy")}
                            </span>
                          )}
                        </div>
                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
