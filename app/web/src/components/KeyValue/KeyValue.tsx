import Svg from 'src/components/Svg/Svg'

interface EditToggleType {
  hasPermissionToEdit: boolean
  onEdit?: React.MouseEventHandler
  isEditing?: boolean
}
// small change

const EditToggle = ({
  onEdit = () => {
    console.error('Field declared editable without edit action.')
  },
  isEditing = false,
}: EditToggleType) =>
  isEditing ? (
    <button
      className="font-fira-sans text-ch-gray-300 items-center ml-4 grid grid-flow-col-dense p-px px-2 gap-2 bg-ch-blue-500 bg-opacity-50 hover:bg-opacity-70 rounded-sm"
      id="rename-button"
      onClick={onEdit}
    >
      <Svg name="check" className="w-6 h-6" strokeWidth={3} />
      <span>Update</span>
    </button>
  ) : (
    <button onClick={onEdit}>
      <Svg name="pencil-solid" className="h-4 w-4 ml-4 mb-2" />
    </button>
  )

interface KeyValueType {
  keyName: string
  children: React.ReactNode
  bottom?: boolean
  className?: string
  edit?: EditToggleType
}

const KeyValue = ({
  keyName,
  children,
  bottom = false,
  className = '',
  edit = { hasPermissionToEdit: false },
}: KeyValueType) => {
  if (!children) return null
  return (
    <div className={'flex flex-col ' + className}>
      <div
        className={
          'text-ch-blue-400 font-fira-code flex items-center leading-4 text-sm whitespace-nowrap ' +
          (bottom ? 'order-2' : '')
        }
      >
        <span className={edit ? 'text-ch-blue-300' : ''}>{keyName}</span>
        {edit && edit.hasPermissionToEdit && <EditToggle {...edit} />}
      </div>
      <div className={'text-ch-gray-300 ' + (bottom ? 'mb-1' : 'mt-1')}>
        {children}
      </div>
    </div>
  )
}

export default KeyValue
