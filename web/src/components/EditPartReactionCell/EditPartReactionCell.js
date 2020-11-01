import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import PartReactionForm from 'src/components/PartReactionForm'

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
const UPDATE_PART_REACTION_MUTATION = gql`
  mutation UpdatePartReactionMutation(
    $id: String!
    $input: UpdatePartReactionInput!
  ) {
    updatePartReaction(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Success = ({ partReaction }) => {
  const { addMessage } = useFlash()
  const [updatePartReaction, { loading, error }] = useMutation(
    UPDATE_PART_REACTION_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.partReactions())
        addMessage('PartReaction updated.', { classes: 'rw-flash-success' })
      },
    }
  )

  const onSave = (input, id) => {
    updatePartReaction({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit PartReaction {partReaction.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <PartReactionForm
          partReaction={partReaction}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
