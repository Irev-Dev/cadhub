import type { FindSocialCardQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Svg from 'src/components/Svg/Svg'
import { Image as CloudinaryImage } from 'cloudinary-react'
import Gravatar from 'src/components/Gravatar/Gravatar'
import CadPackage from 'src/components/CadPackage/CadPackage'

export const QUERY = gql`
  query FindSocialCardQuery($userName: String!, $projectTitle: String) {
    userProject: userName(userName: $userName) {
      userName
      image
      Project(projectTitle: $projectTitle) {
        id
        title
        description
        mainImage
        createdAt
        updatedAt
        userId
        cadPackage
        Reaction {
          emote
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

interface SocialCardProps extends CellSuccessProps<FindSocialCardQuery> {
  children: React.ReactNode
}

export const Success = ({
  userProject,
  variables: { image64 },
  children,
}: SocialCardProps) => {
  const image = userProject?.Project?.mainImage
  const gravatar = userProject?.image
  const truncatedDescription =
    userProject?.Project?.description?.length > 150
      ? (userProject?.Project?.description || '').slice(0, 145) + ' . . .'
      : userProject?.Project?.description || ''
  return (
    <div
      className="grid h-full bg-ch-gray-800 text-ch-gray-300"
      id="social-card-loaded"
      style={{ gridTemplateRows: ' 555fr 18fr' }}
    >
      <div className="h-full grid" style={{ gridTemplateColumns: '7fr 5fr' }}>
        <div className="bg-ch-gray-800 relative overflow-hidden min-w-0">
          <div className="absolute bottom-0 left-0 transform scale-200 aspect-h-1 h-full -translate-x-24 translate-y-24 rotate-45 rounded-full overflow-hidden"></div>

          <div className="relative bg-ch-gray-760 bg-opacity-90 pt-10 pl-20 pr-12 h-full backdrop-filter backdrop-blur">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {gravatar && (
                  <Gravatar image={gravatar} className="w-18 h-18" size={60} />
                )}
                <div className="text-3xl font-fira-sans ml-6 whitespace-nowrap">
                  {userProject?.userName}
                </div>
              </div>
              <CadPackage
                cadPackage={userProject?.Project?.cadPackage}
                className="p-2 rounded px-4 transform scale-150 origin-right"
              />
            </div>

            <h1 className="text-6xl font-fira-sans mt-12 capitalize">
              {userProject?.Project?.title.replace(/-/g, ' ')}
            </h1>

            <p className="mt-10 text-3xl font-fira-sans text-ch-gray-400 overflow-hidden">
              {truncatedDescription}
            </p>
          </div>
        </div>
        <div className="h-full overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {image64 ? (
              <div
                style={{ backgroundImage: `url(${image64})` }}
                className="w-full h-full bg-no-repeat bg-center"
              />
            ) : (
              <div
                style={{
                  backgroundImage: `url(http://res.cloudinary.com/irevdev/image/upload/c_crop,h_522,w_500/v1/${image})`,
                }}
                className="w-full h-full bg-no-repeat bg-center bg-blend-difference bg-contain bg-ch-gray-800"
              />
            )}
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center ${
              image64 && 'opacity-0'
            }`}
          >
            {children && (
              <div className="w-full h-full" id="social-card-canvas">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="h-28 grid bg-ch-gray-900 relative"
        style={{ gridTemplateColumns: '7fr 5fr' }}
      >
        <div className="grid grid-flow-col-dense items-center justify-center gap-16 mb-2">
          {[
            {
              svg: 'reactions',
              title: 'Reactions',
              count: userProject?.Project?.Reaction?.length,
            },
            {
              svg: 'fork-new',
              title: 'Forks',
              count: 0,
            },
          ].map(({ svg, title, count }, index) => (
            <div className="grid grid-flow-col-dense gap-4" key={index}>
              <Svg className="w-12" name={svg} />
              <div className="flex flex-col">
                <div className="text-4xl">{count}</div>
                <div className="text-3xl text-ch-gray-400">{title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mb-2">
          <Svg className="w-10 md:w-16" name="favicon" />
          <div className="ml-2 md:ml-6 flex">
            {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
            <h2
              className="text-indigo-300 text-3xl md:text-5xl font-ropa-sans py-1 md:tracking-wider"
              style={{ letterSpacing: '0.3em' }}
            >
              CadHub
            </h2>
          </div>
        </div>
        <div className="h-3 absolute inset-x-0 bottom-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </div>
    </div>
  )
}
