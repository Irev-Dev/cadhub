import { getActiveClasses } from 'get-active-classes'
import Svg from 'src/components/Svg'

const Button = ({onClick, iconName, children, className, shouldAnimateHover, disabled}) => {
  return (
      <button
        disabled={disabled}
        className={getActiveClasses(
          "flex items-center bg-opacity-50 rounded-xl p-2 px-6 text-indigo-600",
          {'mx-px transform hover:-translate-y-px transition-all duration-150': shouldAnimateHover && !disabled},
          className,
          {"bg-gray-300 shadow-none hover:shadow-none": disabled},
        )}
        onClick={onClick}
      >
        {children}
        <Svg className="w-6 ml-4" name={iconName} />
      </button>
  )
}

export default Button
