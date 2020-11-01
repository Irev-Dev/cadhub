import PartReaction from 'src/components/PartReaction'

export const QUERY = gql`
  query FIND_PART_REACTION_BY_ID($id: String!) {
    partReaction: partReaction(id: $id) {
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

export const Empty = () => <div>PartReaction not found</div>

export const Success = ({ partReaction }) => {
  return <PartReaction partReaction={partReaction} />
}
