import { useState, useEffect } from 'react'
import { User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { authAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'

const AdminProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setProfile(response.data)
      setFormData({
        full_name: response.data.full_name,
        email: response.data.email
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      full_name: profile.full_name,
      email: profile.email
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // For now, we'll just refetch the profile
      // You can add an update profile API call here
      await fetchProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name}</h2>
              <p className="text-gray-500 capitalize">{profile?.role}</p>
            </div>
          </div>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Edit2 size={18} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            {editing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="text-gray-400" size={20} />
                <span className="text-gray-900">{profile?.full_name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="text-gray-400" size={20} />
                <span className="text-gray-900">{profile?.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-gray-400" size={20} />
              <span className="text-gray-900 capitalize">{profile?.role}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-400" size={20} />
              <span className="text-gray-900">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminProfile
