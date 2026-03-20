import { useState, useEffect } from 'react'
import { cardService } from '../services/boardservice'

const LABELS = [
  { text: 'Bug',     color: 'bg-red-100 text-red-700 border-red-200' },
  { text: 'Feature', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { text: 'Urgent',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { text: 'Design',  color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { text: 'Done',    color: 'bg-green-100 text-green-700 border-green-200' },
]

const CardModal = ({ card, onClose, onUpdate }) => {
  const [title,       setTitle]       = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [dueDate,     setDueDate]     = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  )
  const [checklist,   setChecklist]   = useState(card.checklist || [])
  const [newItem,     setNewItem]     = useState('')
  const [saving,      setSaving]      = useState(false)
  const [activeTab,   setActiveTab]   = useState('details')

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await cardService.update(card._id, { title, description, dueDate })
      onUpdate(data.card)
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.trim()) return
    const { data } = await cardService.addChecklist(card._id, newItem)
    setChecklist(data.card.checklist)
    setNewItem('')
  }

  const handleToggle = async (itemId) => {
    const { data } = await cardService.toggleChecklist(card._id, itemId)
    setChecklist(data.card.checklist)
  }

  const completed  = checklist.filter((i) => i.completed).length
  const progress   = checklist.length ? Math.round((completed / checklist.length) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex-1 mr-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-slate-800 border-0 border-b-2 border-transparent
                         focus:border-primary-500 focus:outline-none pb-1 transition"
            />
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          {['details', 'checklist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition -mb-px
                ${activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
              {tab === 'checklist' && checklist.length > 0 && (
                <span className="ml-2 text-xs bg-primary-100 text-primary-600 rounded-full px-1.5 py-0.5">
                  {completed}/{checklist.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Add a more detailed description..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {LABELS.map((label) => (
                    <span
                      key={label.text}
                      className={`px-3 py-1 text-xs font-medium rounded-full border cursor-pointer
                                  hover:opacity-80 transition ${label.color}`}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              {checklist.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 font-medium">{progress}% complete</span>
                    <span className="text-xs text-slate-400">{completed}/{checklist.length}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleToggle(item._id)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition
                      ${item.completed
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-slate-300 group-hover:border-primary-400'}`}
                    >
                      {item.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="Add an item..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm
                             font-semibold rounded-xl transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold
                       rounded-lg transition disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal