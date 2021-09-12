import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Suspense } from 'react'
import { Html, Stats } from '@react-three/drei'
import CadPackage, {
  CadPackageType,
} from 'src/components/CadPackage/CadPackage'
import { navigate, routes, Link } from '@redwoodjs/router'
import { useInView } from 'react-intersection-observer'

import Svg, { SvgNames } from 'src/components/Svg/Svg'
import Gravatar from 'src/components/Gravatar/Gravatar'
import ProjectsCell from 'src/components/ProjectsCell'
import OutBound from 'src/components/OutBound/OutBound'

// dynamic import to enable pre-render iof the homepage
const Coffee = React.lazy(() => import('src/components/Hero/AssetWithGooey'))

export const Hero = () => {
  const [width, widthSetter] = React.useState(1024)

  React.useEffect(() => {
    const onResize = () => {
      widthSetter(window.innerWidth)
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const { heroOffset, tutOffset } = React.useMemo(() => {
    if (width < 1024) {
      return {
        heroOffset: [0, -3],
        tutOffset: [0, -3],
      }
    }
    return {
      heroOffset: [-5, 0],
      tutOffset: [4, 0],
    }
  }, [width])

  return (
    <div className="bg-ch-gray-800">
      <ModelSection assetUrl="/coffee-lid.stl" offset={heroOffset} scale={0.06}>
        <div className="grid lg:grid-cols-2 py-32">
          <div className="flex items-end justify-center row-start-2 lg:row-start-1 pt-96 lg:pt-0 pr-12 pl-6">
            <Link
              to={routes.project({
                userName: 'irevdev',
                projectTitle: 'coffee-lid',
              })}
            >
              <div className="grid grid-flow-col gap-2 sm:gap-4 items-center bg-ch-gray-760 bg-opacity-95 text-ch-gray-300 rounded-md p-2 font-fira-sans relative z-10 shadow-ch">
                <div className="pl-1 sm:pl-4">
                  <Gravatar
                    image="CadHub/xvrnxvarkv8tdzo4n65u"
                    className="w-12 h-12 mr-4"
                    size={60}
                  />
                </div>
                <div>
                  <div className="text-xl sm:text-3xl">Coffee Lid</div>
                  <div>IrevDev</div>
                </div>
                <div className="flex self-start">
                  <CadPackage
                    cadPackage="cadquery"
                    className="px-3 py-1  sm:text-xl rounded transform translate-x-4 sm:translate-x-10"
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className="col-start-1 lg:col-start-2 px-4">
            <div>
              <span
                className="text-7xl text-ch-blue-400 bg-ch-blue-640 bg-opacity-30 font-fira-code px-6 rounded-2xl shadow-ch"
                style={{
                  boxShadow: 'inset 0 4px 4px 0 rgba(255,255,255, 0.06)',
                }}
              >
                Code
              </span>
            </div>
            <div className="text-6xl font-fira-sans mt-8 text-ch-gray-300">
              is the future of CAD
            </div>
            <div className="text-2xl text-gray-600 mt-8 max-w-4xl">
              Designs backed by reliable, easy-to-write code open a world of new
              workflows and collaboration. We're building a place where you can
              build that future.
            </div>
            <OutlineButton
              color="pink"
              isLeft
              svgName="terminal"
              onClick={() =>
                navigate(routes.draftProject({ cadPackage: 'openscad' }))
              }
            >
              Start Hacking
            </OutlineButton>
          </div>
        </div>
      </ModelSection>
      <ChooseYourCharacter />
      <Community />
      <ModelSection assetUrl="/hinge.stl" offset={tutOffset} scale={0.12}>
        <div className="max-w-7xl mx-auto grid py-16 overflow-hidden">
          <div className="py-0 pb-32 lg:py-32 ml-4 col-start-1 lg:col-start-1 pr-12 pl-6">
            <div className="text-4xl mb-6 text-ch-gray-300">Learn Code-CAD</div>

            <p className="text-gray-600 max-w-lg">
              We want you to learn Code-CAD today so it can change the way you
              work tomorrow. Our community is writing tutorials to make this
              powerful paradigm more accessible to people new to code and CAD.
            </p>
            <OutBound
              to="https://learn.cadhub.xyz/docs/definitive-beginners/your-openscad-journey"
              className=""
            >
              <OutlineButton color="pink" isLeft svgName="terminal">
                Get Started with OpenSCAD
              </OutlineButton>
            </OutBound>
          </div>

          <div className="flex items-end justify-center row-start-2 lg:row-start-1 lg:col-start-2 pt-96 lg:pt-0 lg:pr-10">
            <Link
              to={routes.project({
                userName: 'irevdev',
                projectTitle: 'tutorial-hinge',
              })}
            >
              <div className="grid grid-flow-col sm:gap-2 items-center bg-ch-gray-760 bg-opacity-95 text-ch-gray-300 rounded-md py-2 pl-2 font-fira-sans relative z-10 shadow-ch">
                <div className="pl-1 sm:pl-4">
                  <Gravatar
                    image="CadHub/xvrnxvarkv8tdzo4n65u"
                    className="w-12 h-12 mr-4"
                    size={60}
                  />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl w-28 sm:w-auto">
                    Print in Place Hinge
                  </div>
                  <div>IrevDev</div>
                </div>
                <div className="flex self-start">
                  <CadPackage
                    cadPackage="openscad"
                    className="px-3 py-1 sm:text-xl rounded transform translate-x-4 sm:translate-x-10"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </ModelSection>
      <Roadmap />
      <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <Footer />
    </div>
  )
}

const DisableRender = () => useFrame(() => null, 1000)

function ModelSection({
  assetUrl,
  offset,
  children,
  scale,
}: {
  assetUrl: string
  offset: number[]
  children: React.ReactNode
  scale: number
}) {
  const { ref, inView } = useInView()
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0" ref={ref}>
        <Canvas
          linear
          dpr={[1, 2]}
          orthographic
          camera={{ zoom: 75, position: [0, 0, 500] }}
        >
          {!inView && <DisableRender />}
          <pointLight position={[2, 3, 5]} color="#FFFFFF" intensity={2} />
          <pointLight position={[2, 3, -5]} color="#FFFFFF" intensity={2} />
          <pointLight position={[-6, 3, -5]} color="#FFFFFF" intensity={2} />
          <pointLight position={[-6, 3, 5]} color="#FFFFFF" intensity={2} />

          <pointLight position={[2, 1.5, 0]} color="#0000FF" intensity={2} />
          <pointLight position={[2, 1.5, 0]} color="#FF0000" intensity={2} />
          <Suspense
            fallback={<Html center className="loading" children="Loading..." />}
          >
            <Coffee assetUrl={assetUrl} offset={offset} scale={scale} />
          </Suspense>

          {/* uncomment for framerate and render time */}
          {/* <Stats showPanel={0} className="three-debug-panel-1" /> */}
          {/* <Stats showPanel={1} className="three-debug-panel-2" /> */}
        </Canvas>
      </div>
    </div>
  )
}

function ChooseYourCharacter() {
  return (
    <div className="text-ch-gray-300 grid lg:grid-cols-2 gap-12 font-fira-sans py-32 max-w-7xl mx-auto px-4">
      <div className="">
        <div className="text-4xl mb-6">Choose your character</div>
        <p className="text-gray-600 text-2xl">
          CadHub is the place you can try out Code-CAD packages to find the one
          that's right for you. Our dedicated community is making CAD easy to
          learn on the web. Try one of our three integrations today and keep an
          eye out for more.
        </p>
      </div>
      <ul className="flex-col flex justify-around items-center lg:items-start text-gray-600">
        {[
          {
            cadPackage: 'openscad',
            desc: 'A mature Code-CAD library focused on Constructed Solid Geometry (CSG) modeling with syntax like C++.',
          },
          {
            cadPackage: 'cadquery',
            desc: 'A Python-based library with support for CSG and sketch-based modeling and a clean-feeling API.',
          },
          {
            cadPackage: 'jscad',
            desc: 'A JavaScript Code-CAD library that will feel familiar to web developers, based on the same tech as OpenSCAD.',
          },
        ].map(
          ({
            cadPackage,
            desc,
          }: {
            cadPackage: CadPackageType
            desc: string
          }) => (
            <li key={cadPackage} className="flex items-center">
              <div className="mr-4 sm:mr-12">
                <button
                  onClick={() => navigate(routes.draftProject({ cadPackage }))}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <CadPackage
                    cadPackage={cadPackage}
                    className="px-3 py-1 w-40 text-xl rounded"
                  />
                </button>
              </div>
              <p className="text-sm my-2 max-w-sm">{desc}</p>
            </li>
          )
        )}
      </ul>
    </div>
  )
}

function Community() {
  return (
    <div className="max-w-7xl mx-auto py-40">
      <div className="text-ch-gray-300 grid lg:grid-cols-2 gap-8 font-fira-sans px-4 mb-6">
        <div className="text-4xl">Explore with our community</div>

        <p className="text-gray-600 text-sm">
          CadHub is a social platform. You can ask users how they designed a
          part, fork their work to put your own spin on it, and find inspiration
          in abundance.
        </p>
      </div>

      <ProjectsCell shouldFilterProjectsWithoutImage projectLimit={8} />
      <div className="flex justify-end pr-4">
        <OutlineButton
          color="blue"
          svgName="arrow-right"
          onClick={() => navigate(routes.projects())}
        >
          See All Projects
        </OutlineButton>
      </div>
    </div>
  )
}

function OutlineButton({
  color,
  svgName,
  isLeft = false,
  children,
  onClick,
}: {
  color: 'blue' | 'pink' | 'purple'
  svgName: SvgNames
  isLeft?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`grid grid-flow-col-dense gap-4 items-center border px-4 py-1 rounded mt-6 relative z-10 ${
        color === 'pink' && 'border-ch-pink-500'
      } ${color === 'blue' && 'border-ch-blue-630'} ${
        color === 'purple' && 'border-ch-purple-500'
      }`}
    >
      {isLeft && (
        <Svg
          name={svgName}
          className={`${color === 'pink' && 'text-ch-pink-500'} ${
            color === 'blue' && 'text-ch-blue-300'
          } ${color === 'purple' && 'text-ch-purple-200'} w-6 h-6`}
        />
      )}
      <span
        className={`text-2xl ${color === 'pink' && 'text-ch-pink-300'} ${
          color === 'blue' && 'text-ch-blue-300'
        } ${color === 'purple' && 'text-ch-purple-200'}`}
      >
        {children}
      </span>
      {!isLeft && (
        <Svg
          name={svgName}
          className={`${color === 'pink' && 'text-ch-pink-500'} ${
            color === 'blue' && 'text-ch-blue-300'
          } ${color === 'purple' && 'text-ch-purple-200'} w-6 h-6`}
        />
      )}
    </button>
  )
}

function Roadmap() {
  const sections = [
    {
      title: 'Read our roadmap',
      desc: 'Version control with GitHub, multi-file projects, and team collaboration tools. We’ve got a lot planned, and we’re building it in the open.',
      buttonText: 'View on Github',
      color: 'purple',
      url: 'https://github.com/Irev-Dev/cadhub/discussions/212',
    },
    {
      title: 'Join our community',
      desc: 'CAD is ready to evolve. Join our Discord and opensource community on GitHub and build that future with us!',
      buttonText: 'Join the Discord',
      color: 'blue',
      url: 'https://discord.gg/SD7zFRNjGH',
    },
  ]
  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 py-32 mt-12">
      {sections.map(({ title, desc, buttonText, color, url }) => (
        <div className="ml-4 py-6" key={title}>
          <div className="text-4xl mb-6 text-ch-gray-300">{title}</div>
          <p className="text-gray-600 text-2xl max-w-lg">{desc}</p>
          <OutBound to={url} className="">
            <OutlineButton color={color} svgName="arrow-right">
              {buttonText}
            </OutlineButton>
          </OutBound>
        </div>
      ))}
    </div>
  )
}

function Footer() {
  const section: {
    header: string
    links: { name: string; url: string }[]
  }[] = [
    {
      header: 'Community',
      links: [
        {
          name: 'Github',
          url: 'https://github.com/Irev-Dev/cadhub',
        },
        {
          name: 'Discord',
          url: 'https://discord.gg/SD7zFRNjGH',
        },
        {
          name: 'Newsletter',
          url: 'https://kurthutten.com/signup/',
        },
      ],
    },
    {
      header: 'About',
      links: [
        {
          name: 'Road Map',
          url: 'https://github.com/Irev-Dev/cadhub/discussions/212',
        },
        {
          name: 'Code of Conduct',
          url: '/policies/code-of-conduct',
        },
        {
          name: 'Privacy Policy',
          url: '/policies/privacy-policy',
        },
      ],
    },
    {
      header: 'Learn',
      links: [
        {
          name: 'Documentation',
          url: 'https://learn.cadhub.xyz/',
        },
        {
          name: 'Blog',
          url: 'https://learn.cadhub.xyz/blog',
        },
      ],
    },
    {
      header: 'Integrations',
      links: [
        {
          name: 'OpenSCAD',
          url: 'https://openscad.org/',
        },
        {
          name: 'CadQuery',
          url: 'https://cadquery.readthedocs.io/en/latest/',
        },
        {
          name: 'JSCAD',
          url: 'https://github.com/jscad',
        },
      ],
    },
  ]
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 grid">
      <div className="pl-20 lg:pl-0">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden">
            <Svg className="w-10 md:w-16" name="favicon" />
          </div>
          <div className="ml-2 md:ml-8 flex">
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
        <p className="text-gray-600 text-xl mt-12 max-w-xs">
          Built by{' '}
          <OutBound
            to="https://github.com/Irev-Dev/cadhub/graphs/contributors"
            className="font-bold"
          >
            16 contributors
          </OutBound>{' '}
          from around the world.
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 flex-grow pl-20 row-start-2 lg:col-start-2 lg:row-start-1 mt-20 lg:mt-0">
        {section.map(({ header, links }) => (
          <ul
            className="text-ch-gray-300 font-fira-sans pt-8 sm:pt-0"
            key={header}
          >
            <li className="text-xl font-bold">{header}</li>
            {links.map(({ name, url }) => (
              <li className="text-lg mt-6 font-light" key={url}>
                <a href={url}>{name}</a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
