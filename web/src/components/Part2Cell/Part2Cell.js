import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

import PartProfile from 'src/components/PartProfile'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE($userName: String!, $partTitle: String!) {
    userPart: userName(userName: $userName) {
      id
      name
      userName
      bio
      image
      Part(partTitle: $partTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
      }
    }
  }
`

const UPDATE_PART_MUTATION = gql`
  mutation UpdatePartMutation($id: String!, $input: UpdatePartInput!) {
    updatePart:updatePart(id: $id, input: $input) {
      id
      title
      user {
        id
        userName
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ userPart, variables: {isEditable} }) => {
  const { addMessage } = useFlash()
  const [updateUser, { loading, error }] = useMutation(UPDATE_PART_MUTATION, {
    onCompleted: ({updatePart}) => {
      navigate(routes.part2({userName: updatePart.user.userName, partTitle: updatePart.title}))
      addMessage('Part updated.', { classes: 'rw-flash-success' })
    },
  })

  const onSave = (id, input) => {
    updateUser({ variables: { id, input } })
  }

  return <PartProfile
    userPart={userPart}
    onSave={onSave}
    loading={loading}
    error={error}
    isEditable={isEditable}
  />
}
