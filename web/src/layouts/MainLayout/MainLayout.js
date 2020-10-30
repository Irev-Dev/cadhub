import { Link, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Flash } from '@redwoodjs/web'
import Tooltip from '@material-ui/core/Tooltip';

import avatar from 'src/assets/harold.jpg'
import Svg from 'src/components/Svg'
import logo from 'src/layouts/MainLayout/Logo_2.jpg'

const MainLayout = ({ children }) => {
  const { logIn, logOut, isAuthenticated } = useAuth()
  return (
    <>
      <header>
        <nav className="flex justify-between h-20 bg-gray-900">
          <ul className="flex items-center">
            <li>
              <Link to={routes.home()}>
                <Tooltip title="We need a logo!" >
                <img src={logo} style={{marginLeft : '50px'}}/>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Tooltip title="Very alpha, there's lots of work todo" >
                <div className="ml-8 flex">
                  <h2 className="text-indigo-200 text-2xl">CadHub</h2>
                  <div className="text-pink-500 pb-4 text-sm" >pre-alpha</div>
                </div>
              </Tooltip>
            </li>
          </ul>
          <ul className="flex items-center">
            <li className="mr-8 rounded-full border-2 border-indigo-300">
              <Link to={routes.newPart()}>
                <Svg name="plus" className="text-indigo-300" />
              </Link>
            </li>
            <li className="mr-12 p-px border-2 rounded-full border-indigo-300 text-indigo-200">
              <a href="#" onClick={isAuthenticated ? logOut : logIn}>
                {isAuthenticated ? 'Log Out' : 'Log In'}
                <img src={avatar} className="rounded-full h-10 w-10" />
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <Flash timeout={1000} />
      <main>{children}</main>
    </>
  )
}

export default MainLayout
