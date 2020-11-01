import { Link, routes } from '@redwoodjs/router'

import Parts from 'src/components/Parts'

export const QUERY = gql`
  query PARTS {
    parts {
      id
      title
      description
      code
      mainImage
      createdAt
      updatedAt
      userId
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
  return <Parts parts={parts} />
}
