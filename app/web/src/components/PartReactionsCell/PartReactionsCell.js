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

export const Empty = () => (
  <div className="text-center py-8 font-roboto text-gray-700">
    No reactions to this part yet 😕
  </div>
)

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ partReactionsByPartId }) => {
  return <PartReactions reactions={partReactionsByPartId} />
}
