import { Link, routes } from '@redwoodjs/router'

import Parts from 'src/components/Parts'

export const QUERY = gql`
  query PARTS_OF_USER($userName: String!) {
    parts(userName: $userName) {
      id
      title
      mainImage
      createdAt
      updatedAt
      user {
        image
        userName
      }
      Reaction {
        emote
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">No parts yet.</div>
}

export const Success = ({
  parts,
  variables: { shouldFilterPartsWithoutImage },
}) => {
  return (
    <Parts
      parts={parts}
      shouldFilterPartsWithoutImage={shouldFilterPartsWithoutImage}
    />
  )
}
