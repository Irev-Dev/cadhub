import { useMutation } from '@redwoodjs/web'

const UPDATE_SOCIAL_CARD_MUTATION_HOOK = gql`
  mutation updateSocialCardByProjectId($projectId: String!, $url: String!) {
    updateSocialCardByProjectId(projectId: $projectId, url: $url) {
      id
      url
    }
  }
`

export const useUpdateSocialCard = ({ onCompleted = () => {} }) => {
  const [updateSocialCard, { loading, error }] = useMutation(
    UPDATE_SOCIAL_CARD_MUTATION_HOOK,
    { onCompleted }
  )

  return { updateSocialCard, loading, error }
}

export const makeSocialPublicId = (
  userName: string,
  projectTitle: string
): string => `u-${userName}-slash-p-${projectTitle}`
