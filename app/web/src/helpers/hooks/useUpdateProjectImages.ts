import { useMutation } from '@redwoodjs/web'

const UPDATE_PROJECT_IMAGES_MUTATION_HOOK = gql`
  mutation updateProjectImages(
    $id: String!
    $mainImage64: String
    $socialCard64: String
  ) {
    updateProjectImages(
      id: $id
      mainImage64: $mainImage64
      socialCard64: $socialCard64
    ) {
      id
      mainImage
      socialCard {
        id
        url
      }
    }
  }
`

export const useUpdateProjectImages = ({ onCompleted = () => {} }) => {
  const [updateProjectImages, { loading, error }] = useMutation(
    UPDATE_PROJECT_IMAGES_MUTATION_HOOK,
    { onCompleted }
  )

  return { updateProjectImages, loading, error }
}

export const makeSocialPublicId = (
  userName: string,
  projectTitle: string
): string => `u-${userName}-slash-p-${projectTitle}`
