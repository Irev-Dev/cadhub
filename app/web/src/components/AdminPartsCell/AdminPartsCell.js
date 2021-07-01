import { Link, routes } from '@redwoodjs/router'

import AdminParts from 'src/components/AdminParts'

export const QUERY = gql`
  query PARTS_ADMIN {
    parts {
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
      {'No parts yet. '}
      <Link to={routes.newPart()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ parts }) => {
  return <AdminParts parts={parts} />
}
