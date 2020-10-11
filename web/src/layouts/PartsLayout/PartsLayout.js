import { Link, routes } from '@redwoodjs/router'
import { Flash } from '@redwoodjs/web'

const PartsLayout = (props) => {
  return (
    <div className="rw-scaffold">
      <Flash timeout={1000} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes.parts()} className="rw-link">
            Parts
          </Link>
        </h1>
        <Link to={routes.newPart()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> New Part
        </Link>
      </header>
      <main className="rw-main">{props.children}</main>
    </div>
  )
}

export default PartsLayout
