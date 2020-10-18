import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import PartForm from 'src/components/PartForm'

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
      code
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Success = ({ part }) => {
  const { addMessage } = useFlash()
  const [updatePart, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: () => {
      navigate(routes.parts())
      addMessage('Part updated.', { classes: 'rw-flash-success' })
    },
  })

  const onSave = (input, id) => {
    updatePart({ variables: { id, input } })
  }

  return (
    <PartForm part={part} onSave={onSave} error={error} loading={loading} />
  )
}
