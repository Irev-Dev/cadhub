import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes } from '@redwoodjs/router'

import { QUERY } from 'src/components/AdminProjectsCell/AdminProjectsCell'

const DELETE_PROJECT_MUTATION_ADMIN = gql`
  mutation DeleteProjectMutationAdmin($id: String!) {
    deleteProject(id: $id) {
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

const AdminProjects = ({ projects }) => {
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION_ADMIN, {
    onCompleted: () => {
      toast.success('Project deleted.')
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete project ' + id + '?')) {
      deleteProject({ variables: { id } })
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
            <th>Deleted</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{truncate(project.id)}</td>
              <td>{truncate(project.title)}</td>
              <td>{truncate(project.description)}</td>
              <td>{truncate(project.code)}</td>
              <td>{truncate(project.mainImage)}</td>
              <td>{timeTag(project.createdAt)}</td>
              <td>{timeTag(project.updatedAt)}</td>
              <td>{truncate(project.userId)}</td>
              <td>{checkboxInputTag(project.deleted)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.project({
                      userName: project?.user?.userName,
                      projectTitle: project?.title,
                    })}
                    title={'Show project ' + project.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editProject({
                      userName: project?.user?.userName,
                      projectTitle: project?.title,
                    })}
                    title={'Edit project ' + project.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <a
                    href="#"
                    title={'Delete project ' + project.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(project.id)}
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

export default AdminProjects
