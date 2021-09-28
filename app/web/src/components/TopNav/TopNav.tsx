import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg/Svg'
import NavPlusButton from 'src/components/NavPlusButton'
import ProfileSlashLogin from 'src/components/ProfileSlashLogin'
import { ReactNode } from 'react'
interface IdeHeaderProps {
  children?: ReactNode
}

const TopNav = ({ children }: IdeHeaderProps) => {
  return (
    <div className="h-16 w-full bg-ch-gray-900 flex justify-between items-center text-lg">
      <div className="h-full text-gray-300 flex items-center">
        <div className="w-14 h-16 flex items-center justify-center bg-ch-gray-900">
          <Link to={routes.home()}>
            <Svg className="w-12 p-0.5" name="favicon" />
          </Link>
        </div>
      </div>
      {children}
      <div className="text-gray-200 grid grid-flow-col-dense gap-4 mr-4 items-center">
        <div className="h-8 w-8">
          <NavPlusButton />
        </div>
        <ProfileSlashLogin />
      </div>
    </div>
  )
}

export default TopNav
