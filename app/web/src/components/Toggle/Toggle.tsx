const Toggle = ({ offLabel = 'off', onLabel = 'on', checked, onChange }) => {
  return (
    <div className="flex items-center text-sm cursor-pointer font-light">
      <span className={`${!checked && 'text-ch-gray-500'}`}>{offLabel}</span>
      <div
        className={
          'mx-2 w-7 h-4 p-1 rounded-full border border-ch-gray-300 relative ' +
          (checked && 'border-ch-gray-500')
        }
      >
        <div
          className="w-2.5 h-2.5 rounded-full bg-ch-pink-300 absolute transition-transform duration-75"
          style={{
            left: '50%',
            top: '50%',
            transform: checked
              ? 'translate(-100%, -50%)'
              : 'translate(0%, -50%)',
          }}
        ></div>
      </div>
      <span className={`${checked && 'text-ch-gray-500'}`}>{onLabel}</span>
      <input
        className="sr-only"
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
    </div>
  )
}

export default Toggle
