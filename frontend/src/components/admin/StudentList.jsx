import { useState } from 'react'
import { Trash2, UserCheck, UserX, Mail } from 'lucide-react'
import Button from '../common/Button'
import { ConfirmModal } from '../common/Modal'
import { formatDateTime } from '../../utils/helpers'

const StudentList = ({ students, onToggleStatus, onDelete }) => {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      onDelete(selectedStudent.id)
      setShowDeleteModal(false)
      setSelectedStudent(null)
    }
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <UserX size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No students found</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {student.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-2" />
                    {student.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(student.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant={student.is_active ? 'secondary' : 'success'}
                      onClick={() => onToggleStatus(student.id)}
                      icon={student.is_active ? UserX : UserCheck}
                    >
                      {student.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(student)}
                      icon={Trash2}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

export default StudentList