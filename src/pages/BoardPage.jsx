import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const BoardPage = () => {
  const { boardId } = useParams()
  const navigate    = useNavigate()

  const [board,    setBoard]    = useState(null)
  const [lists,    setLists]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  // List state
  const [addingList,  setAddingList]  = useState(false)
  const [listTitle,   setListTitle]   = useState('')
  const [savingList,  setSavingList]  = useState(false)

  // Card state  { [listId]: string }
  const [addingCard,  setAddingCard]  = useState({})
  const [cardTitle,   setCardTitle]   = useState({})
  const [savingCard,  setSavingCard]  = useState({})

  useEffect(() => { fetchBoard() }, [boardId])

  const fetchBoard = async () => {
    try {
      const [{ data: bData }, { data: lData }] = await Promise.all([
        api.get(`/boards/${boardId}`),
        api.get(`/lists/board/${boardId}`),
      ])
      setBoard(bData.board)
      setLists(lData.lists)
    } catch {
      setError('Failed to load board.')
    } finally {
      setLoading(false)
    }
  }

  /* ── List handlers ── */
  const handleAddList = async (e) => {
    e.preventDefault()
    if (!listTitle.trim()) return
    setSavingList(true)
    try {
      const { data } = await api.post('/lists', { title: listTitle, boardId })
      setLists((prev) => [...prev, { ...data.list, cards: [] }])
      setListTitle('')
      setAddingList(false)
    } catch {
      setError('Failed to add list.')
    } finally {
      setSavingList(false)
    }
  }

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Delete this list and all its cards?')) return
    try {
      await api.delete(`/lists/${listId}`)
      setLists((prev) => prev.filter((l) => l._id !== listId))
    } catch {
      setError('Failed to delete list.')
    }
  }

  /* ── Card handlers ── */
  const handleAddCard = async (e, listId) => {
    e.preventDefault()
    if (!cardTitle[listId]?.trim()) return
    setSavingCard((p) => ({ ...p, [listId]: true }))
    try {
      const { data } = await api.post('/cards', { title: cardTitle[listId], listId, boardId })
      setLists((prev) =>
        prev.map((l) =>
          l._id === listId ? { ...l, cards: [...(l.cards || []), data.card] } : l
        )
      )
      setCardTitle((p)  => ({ ...p, [listId]: '' }))
      setAddingCard((p) => ({ ...p, [listId]: false }))
    } catch {
      setError('Failed to add card.')
    } finally {
      setSavingCard((p) => ({ ...p, [listId]: false }))
    }
  }

  const handleDeleteCard = async (listId, cardId) => {
    try {
      await api.delete(`/cards/${cardId}`)
      setLists((prev) =>
        prev.map((l) =>
          l._id === listId ? { ...l, cards: l.cards.filter((c) => c._id !== cardId) } : l
        )
      )
    } catch {
      setError('Failed to delete card.')
    }
  }

  /* ── Render ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-indigo-700 flex flex-col">

      {/* Board Header */}
      <header className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Boards
        </button>
        <div className="w-px h-4 bg-white/30" />
        <h1 className="text-white font-bold text-lg">{board?.title}</h1>
      </header>

      {/* Lists Area */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <div className="flex gap-4 items-start min-w-max">

          {lists.map((list) => (
            <div
              key={list._id}
              className="bg-slate-100 rounded-2xl w-72 flex flex-col shadow-sm shrink-0"
            >
              {/* List Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="font-semibold text-slate-700 text-sm">{list.title}</h3>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="p-1 hover:bg-slate-200 rounded-lg transition"
                >
                  <svg className="w-4 h-4 text-slate-400 hover:text-red-500 transition"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cards */}
              <div className="px-3 pb-2 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                {(list.cards || []).map((card) => (
                  <div
                    key={card._id}
                    className="group bg-white rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md
                               transition cursor-pointer flex items-start justify-between gap-2"
                  >
                    <p className="text-sm text-slate-700 font-medium leading-snug">{card.title}</p>
                    <button
                      onClick={() => handleDeleteCard(list._id, card._id)}
                      className="opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Card */}
              <div className="px-3 pb-3 pt-1">
                {addingCard[list._id] ? (
                  <form onSubmit={(e) => handleAddCard(e, list._id)} className="flex flex-col gap-2">
                    <textarea
                      autoFocus
                      rows={2}
                      value={cardTitle[list._id] || ''}
                      onChange={(e) =>
                        setCardTitle((p) => ({ ...p, [list._id]: e.target.value }))
                      }
                      placeholder="Enter card title..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={savingCard[list._id]}
                        className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs
                                   font-semibold rounded-lg transition disabled:opacity-60"
                      >
                        {savingCard[list._id] ? 'Adding...' : 'Add card'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingCard((p) => ({ ...p, [list._id]: false }))}
                        className="px-3 py-1.5 hover:bg-slate-200 text-slate-500 text-xs rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingCard((p) => ({ ...p, [list._id]: true }))}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-slate-500
                               hover:bg-slate-200 rounded-lg transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add a card
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add List */}
          <div className="shrink-0 w-72">
            {addingList ? (
              <div className="bg-slate-100 rounded-2xl p-3 shadow-sm">
                <form onSubmit={handleAddList} className="flex flex-col gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingList}
                      className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs
                                 font-semibold rounded-lg transition disabled:opacity-60"
                    >
                      {savingList ? 'Adding...' : 'Add list'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAddingList(false); setListTitle('') }}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-500 text-xs rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setAddingList(true)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30
                           text-white rounded-2xl transition font-medium text-sm backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add another list
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default BoardPage