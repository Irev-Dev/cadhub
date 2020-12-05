import { getActiveClasses } from 'get-active-classes'
import { TextField, FieldError } from '@redwoodjs/forms'
import { useFormContext } from 'react-hook-form'

const InputText = ({ type = 'text', className, name, validation }) => {
  const { errors } = useFormContext()
  return (
    <>
      <div className={getActiveClasses('relative inline-block', className)}>
        <FieldError
          className="absolute -my-4 text-sm text-red-500 font-ropa-sans"
          name={name}
        />
        <div
          className={getActiveClasses(
            'absolute inset-0 mb-2 rounded bg-gray-200 shadow-inner',
            { 'border border-red-500': errors[name] }
          )}
        />
        <TextField
          className={getActiveClasses(
            'pl-2 pt-1 text-indigo-800 font-medium mb-px pb-px bg-transparent relative w-full'
          )}
          name={name}
          readOnly={false}
          type={type}
          validation={validation}
        />
      </div>
    </>
  )
}

export default InputText
