import { Link, routes } from '@redwoodjs/router'

import Comments from 'src/components/Comments'

export const QUERY = gql`
  query COMMENTS {
    comments {
      id
      text
      userId
      partId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No comments yet. '}
      <Link to={routes.newComment()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ comments }) => {
  return <Comments comments={comments} />
}
