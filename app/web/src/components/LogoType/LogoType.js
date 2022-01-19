import Tooltip from '@material-ui/core/Tooltip'
import { Link, routes } from '@redwoodjs/router'
import Svg from 'src/components/Svg'

export default function LogoType({ className = '', wrappedInLink = false }) {
  return (
    <ul className={'flex items-center ' + className}>
      <li>
        {wrappedInLink ? (
          <Link to={routes.home()}>
            <div className="ml-2 overflow-hidden rounded-full">
              <Svg className="w-10" name="favicon" />
            </div>
          </Link>
        ) : (
          <div>
            <div className="ml-2 overflow-hidden rounded-full">
              <Svg className="w-10" name="favicon" />
            </div>
          </div>
        )}
      </li>
      <li>
        <Tooltip title="Very alpha, there's lots of work todo">
          <div className="flex ml-4">
            {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
            <h2
              className="py-1 text-2xl text-indigo-300 md:text-5xl font-ropa-sans md:tracking-wider"
              style={{ letterSpacing: '0.3em' }}
            >
              CadHub
            </h2>
            <div
              className="hidden text-sm font-bold text-pink-400 font-ropa-sans md:block"
              style={{ paddingBottom: '2rem', marginLeft: '-1.8rem' }}
            >
              pre-alpha
            </div>
          </div>
        </Tooltip>
      </li>
    </ul>
  )
}
