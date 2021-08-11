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

export const Success = ({
  userProject,
}: CellSuccessProps<FindSocialCardQuery>) => {
  const image = userProject?.Project?.mainImage
  const gravatar = userProject?.image
  return (
    <div
      className="flex-col flex h-screen bg-ch-gray-800 text-ch-gray-300"
      id="social-card-loaded"
    >
      <div
        className="flex-grow grid"
        style={{ gridTemplateColumns: '7fr 5fr' }}
      >
        <div className="bg-ch-gray-800 relative">
          <div className="absolute bottom-0 left-0 transform scale-200 aspect-h-1 h-full -translate-x-24 translate-y-24 rotate-45 rounded-full overflow-hidden">
            {/* <CloudinaryImage
                  cloudName="irevdev"
                  publicId={image || 'CadHub/eia1kwru54g2kf02s2xx'}
                  width={500}
                  crop="scale"
                /> */}
          </div>

          <div className="relative bg-ch-gray-760 bg-opacity-90 pt-10 pl-20 pr-12 h-full backdrop-filter backdrop-blur">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {gravatar && (
                  <Gravatar image={gravatar} className="w-14 h-14" size={60} />
                )}
                <div className="text-2xl font-fira-sans ml-6">
                  {userProject?.userName}
                </div>
              </div>
              <CadPackage
                cadPackage={userProject?.Project?.cadPackage}
                className="p-2 rounded px-4"
              />
            </div>

            <h1 className="text-6xl font-fira-sans mt-16 capitalize">
              {userProject?.Project?.title.replace(/-/g, ' ')}
            </h1>

            <p className="mt-10 text-2xl font-fira-sans text-ch-gray-400">
              {(userProject?.Project?.description || '').slice(0, 150)}
            </p>
          </div>
        </div>
        <div className="h-full overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <CloudinaryImage
              cloudName="irevdev"
              publicId={image || 'CadHub/eia1kwru54g2kf02s2xx'}
              width={500}
              height={522}
              crop="crop"
            />
          </div>
        </div>
      </div>
      <div
        className="h-24 grid bg-ch-gray-900 relative"
        style={{ gridTemplateColumns: '7fr 5fr' }}
      >
        <div className="grid grid-flow-col-dense items-center justify-center gap-16">
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
              <Svg className="w-10" name={svg} />
              <div className="flex flex-col">
                <div className="text-3xl">{count}</div>
                <div className="text-xl text-ch-gray-400">{title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Svg className="w-10 md:w-16" name="favicon" />
          <div className="ml-2 md:ml-6 flex">
            {/* Because of how specific these styles are to this heading/logo and it doesn't need to be replicated else where as well as it's very precise with the placement of "pre-alpha" I think it's appropriate. */}
            <h2
              className="text-indigo-300 text-2xl md:text-5xl font-ropa-sans py-1 md:tracking-wider"
              style={{ letterSpacing: '0.3em' }}
            >
              CadHub
            </h2>
            <div
              className="text-pink-400 text-sm font-bold font-ropa-sans hidden md:block"
              style={{ paddingBottom: '2rem', marginLeft: '-1.8rem' }}
            >
              pre-alpha
            </div>
          </div>
        </div>
      </div>
      <div className="h-3 relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </div>
  )
}
