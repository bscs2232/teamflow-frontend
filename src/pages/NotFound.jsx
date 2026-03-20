import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-500">404</h1>
        <p className="text-2xl font-semibold text-slate-700 mt-4">Page Not Found</p>
        <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound