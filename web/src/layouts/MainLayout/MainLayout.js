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
        <nav className="flex justify-between h-20 px-12 bg-gradient-to-r from-gray-900 to-indigo-900">
          <ul className="flex items-center">
            <li>
              <Link to={routes.home()}>
                <div className="rounded-full overflow-hidden ml-12">
                  <img src={logo}/>
                </div>
              </Link>
            </li>
            <li>
              <Tooltip title="Very alpha, there's lots of work todo" >
                <div className="ml-12 flex">
                  {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
                  <h2 className="text-indigo-300 text-5xl font-ropa-sans py-1 tracking-wider" style={{letterSpacing: '0.3em'}}>CadHub</h2>
                  <div className="text-pink-400 text-sm font-bold font-ropa-sans" style={{paddingBottom: '2rem', marginLeft: '-1.8rem'}}>pre-alpha</div>
                </div>
              </Tooltip>
            </li>
          </ul>
          <ul className="flex items-center">
            <li className="mr-8 h-10 w-10 rounded-full border-2 border-indigo-300 flex items-center justify-center">
              {/* <Link to={routes.newPart()}> */}
                <Svg name="plus" className="text-indigo-300" />
              {/* </Link> */}
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
