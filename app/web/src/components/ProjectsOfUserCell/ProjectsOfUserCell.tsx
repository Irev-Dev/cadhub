import { Link, routes } from '@redwoodjs/router'

import Projects from 'src/components/Projects/Projects'

export const QUERY = gql`
  query PROJECTS_OF_USER($userName: String!) {
    projects(userName: $userName) {
      id
      title
      mainImage
      cadPackage
      childForks {
        id
      }
      createdAt
      updatedAt
      user {
        id
        image
        userName
      }
      Reaction {
        emote
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = ({ isMinimal = false }) => {
  return (
    <p className={`${isMinimal && 'my-2 text-ch-gray-400'}`}>
      No projects yet.
    </p>
  )
}

export const Success = ({
  projects,
  variables: { userName },
  shouldFilterProjectsWithoutImage = false,
  projectLimit = 80,
  isMinimal = false,
}) => {
  return (
    <Projects
      projects={projects}
      shouldFilterProjectsWithoutImage={shouldFilterProjectsWithoutImage}
      projectLimit={projectLimit}
      isMinimal={isMinimal}
    />
  )
}
