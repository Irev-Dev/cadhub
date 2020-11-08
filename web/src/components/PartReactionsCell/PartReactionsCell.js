import { Link, routes } from '@redwoodjs/router'

import PartReactions from 'src/components/PartReactions'

export const QUERY = gql`
  query PART_REACTIONS {
    partReactions {
      id
      emote
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
      {'No partReactions yet. '}
      <Link to={routes.newPartReaction()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ partReactions }) => {
  return <PartReactions partReactions={partReactions} />
}
