import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { useRender } from 'src/components/IdeWrapper/useRender'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { Switch } from '@headlessui/react'
import Svg from 'src/components/Svg/Svg'
import {
  CadhubStringParam,
  CadhubBooleanParam,
  CadhubNumberParam,
  CadhubStringChoiceParam,
  CadhubNumberChoiceParam,
} from './customizerConverter'

const Customizer = () => {
  const [shouldLiveUpdate, setShouldLiveUpdate] = React.useState(false)
  const { state, thunkDispatch } = useIdeContext()
  const isOpen = state.isCustomizerOpen
  const customizerParams = state?.customizerParams
  const currentParameters = state?.currentParameters || {}
  const handleRender = useRender()
  const toggleOpen = () => {
    const newOpenState = !isOpen
    thunkDispatch({type: 'setCustomizerOpenState', payload: newOpenState})
    if(!newOpenState) {
      // render on close
      setTimeout(() => handleRender())
    }
  }

  const updateCustomizerParam = (paramName: string, paramValue: any) => {
    const payload = {
      ...currentParameters,
      [paramName]: paramValue,
    }
    thunkDispatch({ type: 'setCurrentCustomizerParams', payload })
    shouldLiveUpdate && setTimeout(() => handleRender())
  }
  if (!customizerParams?.length) return null
  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-ch-gray-600 bg-opacity-60 text-ch-gray-300 text-lg font-fira-sans ${
        isOpen ? 'h-full max-h-96' : ''
      }`}
    >
      <div className="flex justify-between px-6 py-2 items-center">
        <div className="grid grid-flow-col-dense gap-6 items-center">
          <button className="px-2" onClick={toggleOpen}>
            <Svg
              name="chevron-down"
              className={`h-8 w-8 ${!isOpen && 'transform rotate-180'}`}
            />
          </button>
          <div>Parameters</div>
        </div>
        {isOpen && (
          <>
            <div className="flex items-center">
              <div className="font-fira-sans text-sm mr-4">Auto Update</div>
              <Switch
                checked={shouldLiveUpdate}
                onChange={(newValue) => {
                  if (newValue) handleRender()
                  setShouldLiveUpdate(newValue)
                }}
                className={`${
                  shouldLiveUpdate ? 'bg-ch-purple-600' : 'bg-ch-gray-300'
                } relative inline-flex items-center h-6 rounded-full w-11 mr-6`}
              >
                <span
                  className={`${
                    shouldLiveUpdate ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
              <button
                className={`px-4 py-1 rounded bg-ch-gray-300 text-ch-gray-800 ${
                  shouldLiveUpdate && 'bg-opacity-30 cursor-default'
                }`}
                onClick={handleRender}
                disabled={shouldLiveUpdate}
              >
                Update
              </button>
            </div>
          </>
        )}
      </div>
      <div className={`${isOpen ? 'h-full pb-32' : 'h-0'} overflow-y-auto px-12`}>
        <div>
          {customizerParams.map((param, index) => {
            const otherProps = {
              value: currentParameters[param.name],
              onChange: (value) =>
                updateCustomizerParam(
                  param.name,
                  param.type == 'number' ? Number(value) : value
                ),
            }
            if (
              param.input === 'choice-string' ||
              param.input === 'choice-number'
            ) {
              return <ChoiceParam key={index} param={param} {...otherProps} />
            } else if (param.input === 'default-string') {
              return <StringParam key={index} param={param} {...otherProps} />
            } else if (param.input === 'default-number') {
              return <NumberParam key={index} param={param} {...otherProps} />
            } else if (param.input === 'default-boolean') {
              return <BooleanParam key={index} param={param} {...otherProps} />
            }
            return <div key={index}>{JSON.stringify(param)}</div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Customizer

function CustomizerParamBase({
  name,
  caption,
  children,
}: {
  name: string
  caption: string
  children: React.ReactNode
}) {
  return (
    <li
      className="grid items-center my-2"
      style={{ gridTemplateColumns: 'auto 8rem' }}
    >
      <div className=" text-sm font-fira-sans">
        <div className="font-bold text-base">{name}</div>
        <div>{caption}</div>
      </div>
      <div className="w-full">{children}</div>
    </li>
  )
}

function BooleanParam({
  param,
  value,
  onChange,
}: {
  param: CadhubBooleanParam
  value: any
  onChange: (value: any) => void
}) {
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <Switch
        checked={value}
        onChange={(newValue) => {
          onChange(newValue)
        }}
        className={`${
          value ? 'bg-ch-gray-300' : 'bg-ch-gray-600'
        } relative inline-flex items-center h-6 rounded-full w-11 mr-6 border border-ch-gray-300`}
      >
        <span
          className={`${
            value ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full`}
        />
      </Switch>
    </CustomizerParamBase>
  )
}

function StringParam({
  param,
  value,
  onChange,
}: {
  param: CadhubStringParam
  value: any
  onChange: (value: any) => void
}) {
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <input
        className="bg-transparent h-8 border border-ch-gray-300 px-2 text-sm w-full"
        type="text"
        value={value}
        placeholder={param.placeholder}
        onChange={({ target }) => onChange(target?.value)}
      />
    </CustomizerParamBase>
  )
}

function ChoiceParam({
  param,
  value,
  onChange,
}: {
  param: CadhubStringChoiceParam | CadhubNumberChoiceParam
  value: any
  onChange: (value: any) => void
}) {
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full h-8 text-left cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm border border-ch-gray-300 px-2 text-sm">
            <span className="block truncate">{value}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-300"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 bg-ch-gray-600 bg-opacity-80 overflow-auto text-base rounded-sm shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {param.options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `${
                      active
                        ? 'text-ch-blue-400 bg-ch-gray-700'
                        : 'text-ch-gray-300'
                    }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-ch-blue-400' : 'text-ch-gray-300'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </CustomizerParamBase>
  )
}

function NumberParam({
  param,
  value,
  onChange,
}: {
  param: CadhubNumberParam
  value: any
  onChange: (value: any) => void
}) {
  const [isFocused, isFocusedSetter] = React.useState(false)
  const [localValue, localValueSetter] = React.useState(value)
  const [isLocked, isLockedSetter] = React.useState(false)
  const [pixelsDragged, pixelsDraggedSetter] = React.useState(0)
  const step = param.step || 1
  const commitChange = () => {
    let num = localValue
    if (typeof param.step === 'number') {
      num = Math.round(num / step) * step
    }
    if (typeof param.min === 'number') {
      num = Math.max(param.min, num)
    }
    if (typeof param.max === 'number') {
      num = Math.min(param.max, num)
    }
    num = Number(num.toFixed(2))
    localValueSetter(num)
    onChange(num)
  }
  React.useEffect(() => {
    if (!isFocused) commitChange()
  }, [isFocused])
  React.useEffect(() => localValueSetter(value), [value])
  return (
    <CustomizerParamBase name={param.name} caption={param.caption}>
      <div className="flex h-8 border border-ch-gray-300">
        <input
          className={`bg-transparent px-2 text-sm w-full ${
            (param.max && param.max < localValue) ||
            (param.min && param.min > localValue)
              ? 'text-red-500'
              : ''
          }`}
          type="number"
          value={localValue}
          onFocus={() => isFocusedSetter(true)}
          onBlur={() => isFocusedSetter(false)}
          onKeyDown={({ key }) => key === 'Enter' && commitChange()}
          onChange={({ target }) => {
            const num = Number(target?.value)
            localValueSetter(num)
          }}
          max={param.max}
          min={param.min}
          step={step}
        />
        <div
          className="w-6 border-l border-ch-gray-500 items-center hidden md:flex"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={({ target }) => {
            isLockedSetter(true)
            target?.requestPointerLock?.()
            pixelsDraggedSetter(localValue)
          }}
          onMouseUp={() => {
            isLockedSetter(false)
            document?.exitPointerLock?.()
            commitChange()
          }}
          onMouseMove={({ movementX }) => {
            if (isLocked && movementX) {
              pixelsDraggedSetter(pixelsDragged + (movementX * step) / 8) // one step per 8 pixels
              localValueSetter(Number(pixelsDragged.toFixed(2)))
            }
          }}
        >
          <Svg className="w-6" name="switch-horizontal" />
        </div>
      </div>
    </CustomizerParamBase>
  )
}
