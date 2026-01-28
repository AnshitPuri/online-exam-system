import { Clock, AlertTriangle } from 'lucide-react'
import { formatTime } from '../../utils/helpers'

const ExamTimer = ({ timeLeft }) => {
  const isWarning = timeLeft <= 300 && timeLeft > 60
  const isCritical = timeLeft <= 60

  return (
    <div className={`fixed top-20 right-4 z-40 px-6 py-4 rounded-lg shadow-lg ${
      isCritical ? 'bg-red-600 animate-pulse' :
      isWarning ? 'bg-yellow-500' :
      'bg-white border-2 border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        {(isWarning || isCritical) && (
          <AlertTriangle size={24} className="text-white" />
        )}
        {!isWarning && !isCritical && (
          <Clock size={24} className="text-primary-600" />
        )}
        <div>
          <p className={`text-xs font-medium ${
            isCritical || isWarning ? 'text-white' : 'text-gray-600'
          }`}>
            Time Remaining
          </p>
          <p className={`text-2xl font-bold ${
            isCritical || isWarning ? 'text-white' : 'text-gray-900'
          }`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>
      {isCritical && (
        <p className="text-xs text-white mt-2">Hurry up! Exam will auto-submit</p>
      )}
    </div>
  )
}

export default ExamTimer