import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'

const ProfilePage = () => {
  const { user, login } = useAuth()
  const [name,     setName]     = useState(user?.name || '')
  const [email,    setEmail]    = useState(user?.email || '')
  const [current,  setCurrent]  = useState('')
  const [newPass,  setNewPass]  = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', { name, email })
      showToast('Profile updated successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (newPass !== confirm) return showToast('Passwords do not match', 'error')
    if (newPass.length < 6)  return showToast('Password must be at least 6 characters', 'error')
    setSaving(true)
    try {
      await api.put('/auth/password', { currentPassword: current, newPassword: newPass })
      showToast('Password changed successfully')
      setCurrent(''); setNewPass(''); setConfirm('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Change failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Account Settings</h1>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-5">Profile Information</h2>
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm
                           font-semibold rounded-lg transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-5">Change Password</h2>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm
                           font-semibold rounded-lg transition disabled:opacity-60"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default ProfilePage