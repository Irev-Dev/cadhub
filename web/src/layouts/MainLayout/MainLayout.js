import { Link, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

const MainLayout = ({ children }) => {
  const { logIn, logOut, isAuthenticated } = useAuth()
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.parts()}>Parts</Link>
            </li>
            <li>
              <Link to={routes.contact()}>Contact</Link>
            </li>
            <li>
              <a href="#" onClick={isAuthenticated ? logOut : logIn}>
                {isAuthenticated ? 'Log Out' : 'Log In'}
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
