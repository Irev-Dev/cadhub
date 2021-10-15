import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes, navigate } from '@redwoodjs/router'

import { QUERY } from 'src/components/SubjectAccessRequestsCell'

const DELETE_SUBJECT_ACCESS_REQUEST_MUTATION = gql`
  mutation DeleteSubjectAccessRequestMutation($id: String!) {
    deleteSubjectAccessRequest(id: $id) {
      id
    }
  }
`

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

const SubjectAccessRequest = ({ subjectAccessRequest }) => {
  const [deleteSubjectAccessRequest] = useMutation(
    DELETE_SUBJECT_ACCESS_REQUEST_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.subjectAccessRequests())
        toast.success('SubjectAccessRequest deleted.')
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
        <button
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(subjectAccessRequest.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default SubjectAccessRequest
