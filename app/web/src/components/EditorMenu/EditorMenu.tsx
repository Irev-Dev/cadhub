import Svg from 'src/components/Svg/Svg'

const EditorMenu = () => {
  return (
    <div className="bg-gray-500 flex items-center h-9 w-full cursor-grab">
      <div className=" text-gray-500 bg-gray-300 cursor-grab px-2 h-full flex items-center">
        <Svg name='drag-grid' className="w-4 p-px" />
      </div>
      <button
        className="text-gray-300 px-3 h-full"
        aria-label="editor settings"
      >
        <Svg name='gear' className="w-7 p-px" />
      </button>
      <div className="w-px h-full bg-gray-300"/>
      <div className="flex gap-6 px-6">
        <button className="text-gray-100">
          File
        </button>
        <button className="text-gray-100">
          Edit
        </button>
        <button className="text-gray-100">
          View
        </button>
      </div>
    </div>
  )
}

export default EditorMenu
