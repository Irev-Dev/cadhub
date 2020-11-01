import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

const DELETE_PART_MUTATION = gql`
  mutation DeletePartMutation($id: String!) {
    deletePart(id: $id) {
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

const PartsList = ({ parts }) => {
  const { addMessage } = useFlash()
  const [deletePart] = useMutation(DELETE_PART_MUTATION, {
    onCompleted: () => {
      addMessage('Part deleted.', { classes: 'rw-flash-success' })
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete part ' + id + '?')) {
      deletePart({ variables: { id }, refetchQueries: ['PARTS'] })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Main image</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>User id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.id}>
              <td>{truncate(part.id)}</td>
              <td>{truncate(part.title)}</td>
              <td>{truncate(part.description)}</td>
              <td>{truncate(part.code)}</td>
              <td>{truncate(part.mainImage)}</td>
              <td>{timeTag(part.createdAt)}</td>
              <td>{timeTag(part.updatedAt)}</td>
              <td>{truncate(part.userId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.part({ id: part.id })}
                    title={'Show part ' + part.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPart({ id: part.id })}
                    title={'Edit part ' + part.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    title={'Delete part ' + part.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(part.id)}
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

export default PartsList
