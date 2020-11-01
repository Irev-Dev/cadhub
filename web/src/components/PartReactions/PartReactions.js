import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

const DELETE_PART_REACTION_MUTATION = gql`
  mutation DeletePartReactionMutation($id: String!) {
    deletePartReaction(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2))
}

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const PartReactionsList = ({ partReactions }) => {
  const { addMessage } = useFlash()
  const [deletePartReaction] = useMutation(DELETE_PART_REACTION_MUTATION, {
    onCompleted: () => {
      addMessage('PartReaction deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete partReaction ' + id + '?')) {
      deletePartReaction({
        variables: { id },
        refetchQueries: ['PART_REACTIONS'],
      })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Emote</th>
            <th>User id</th>
            <th>Part id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {partReactions.map((partReaction) => (
            <tr key={partReaction.id}>
              <td>{truncate(partReaction.id)}</td>
              <td>{truncate(partReaction.emote)}</td>
              <td>{truncate(partReaction.userId)}</td>
              <td>{truncate(partReaction.partId)}</td>
              <td>{timeTag(partReaction.createdAt)}</td>
              <td>{timeTag(partReaction.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.partReaction({ id: partReaction.id })}
                    title={'Show partReaction ' + partReaction.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPartReaction({ id: partReaction.id })}
                    title={'Edit partReaction ' + partReaction.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    title={'Delete partReaction ' + partReaction.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(partReaction.id)}
                  >
                    Delete
                  </a>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PartReactionsList
