import Part from 'src/components/Part'

export const QUERY = gql`
  query FIND_PART_BY_ID($id: String!) {
    part: part(id: $id) {
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

export const Empty = () => <div>Part not found</div>

export const Success = ({ part }) => {
  return <Part part={part} />
}
