const Loader = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  </div>
)

export default Loader