"use client"

import { useState, useEffect } from "react"
import { FileText, Plus, X, Upload, Download, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { Startup, Document } from "@/types"
import { useStartupData } from "@/hooks/useStartupData"

const categories = [
  { value: "LEGAL", label: "Legal", color: "bg-red-500/15 text-red-400" },
  { value: "FINANCIAL", label: "Financial", color: "bg-green-500/15 text-green-400" },
  { value: "PITCH_DECK", label: "Pitch Deck", color: "bg-orange-500/15 text-orange-400" },
  { value: "PRODUCT_PHOTOS", label: "Product Photos", color: "bg-purple-500/15 text-purple-400" },
  { value: "CERTIFICATES", label: "Certificates", color: "bg-yellow-500/15 text-yellow-400" },
  { value: "OTHER", label: "Other", color: "bg-[#141414] text-gray-300" },
]

export default function DocumentsPage() {
  const { startup, loading: startupLoading, isReadOnly } = useStartupData()
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
    if (startup?.id) {
      fetchDocuments()
    }
  }, [startup])

  const fetchDocuments = async () => {
    if (!startup?.id) return
    try {
      const docsRes = await fetch(`/api/document?startupId=${startup.id}`)
      const docsData = await docsRes.json()
      if (Array.isArray(docsData)) {
        setDocuments(docsData)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      setDocuments([])
    }
  }

  const fetchData = () => fetchDocuments()

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
          <h1 className="text-2xl font-bold flex items-center text-gray-100">
                        <FileText className="w-7 h-7 mr-3 text-orange-600" />
            Document Library
          </h1>
          <p className="text-gray-400 mt-1">
            Upload and organize your startup documents
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Document
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-400">Total Documents</p>
          <p className="text-2xl font-bold text-gray-100">{documents.length}</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg shadow-sm p-4 border border-yellow-500/30">
          <p className="text-sm text-gray-400">Expiring Soon (30 days)</p>
          <p className="text-2xl font-bold text-yellow-400">
            {documents.filter(isExpiring).length}
          </p>
        </div>
        <div className="bg-red-500/10 rounded-lg shadow-sm p-4 border border-red-500/30">
          <p className="text-sm text-gray-400">Expired</p>
          <p className="text-2xl font-bold text-red-400">
            {documents.filter(isExpired).length}
          </p>
        </div>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Upload Document</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-100">
                File Upload
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploading && <p className="text-sm text-orange-600 mt-2">Uploading...</p>}
                {formData.fileUrl && !uploading && (
                  <p className="text-sm text-green-600 mt-2">✓ File ready</p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-100">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Business Registration"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-100">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-100">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-100">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.fileUrl}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
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
            <div key={category.value} className="bg-[#1a1a1a] rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full font-medium text-sm ${category.color}`}>
                    {category.label}
                  </div>
                  <span className="ml-3 text-sm text-gray-400">
                    {categoryDocs.length} document{categoryDocs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {categoryDocs.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No documents in this category</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`border rounded-xl flex flex-col overflow-hidden transition-all hover:border-gray-500/50 ${
                        isExpired(doc)
                          ? "bg-red-500/5 border-red-500/30"
                          : isExpiring(doc)
                          ? "bg-yellow-500/5 border-yellow-500/30"
                          : "bg-[#111] border-gray-800"
                      }`}
                    >
                      {/* Thumbnail Header */}
                      <div className="h-32 bg-black/40 relative flex items-center justify-center border-b border-gray-800 overflow-hidden group">
                        {doc.fileType?.startsWith('image/') ? (
                          <img 
                            src={doc.fileUrl} 
                            alt={doc.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                        ) : doc.fileType?.includes('pdf') ? (
                          <div className="flex flex-col items-center text-red-500/80">
                            <FileText className="w-10 h-10 mb-2" />
                            <span className="text-xs font-semibold tracking-wider">PDF</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-500/80">
                            <FileText className="w-10 h-10 mb-2" />
                            <span className="text-xs font-semibold tracking-wider">DOC</span>
                          </div>
                        )}
                        
                        {/* Hover Overlay for Download */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transform hover:scale-110 transition-all shadow-lg"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-100 line-clamp-2 flex-1 pr-2" title={doc.name}>
                            {doc.name}
                          </h4>
                          {(isExpired(doc) || isExpiring(doc)) && (
                            <AlertCircle
                              className={`w-4 h-4 mt-1 flex-shrink-0 ${
                                isExpired(doc) ? "text-red-600" : "text-yellow-600"
                              }`}
                            />
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>{format(new Date(doc.createdAt), "MMM dd, yyyy")}</span>
                            {doc.fileSize && (
                              <span className="text-gray-500">{(Number(doc.fileSize) / 1024).toFixed(1)} KB</span>
                            )}
                          </div>
                          {doc.expiryDate && (
                            <div className={`mt-1 ${isExpired(doc) ? "text-red-500 font-medium" : isExpiring(doc) ? "text-yellow-500 font-medium" : ""}`}>
                              Expires: {format(new Date(doc.expiryDate), "MMM dd, yyyy")}
                            </div>
                          )}
                        </div>
                        
                        {doc.notes && (
                          <div className="mt-auto pt-2 mb-2 pb-2 border-t border-gray-800/50">
                            <p className="text-xs text-gray-400 line-clamp-2" title={doc.notes}>
                              {doc.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-auto pt-2">
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
