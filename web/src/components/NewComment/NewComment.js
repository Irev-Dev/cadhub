import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import CommentForm from 'src/components/CommentForm'

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
    }
  }
`

const NewComment = () => {
  const { addMessage } = useFlash()
  const [createComment, { loading, error }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      onCompleted: () => {
        navigate(routes.comments())
        addMessage('Comment created.', { classes: 'rw-flash-success' })
      },
    }
  )

  const onSave = (input) => {
    createComment({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Comment</h2>
      </header>
      <div className="rw-segment-main">
        <CommentForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewComment
