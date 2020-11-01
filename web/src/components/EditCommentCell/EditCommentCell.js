import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import CommentForm from 'src/components/CommentForm'

export const QUERY = gql`
  query FIND_COMMENT_BY_ID($id: String!) {
    comment: comment(id: $id) {
      id
      text
      userId
      partId
      createdAt
      updatedAt
    }
  }
`
const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateCommentMutation($id: String!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Success = ({ comment }) => {
  const { addMessage } = useFlash()
  const [updateComment, { loading, error }] = useMutation(
    UPDATE_COMMENT_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.comments())
        addMessage('Comment updated.', { classes: 'rw-flash-success' })
      },
    }
  )

  const onSave = (input, id) => {
    updateComment({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Comment {comment.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <CommentForm
          comment={comment}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
