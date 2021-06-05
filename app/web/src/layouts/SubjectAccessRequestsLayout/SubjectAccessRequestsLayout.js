import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const SubjectAccessRequestsLayout = (props) => {
  return (
    <div className="rw-scaffold">
      <Toaster timeout={1000} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes.subjectAccessRequests()} className="rw-link">
            SubjectAccessRequests
          </Link>
        </h1>
      </header>
      <main className="rw-main">{props.children}</main>
    </div>
  )
}

export default SubjectAccessRequestsLayout
