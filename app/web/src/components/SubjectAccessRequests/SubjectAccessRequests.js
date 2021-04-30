import { useMutation, useFlash } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

import { QUERY } from 'src/components/SubjectAccessRequestsCell'

const DELETE_SUBJECT_ACCESS_REQUEST_MUTATION = gql`
  mutation DeleteSubjectAccessRequestMutation($id: String!) {
    deleteSubjectAccessRequest(id: $id) {
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

const SubjectAccessRequestsList = ({ subjectAccessRequests }) => {
  const { addMessage } = useFlash()
  const [deleteSubjectAccessRequest] = useMutation(
    DELETE_SUBJECT_ACCESS_REQUEST_MUTATION,
    {
      onCompleted: () => {
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Comment</th>
            <th>Payload</th>
            <th>User id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {subjectAccessRequests.map((subjectAccessRequest) => (
            <tr key={subjectAccessRequest.id}>
              <td>{truncate(subjectAccessRequest.id)}</td>
              <td>{truncate(subjectAccessRequest.comment)}</td>
              <td>{truncate(subjectAccessRequest.payload)}</td>
              <td>{truncate(subjectAccessRequest.userId)}</td>
              <td>{timeTag(subjectAccessRequest.createdAt)}</td>
              <td>{timeTag(subjectAccessRequest.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.subjectAccessRequest({
                      id: subjectAccessRequest.id,
                    })}
                    title={
                      'Show subjectAccessRequest ' +
                      subjectAccessRequest.id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editSubjectAccessRequest({
                      id: subjectAccessRequest.id,
                    })}
                    title={
                      'Edit subjectAccessRequest ' + subjectAccessRequest.id
                    }
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    title={
                      'Delete subjectAccessRequest ' + subjectAccessRequest.id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(subjectAccessRequest.id)}
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

export default SubjectAccessRequestsList
