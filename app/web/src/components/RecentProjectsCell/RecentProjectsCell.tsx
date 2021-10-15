import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import type { Projects_Of_User } from 'types/graphql'
import { Link, routes } from '@redwoodjs/router'
import { QUERY as _QUERY } from 'src/components/ProjectsOfUserCell/ProjectsOfUserCell'

export const QUERY = _QUERY

export const Loading = () => <div>Loading...</div>

export const Empty = () => <p className="text-ch-gray-400">None yet!</p>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ projects }: CellSuccessProps<Projects_Of_User>) => {
  const filteredProjects = React.useMemo(
    () =>
      projects
        .slice(0, 3)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [projects]
  )
  return (
    <section>
      <ul>
        {filteredProjects.map(({ title, user }, index) => (
          <Link
            to={routes.project({
              userName: user?.userName,
              projectTitle: title,
            })}
            className="my-2 capitalize block hover:text-ch-pink-300"
            key={`project-item-${index}`}
          >
            <p>{title.replace(/[-_]/g, ' ')}</p>
          </Link>
        ))}
      </ul>
    </section>
  )
}
