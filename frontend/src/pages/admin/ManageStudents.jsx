import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { adminAPI } from '../../services/api'
import StudentList from '../../components/admin/StudentList'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import { handleError, filterBySearchTerm } from '../../utils/helpers'
import { MESSAGES } from '../../utils/constants'

const ManageStudents = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearchTerm(students, searchTerm, ['full_name', 'email'])
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [students, searchTerm])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getAllStudents()
      setStudents(response.data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (studentId) => {
    try {
      await adminAPI.toggleStudentStatus(studentId)
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, is_active: !student.is_active }
          : student
      ))
    } catch (err) {
      alert(handleError(err))
    }
  }

  const handleDeleteStudent = async (studentId) => {
    try {
      await adminAPI.deleteStudent(studentId)
      setStudents(students.filter(student => student.id !== studentId))
      alert(MESSAGES.STUDENT_DELETE_SUCCESS)
    } catch (err) {
      alert(handleError(err))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading students..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Students</h1>
        <p className="text-gray-600">View and manage student accounts</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          {searchTerm && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-3">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        )}
      </Card>

      <Card>
        <StudentList
          students={filteredStudents}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteStudent}
        />
      </Card>
    </div>
  )
}

export default ManageStudents