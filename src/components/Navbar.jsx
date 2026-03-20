import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ boardTitle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-800">TeamFlow</span>
        </Link>
        {boardTitle && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium text-sm">{boardTitle}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="text-sm text-slate-500 hover:text-primary-600 transition font-medium hidden sm:block"
        >
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center
                          text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-red-500 transition font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar