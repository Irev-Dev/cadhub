import { useState, useEffect } from 'react'
import { Link, navigate ,routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Flash } from '@redwoodjs/web'
import Tooltip from '@material-ui/core/Tooltip';
import { useQuery } from '@redwoodjs/web'
import Popover from '@material-ui/core/Popover'
import {getActiveClasses} from 'get-active-classes'

export const QUERY = gql`
  query FIND_USER_BY_ID($id: String!) {
    user: user(id: $id) {
      id
      image
      userName
      name
    }
  }
`
import avatar from 'src/assets/harold.jpg'
import Svg from 'src/components/Svg'
import ImageUploader from 'src/components/ImageUploader'
import logo from 'src/layouts/MainLayout/Logo_2.jpg'

const MainLayout = ({ children}) => {
  const { logIn, logOut, isAuthenticated, currentUser } = useAuth()
  const {data, loading} = useQuery(QUERY, {variables: {id: currentUser?.sub}})
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverId, setPopoverId] = useState(undefined)
  const openPopover = (target) => {
    setAnchorEl(target)
    setPopoverId('simple-popover')
    setIsOpen(true)
  }

  const closePopover = () => {
    setAnchorEl(null)
    setPopoverId(undefined)
    setIsOpen(false)
  }

  const togglePopover = ({ currentTarget }) => {
    if (isOpen) {
      return closePopover()
    }

    openPopover(currentTarget)
  }
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
            <li className={getActiveClasses("mr-8 h-10 w-10 rounded-full border-2 border-gray-700 flex items-center justify-center", {'border-indigo-300': currentUser})}>
              {isAuthenticated && data?.user?.userName ?
                <Link className="h-full w-full" to={routes.newPart2({userName: data?.user?.userName})}>
                  <Svg name="plus" className="text-indigo-300 w-full h-full" />
                </Link>:
                <Svg name="plus" className="text-gray-700 w-full h-full" />
              }
            </li>
            <li className="h-10 w-10 border-1 rounded-full border-indigo-300 text-indigo-200">
            <div aria-describedby={popoverId} onMouseOver={togglePopover}>
                {!loading && <ImageUploader
                  className="rounded-full object-cover"
                  onImageUpload={() => {}}
                  aspectRatio={1}
                  imageUrl={data?.user?.image}
                  width={80}
                />}
              </div>
            </li>
          </ul>
          <Popover
            id={popoverId}
            open={isOpen}
            anchorEl={anchorEl}
            onClose={closePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
          {
            isAuthenticated && currentUser?
             <div style={{padding: '1em', width: '15em'}} >
             <Link to={routes.user2({userName: data?.user?.userName})}>
                    <h3 className="text-indigo-800" style={{fontWeight: '500'}} >Hello {data?.user?.name}</h3>
              </Link>
              <hr/>
              <br/>
              <Link to={routes.editUser2({userName: data?.user?.userName})}>
                  <div className="text-indigo-800" >Edit Profile</div>
              </Link>
              <a href="#" className="text-indigo-800" onClick={logOut}>Logout</a>
             </div>:
             <div style={{padding: '1em', width: '15em'}} >
             <a href="#" className="text-indigo-800 text-indigo-800"  onClick={logIn}>LOGIN/SIGNUP</a>
             </div>
            }
          </Popover>
        </nav>
      </header>
      <Flash timeout={1000} />
      <main>{children}</main>
    </>
  )
}

export default MainLayout
