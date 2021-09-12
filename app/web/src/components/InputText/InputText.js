import { getActiveClasses } from 'get-active-classes'

const InputText = ({
  value,
  isEditable,
  onChange,
  className,
  isInvalid = false,
}) => {
  return (
    <>
      <div
        className={getActiveClasses(
          'relative inline-block',
          { hidden: !isEditable },
          className
        )}
      >
        <div
          className={getActiveClasses(
            'absolute inset-0 mb-2 rounded bg-gray-200 shadow-inner',
            { 'border border-red-500': isInvalid }
          )}
        />
        <input
          className="text-ch-gray-300 rounded-none bg-ch-gray-600 border border-transparent focus:border-ch-gray-300 px-2 py-1 relative w-full"
          onChange={onChange}
          value={value}
          readOnly={!onChange}
          type="text"
        />
      </div>
      <span
        className={getActiveClasses(
          'pl-2 text-indigo-800 font-medium mb-px pb-px',
          { hidden: isEditable },
          className
        )}
      >
        {value}
      </span>
    </>
  )
}

export default InputText
