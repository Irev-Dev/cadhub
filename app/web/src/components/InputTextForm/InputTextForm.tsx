import { getActiveClasses } from 'get-active-classes'
import { TextField, FieldError } from '@redwoodjs/forms'
import { useFormContext } from 'react-hook-form'

const InputText = ({ type = 'text', className, name, validation }) => {
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <>
      <div className={getActiveClasses('relative mt-5', className)}>
        <FieldError
          className="absolute -my-5 text-sm text-red-500"
          name={name}
        />
        <TextField
          className={getActiveClasses(
            'text-ch-gray-300 rounded-none bg-ch-gray-600 border border-transparent focus:border-ch-gray-300 px-2 py-1 relative w-full',
            { 'border border-red-600': errors[name] }
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
