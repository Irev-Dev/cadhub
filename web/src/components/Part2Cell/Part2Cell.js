import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import PartProfile from 'src/components/PartProfile'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE($userName: String!, $partTitle: String!, $currentUserId: String!) {
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
        Reaction {
          emote
        }
        userReactions: Reaction(userId: $currentUserId) {
          emote
        }
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
const TOGGLE_REACTION_MUTATION = gql`
  mutation ToggleReactionMutation($input: TogglePartReactionInput!) {
    togglePartReaction(input: $input){
      id
      emote
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ userPart, variables: {isEditable}, refetch}) => {
  const { currentUser } = useAuth()
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

  const [toggleReaction] = useMutation(TOGGLE_REACTION_MUTATION, {
    onCompleted: (hey) => refetch()
  })
  const onReaction = (emote) => toggleReaction({variables: {input: {
    emote,
    userId: currentUser.sub,
    partId: userPart?.Part?.id,
  }}})

  return <PartProfile
    userPart={userPart}
    onSave={onSave}
    loading={loading}
    error={error}
    isEditable={isEditable}
    onReaction={onReaction}
  />
}
