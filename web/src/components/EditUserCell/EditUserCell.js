import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

import UserProfile from 'src/components/UserProfile'

export const QUERY = gql`
  query FIND_USER_BY_ID($userName: String!) {
    user: userName(userName: $userName) {
      id
      userName
      name
      createdAt
      updatedAt
      image
      bio
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($userName: String!, $input: UpdateUserInput!) {
    updateUserByUserName(userName: $userName, input: $input) {
      id
      userName
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ user, refetch, variables: { isEditable } }) => {
  const { addMessage } = useFlash()
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: ({ updateUserByUserName }) => {
      navigate(routes.user({ userName: updateUserByUserName.userName }))
      addMessage('User updated.', { classes: 'rw-flash-success' })
    },
  })

  const onSave = async (userName, input) => {
    await updateUser({ variables: { userName, input } })
    refetch()
  }

  return (
    <UserProfile
      user={user}
      onSave={onSave}
      loading={loading}
      error={error}
      isEditable={isEditable}
    />
  )
}
