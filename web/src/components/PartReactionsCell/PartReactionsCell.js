import PartReactions from 'src/components/PartReactions'

export const QUERY = gql`
  query PartReactionsQuery($partId: String!) {
    partReactionsByPartId(partId: $partId) {
      id
      emote
      user {
        id
        userName
        image
      }
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ partReactionsByPartId }) => {
  return <PartReactions reactions={partReactionsByPartId} />
}
