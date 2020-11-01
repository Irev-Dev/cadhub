import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes, navigate } from '@redwoodjs/router'

const DELETE_PART_REACTION_MUTATION = gql`
  mutation DeletePartReactionMutation($id: String!) {
    deletePartReaction(id: $id) {
      id
    }
  }
`

const jsonDisplay = (obj) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
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

const PartReaction = ({ partReaction }) => {
  const { addMessage } = useFlash()
  const [deletePartReaction] = useMutation(DELETE_PART_REACTION_MUTATION, {
    onCompleted: () => {
      navigate(routes.partReactions())
      addMessage('PartReaction deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete partReaction ' + id + '?')) {
      deletePartReaction({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            PartReaction {partReaction.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{partReaction.id}</td>
            </tr>
            <tr>
              <th>Emote</th>
              <td>{partReaction.emote}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{partReaction.userId}</td>
            </tr>
            <tr>
              <th>Part id</th>
              <td>{partReaction.partId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(partReaction.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(partReaction.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editPartReaction({ id: partReaction.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <a
          href="#"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(partReaction.id)}
        >
          Delete
        </a>
      </nav>
    </>
  )
}

export default PartReaction
