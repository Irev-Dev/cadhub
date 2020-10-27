import { Link, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Flash } from '@redwoodjs/web'
import Tooltip from '@material-ui/core/Tooltip';

import avatar from 'src/assets/harold.jpg'
import Svg from 'src/components/Svg'

const MainLayout = ({ children }) => {
  const { logIn, logOut, isAuthenticated } = useAuth()
  return (
    <>
      <header>
        <nav className="flex justify-between h-20 px-12 bg-gradient-to-r from-gray-900 to-indigo-900">
          <ul className="flex items-center">
            <li>
              <Link to={routes.home()}>
                <Tooltip title="We need a logo!" >
                  <div className="h-10 w-10 bg-indigo-500 rounded-full" data-tip="hello world" data-place="bottom"></div>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Tooltip title="Very alpha, there's lots of work todo" >
                <div className="ml-8 flex">
                  <h2 className="text-indigo-200 text-4xl font-ropa-sans tracking-widest">CadHub</h2>
                  <div className="text-pink-500 pb-4 text-sm font-ropa-sans" >pre-alpha</div>
                </div>
              </Tooltip>
            </li>
          </ul>
          <ul className="flex items-center">
            <li className="mr-8 h-10 w-10 rounded-full border-2 border-indigo-300 flex items-center justify-center">
              <Link to={routes.newPart()}>
                <Svg name="plus" className="text-indigo-300" />
              </Link>
            </li>
            {
              isAuthenticated ?
              <li className="h-10 w-10 border-2 rounded-full border-indigo-300 text-indigo-200">
                <a href="#" onClick={logOut}>
                  <img src={avatar} className="rounded-full object-cover" />
                </a>
              </li>:
              <li>
                <a href="#" className='text-indigo-200 font-semibold underline' onClick={logIn}>Sign in/up</a>
              </li>
            }
          </ul>
        </nav>
      </header>
      <Flash timeout={1000} />
      <main>{children}</main>
    </>
  )
}

export default MainLayout
