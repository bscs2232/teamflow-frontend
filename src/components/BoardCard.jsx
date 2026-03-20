import { useNavigate } from 'react-router-dom'

const COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-yellow-600',
]

const BoardCard = ({ board, index, onDelete }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm
                 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className={`bg-gradient-to-br ${COLORS[index % COLORS.length]} p-6 h-36 flex flex-col justify-between`}>
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
            onClick={(e) => { e.stopPropagation(); onDelete(board._id) }}
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
  )
}

export default BoardCard