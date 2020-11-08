import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import PartForm from 'src/components/PartForm'

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
const UPDATE_PART_MUTATION = gql`
  mutation UpdatePartMutation($id: String!, $input: UpdatePartInput!) {
    updatePart(id: $id, input: $input) {
      id
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
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Part {part.id}</h2>
      </header>
      <div className="rw-segment-main">
        <PartForm part={part} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
