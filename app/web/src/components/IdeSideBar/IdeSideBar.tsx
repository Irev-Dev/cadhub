import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'

const IdeSideBar = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-900">
        <Link to={routes.home()}>
          <Svg className="w-12" name="favicon" />
        </Link>
      </div>
      <button
        className="text-gray-300 p-2 pb-4 flex justify-center cursor-not-allowed"
        aria-label="IDE settings"
        disabled
      >
        <Svg name="big-gear" />
      </button>
    </div>
  )
}

export default IdeSideBar
