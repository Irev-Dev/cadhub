import { Menu } from '@headlessui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function DropdownItem({ config, state, thunkDispatch }) {
  useHotkeys(config.shortcut, handleClick)

  function handleClick(e) {
    e.preventDefault()
    config.callback(e, { state, thunkDispatch })
  }
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active && 'bg-gray-600'
          } px-2 py-1 flex justify-between`}
          onClick={handleClick}
        >
          {config.label}
          {config.shortcutLabel && (
            <span className="text-gray-400 pl-6 text-right">
              {config.shortcutLabel}
            </span>
          )}
        </button>
      )}
    </Menu.Item>
  )
}

export function Dropdown({
  label,
  disabled,
  children,
}: {
  label: string
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              className={
                'text-gray-100' +
                (disabled ? ' text-gray-400 cursor-not-allowed' : '')
              }
              disabled={disabled}
            >
              {label}
            </Menu.Button>
            {children && (
              <Menu.Items
                static
                className={
                  (open ? '' : 'hidden ') +
                  'absolute flex flex-col mt-4 bg-ch-gray-760 rounded text-gray-100 overflow-hidden whitespace-nowrap border border-ch-gray-700'
                }
              >
                {children}
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </div>
  )
}
