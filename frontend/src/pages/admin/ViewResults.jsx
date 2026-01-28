import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { adminAPI } from '../../services/api'
import ResultsTable from '../../components/admin/ResultsTable'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { handleError, filterBySearchTerm } from '../../utils/helpers'

const ViewResults = () => {
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [results, searchTerm, selectedExam])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [resultsRes, examsRes] = await Promise.all([
        adminAPI.getAllResults(),
        adminAPI.getAllExams()
      ])
      setResults(resultsRes.data)
      setExams(examsRes.data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...results]

    if (searchTerm) {
      filtered = filterBySearchTerm(filtered, searchTerm, ['student.name', 'student.email', 'exam.title'])
    }

    if (selectedExam) {
      filtered = filtered.filter(result => result.exam_id === parseInt(selectedExam))
    }

    setFilteredResults(filtered)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedExam('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading results..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">View Results</h1>
        <p className="text-gray-600">View and analyze exam results</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by student name, email, or exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedExam) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredResults.length} of {results.length} results
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <ResultsTable results={filteredResults} />
      </Card>
    </div>
  )
}

export default ViewResults