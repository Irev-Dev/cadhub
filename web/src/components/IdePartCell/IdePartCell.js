import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
// import Part from 'src/components/Part'

export const QUERY = gql`
  query FIND_PART_BY_ID($id: Int!) {
    part: part(id: $id) {
      id
      title
      description
      code
      mainImage
      createdAt
    }
  }
`

const UPDATE_PART_MUTATION = gql`
  mutation UpdatePartMutation($id: Int!, $input: UpdatePartInput!) {
    updatePart(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Part not found</div>

export const Success = ({ part }) => {
  const { addMessage } = useFlash()
  const [updatePart, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: () => {
      // navigate(routes.part({id: updatePart.id}))
      addMessage('Part updated.', { classes: 'rw-flash-success' })
    },
  })
  console.log({updatePart})


  const saveCode = (input, id) => {
    console.log(id, input, 'wowow')
    updatePart({ variables: { id, input } })
  }
  return <div>TODO part</div>
  // return <Part part={{...part, code: part.code}} saveCode={saveCode} loading={loading} error={error} />
}
