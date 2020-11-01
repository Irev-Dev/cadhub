import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes, navigate } from '@redwoodjs/router'

const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: String!) {
    deletePart(id: $id) {
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

const Part = ({ part }) => {
  const { addMessage } = useFlash()
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: () => {
      navigate(routes.parts())
      addMessage('Part deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete part ' + id + '?')) {
      deletePart({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Part {part.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{part.id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{part.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{part.description}</td>
            </tr>
            <tr>
              <th>Code</th>
              <td>{part.code}</td>
            </tr>
            <tr>
              <th>Main image</th>
              <td>{part.mainImage}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(part.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(part.updatedAt)}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{part.userId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editPart({ id: part.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <a
          href="#"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(part.id)}
        >
          Delete
        </a>
      </nav>
    </>
  )
}

export default Part
