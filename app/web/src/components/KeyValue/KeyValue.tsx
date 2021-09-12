import Svg from 'src/components/Svg/Svg'

interface KeyValueType {
  keyName: string
  children: React.ReactNode
  hide?: boolean
  canEdit?: boolean
  onEdit?: () => void
  isEditable?: boolean
  bottom?: boolean
  className?: string
}

const KeyValue = ({
    keyName,
    children,
    hide = false,
    canEdit = false,
    onEdit,
    isEditable = false,
    bottom = false,
    className = "",
  } : KeyValueType) => {
    if (!children || hide) return null
    return (
      <div className={"flex flex-col " + className}>
        <div className={"text-ch-blue-400 font-fira-code flex items-center leading-4 text-sm whitespace-nowrap " + (bottom ? "order-2" : "")}>
          <span className={isEditable ? "text-ch-blue-300" : ""}>{keyName}</span>
          {canEdit &&
            (isEditable ? (
              <button
                className="font-fira-sans text-ch-gray-300 items-center ml-4 grid grid-flow-col-dense p-px px-2 gap-2 bg-ch-blue-500 bg-opacity-50 hover:bg-opacity-70 rounded-sm"
                id="rename-button"
                onClick={onEdit}
              >
                <Svg
                  name="check"
                  className="w-6 h-6"
                  strokeWidth={3}
                />
                <span>Update</span>
              </button>
            ) : (
              <button onClick={onEdit}>
                <Svg name="pencil-solid" className="h-4 w-4 ml-4 mb-2" />
              </button>
            ))}
        </div>
        <div className={"text-ch-gray-300 " + (bottom ? "mb-1" : "mt-1")}>{children}</div>
      </div>
    )
  }

  export default KeyValue