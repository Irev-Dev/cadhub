import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes, navigate } from '@redwoodjs/router'

import { QUERY } from 'src/components/SubjectAccessRequestsCell'

const DELETE_SUBJECT_ACCESS_REQUEST_MUTATION = gql`
  mutation DeleteSubjectAccessRequestMutation($id: String!) {
    deleteSubjectAccessRequest(id: $id) {
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

const SubjectAccessRequest = ({ subjectAccessRequest }) => {
  const { addMessage } = useFlash()
  const [deleteSubjectAccessRequest] = useMutation(
    DELETE_SUBJECT_ACCESS_REQUEST_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.subjectAccessRequests())
        addMessage('SubjectAccessRequest deleted.', {
          classes: 'rw-flash-success',
        })
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const onDeleteClick = (id) => {
    if (
      confirm(
        'Are you sure you want to delete subjectAccessRequest ' + id + '?'
      )
    ) {
      deleteSubjectAccessRequest({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            SubjectAccessRequest {subjectAccessRequest.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{subjectAccessRequest.id}</td>
            </tr>
            <tr>
              <th>Comment</th>
              <td>{subjectAccessRequest.comment}</td>
            </tr>
            <tr>
              <th>Payload</th>
              <td>{subjectAccessRequest.payload}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{subjectAccessRequest.userId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(subjectAccessRequest.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(subjectAccessRequest.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editSubjectAccessRequest({ id: subjectAccessRequest.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <a
          href="#"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(subjectAccessRequest.id)}
        >
          Delete
        </a>
      </nav>
    </>
  )
}

export default SubjectAccessRequest
