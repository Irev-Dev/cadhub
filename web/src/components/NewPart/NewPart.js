import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import PartForm from 'src/components/PartForm'

const CREATE_PART_MUTATION = gql`
  mutation CreatePartMutation($input: CreatePartInput!) {
    createPart(input: $input) {
      id
    }
  }
`

const NewPart = () => {
  const { addMessage } = useFlash()
  const [createPart, { loading, error }] = useMutation(CREATE_PART_MUTATION, {
    onCompleted: () => {
      navigate(routes.parts())
      addMessage('Part created.', { classes: 'rw-flash-success' })
    },
  })

  const onSave = (input) => {
    createPart({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Part</h2>
      </header>
      <div className="rw-segment-main">
        <PartForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewPart
