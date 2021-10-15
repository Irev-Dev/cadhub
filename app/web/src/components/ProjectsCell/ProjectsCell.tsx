import { Link, routes } from '@redwoodjs/router'

import Projects from 'src/components/Projects/Projects'

export const QUERY = gql`
  query PROJECTS {
    projects {
      id
      title
      cadPackage
      mainImage
      childForks {
        id
      }
      createdAt
      updatedAt
      user {
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
  return !isMinimal ? (
    <div className="rw-text-center">
      {'No projects yet. '}
      <Link to={routes.draftProject()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  ) : (
    <p className="text-ch-gray-400">None yet!</p>
  )
}

export const Success = ({
  projects,
  variables: { shouldFilterProjectsWithoutImage, projectLimit },
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
