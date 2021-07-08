import { Link, routes } from '@redwoodjs/router'

import AdminProjects from 'src/components/AdminProjects/AdminProjects'

export const QUERY = gql`
  query PROJECTS_ADMIN {
    projects {
      id
      title
      description
      code
      mainImage
      createdAt
      updatedAt
      userId
      deleted
      user {
        userName
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No projects yet. '}
      <Link to={routes.newProject()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ projects }) => {
  return <AdminProjects projects={projects} />
}
