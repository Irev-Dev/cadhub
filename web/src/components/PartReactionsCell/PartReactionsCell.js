export const QUERY = gql`
  query PartReactionsQuery {
    partReactions {
      id
      emote
      user {
        id
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ partReactions }) => {
  return JSON.stringify(partReactions)
}
