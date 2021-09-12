import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import { Popover } from '@headlessui/react'
import { CadPackageType } from 'src/components/CadPackage/CadPackage'

const menuOptions: {
  name: string
  sub: string
  dotClasses: string
  bgClasses: string
  ideType: CadPackageType
}[] = [
  {
    name: 'OpenSCAD',
    sub: 'beta',
    bgClasses: 'bg-yellow-800',
    dotClasses: 'bg-yellow-200',
    ideType: 'openscad',
  },
  {
    name: 'CadQuery',
    sub: 'beta',
    bgClasses: 'bg-ch-blue-700',
    dotClasses: 'bg-blue-800',
    ideType: 'cadquery',
  },
  {
    name: 'JSCAD',
    sub: 'beta',
    bgClasses: 'bg-ch-purple-500',
    dotClasses: 'bg-yellow-300',
    ideType: 'jscad',
  },
]

const NavPlusButton: React.FC = () => {
  return (
    <Popover className="relative outline-none w-full h-full">
      <Popover.Button className="h-full w-full outline-none hover:bg-ch-gray-550 border-ch-gray-400 border-2 rounded-full">
        <Svg name="plus" className="text-ch-gray-300" />
      </Popover.Button>

      <Popover.Panel className="absolute w-48 z-10 right-0 bg-ch-gray-700 mt-4 px-3 py-2 rounded shadow-md overflow-hidden text-ch-gray-300">
        <p className="text-lg">New Project</p>
        <hr className="my-2" />
        <ul className="">
          {menuOptions.map(({ name, sub, ideType, bgClasses, dotClasses }) => (
            <li
              key={name}
              className={
                bgClasses +
                ' px-4 py-1 my-4 bg-opacity-30 hover:bg-opacity-70 grid grid-flow-col-dense items-center gap-2'
              }
            >
              <div className={dotClasses + " justify-self-center w-5 h-5 rounded-full"}></div>
              <Link to={routes.draftProject({ cadPackage: ideType })}>
                <div>{name}</div>
                <div className="text-xs text-ch-gray-400 font-light">{sub}</div>
              </Link>
            </li>
          ))}
        </ul>
      </Popover.Panel>
    </Popover>
  )
}

export default NavPlusButton
