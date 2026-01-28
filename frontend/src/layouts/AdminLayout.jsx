import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, BookOpen, Users, BarChart3 } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const AdminLayout = () => {
  const location = useLocation()

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/create-exam', icon: FileText, label: 'Create Exam' },
    { path: '/admin/manage-exams', icon: BookOpen, label: 'Manage Exams' },
    { path: '/admin/view-results', icon: BarChart3, label: 'View Results' },
    { path: '/admin/manage-students', icon: Users, label: 'Manage Students' }
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>
        
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AdminLayout