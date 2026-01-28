const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'p-6',
  hover = false,
  onClick
}) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md ${padding} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card