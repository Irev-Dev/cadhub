import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import PartReactionForm from 'src/components/PartReactionForm'

const CREATE_PART_REACTION_MUTATION = gql`
  mutation CreatePartReactionMutation($input: CreatePartReactionInput!) {
    createPartReaction(input: $input) {
      id
    }
  }
`

const NewPartReaction = () => {
  const { addMessage } = useFlash()
  const [createPartReaction, { loading, error }] = useMutation(
    CREATE_PART_REACTION_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.partReactions())
        addMessage('PartReaction created.', { classes: 'rw-flash-success' })
      },
    }
  )

  const onSave = (input) => {
    createPartReaction({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New PartReaction</h2>
      </header>
      <div className="rw-segment-main">
        <PartReactionForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewPartReaction
