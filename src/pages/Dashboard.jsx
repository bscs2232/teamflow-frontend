import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Dashboard = () => {
  const { user, logout }    = useAuth()
  const navigate             = useNavigate()
  const [boards,  setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [modal,   setModal]   = useState(false)
  const [newBoard, setNewBoard] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchBoards() }, [])

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards')
      setBoards(data.boards)
    } catch {
      setError('Failed to load boards.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newBoard.title.trim()) return
    setCreating(true)
    try {
      const { data } = await api.post('/boards', newBoard)
      setBoards((prev) => [data.board, ...prev])
      setModal(false)
      setNewBoard({ title: '', description: '' })
    } catch {
      setError('Failed to create board.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (boardId) => {
    if (!window.confirm('Delete this board?')) return
    try {
      await api.delete(`/boards/${boardId}`)
      setBoards((prev) => prev.filter((b) => b._id !== boardId))
    } catch {
      setError('Failed to delete board.')
    }
  }

  const COLORS = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-600',
    'from-amber-500 to-yellow-600',
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-800">TeamFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-500 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Boards</h1>
            <p className="text-slate-500 text-sm mt-1">
              {boards.length} board{boards.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
                       text-white text-sm font-semibold rounded-lg transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Board
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0
                     002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0
                     002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No boards yet</h3>
            <p className="text-slate-400 text-sm mt-1">Create your first board to get started</p>
            <button
              onClick={() => setModal(true)}
              className="mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm
                         font-semibold rounded-lg transition"
            >
              Create Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map((board, idx) => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm
                           hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`bg-gradient-to-br ${COLORS[idx % COLORS.length]} p-6 h-36 flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{board.title}</h3>
                    {board.description && (
                      <p className="text-white/70 text-sm mt-1 line-clamp-2">{board.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">
                      {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(board._id) }}
                      className="opacity-0 group-hover:opacity-100 transition p-1.5 bg-white/20
                                 hover:bg-white/40 rounded-lg"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                             4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Create New Board</h2>
              <button
                onClick={() => setModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Board title *</label>
                <input
                  type="text"
                  value={newBoard.title}
                  onChange={(e) => setNewBoard((p) => ({ ...p, title: e.target.value }))}
                  required
                  autoFocus
                  placeholder="e.g. Marketing Roadmap"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={newBoard.description}
                  onChange={(e) => setNewBoard((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What is this board about?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium
                             rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm
                             font-semibold rounded-lg transition disabled:opacity-60 flex items-center
                             justify-center gap-2"
                >
                  {creating && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {creating ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard