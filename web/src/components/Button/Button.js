import Svg from 'src/components/Svg'

const Button = ({onClick, children}) => {
  return (
    <div>
      <button
        className="flex items-center bg-indigo-200 bg-opacity-50 rounded-xl p-2 px-6 text-indigo-600"
        onClick={onClick}
      >
        {children}
        <Svg className="w-6 ml-4" name="pencil" />
      </button>
    </div>
  )
}

export default Button
