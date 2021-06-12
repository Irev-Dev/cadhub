import Svg from 'src/components/Svg/Svg'

const IdeSideBar = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-900">
          <Svg className="w-12" name="favicon" />
        </div>
      <button className=" text-gray-300 p-2 pb-4 flex justify-center" aria-label="IDE settings">
        <Svg name="big-gear" />
      </button>
    </div>
  )
}

export default IdeSideBar
