import { getActiveClasses } from 'get-active-classes'
import Svg from 'src/components/Svg'

const Button = ({
  onClick,
  iconName,
  children,
  className,
  shouldAnimateHover,
  disabled,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      className={getActiveClasses(
        {
          'bg-gray-300 shadow-none hover:shadow-none': disabled,
          'text-red-600 bg-red-200 border border-red-600': type === 'danger',
          'text-indigo-600': !type,
        },
        'flex items-center bg-opacity-50 rounded p-2 px-6',
        {
          'mx-px transform hover:-translate-y-px transition-all duration-150':
            shouldAnimateHover && !disabled,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
      {iconName && <Svg className="w-6 ml-4" name={iconName} />}
    </button>
  )
}

export default Button
