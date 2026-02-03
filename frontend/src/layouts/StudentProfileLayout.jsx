import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

const StudentProfileLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

export default StudentProfileLayout
