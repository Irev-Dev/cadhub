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
import { DynamicProjectButton } from 'src/components/NavPlusButton/NavPlusButton'
import FatalErrorBoundary from 'src/components/FatalErrorBoundary/FatalErrorBoundary'

// dynamic import to enable pre-render iof the homepage
const AssetWithGooey = React.lazy(
  () => import('src/components/Hero/AssetWithGooey')
)
const cqCode = `module beam(r1, r2, shr, msr){
  /* The walking beam acts as a class I lever transferring the
   * movement from the pitmans arms to the horse head. */

  H = 12; // Height
  W = 10; // Width
  e = 10; // Total added extension

  difference(){
      union(){
          translate([(r2-r1)/2,0,H/2]) // Walking beam body
              cube([r1+r2+e, W, H], center = true);

          rotate([90, 0, 0]) // Fulcrum or pivoting point
              cylinder(r = 2*msr, h = W, center = true);
      }

      rotate([90,0,0]) // Pivoting point hole
          cylinder(r = msr, h = W+1, center = true);

      translate([r2,0,H/2]) // Equalizer mounting screw hole
          cylinder(r = shr, h = H+1, center = true);
`.split('\n')

const scadCode = `hingeHalfExtrudeLength=hingeLength/2-clearance/2;
mountingHoleMoveIncrement=(hingeLength-2*mountingHoleEdgeOffset)/
  (mountingHoleCount-1);

module costomizerEnd() {}
$fn=30;
tiny=0.005;
// modules
module hingeBaseProfile() {
  translate([pivotRadius,0,0]){
    square([baseWidth,baseThickness]);
  }
}

module hingeBodyHalf() {
  difference() {
    union() {
      linear_extrude(hingeHalfExtrudeLength){
        offset(1)offset(-2)offset(1){
          translate([0,pivotRadius,0]){
            circle(pivotRadius);
          }
          square([pivotRadius,pivotRadius]);
          hingeBaseProfile();
        }
      }
      linear_extrude(hingeLength){
        offset(1)offset(-1)hingeBaseProfile();
      }
    }
    plateHoles();
  }
}`.split('\n')

export const Hero = () => {
  return (
    <div className="bg-ch-gray-800">
      <div className="relative h-0 w-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath
              id="code-blob-clip-path"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.0038 0.0056)"
            >
              <path
                d="M68.5 169.159C13.3 167.159 5.69181e-05 144.659 0 71.1594C3.99994 13.1594 50.9244 -14.591 121.5 7.65941C223 39.6594 266 25.1594 263.5 113.659C261.634 179.701 191.5 173.616 68.5 169.159Z"
                fill="#C4C4C4"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="grid lg:grid-cols-5 max-w-8xl mx-auto">
        <div className="relative row-start-2 col-start-1 h-full lg:row-start-1 lg:col-span-3 lg:col-start-1 z-10">
          <div
            className="absolute inset-0 my-20 mx-10 lg:mr-40 bg-gradient-to-tr from-pink-400 to-blue-600 opacity-40 overflow-hidden"
            style={{ clipPath: 'url(#code-blob-clip-path)' }}
          >
            <pre className="lg:ml-20 mt-12 text-blue-100 font-fira-code">
              {cqCode.map((line, index) => (
                <div key={index}>
                  <span className="w-12 pr-6 text-blue-200 text-opacity-50 inline-block text-right">
                    {index + 1}
                  </span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
          <ModelSection assetUrl="/pumpjack.stl" scale={0.04} />
        </div>

        <div className="flex items-end justify-center row-start-2 col-start-1 pt-96 pr-12 pl-6 pb-24 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-0 pointer-events-none">
          <Link
            to={routes.project({
              userName: 'matiasmiche',
              projectTitle: 'oil-pumpjack',
            })}
          >
            <div
              className="grid grid-flow-col gap-2 sm:gap-4 items-center bg-ch-gray-760 bg-opacity-95 text-ch-gray-300 rounded-md p-2 font-fira-sans relative z-10 shadow-ch pointer-events-auto"
              style={{
                transform: 'translate3d(3vw, -100px, 0.3px) scale(0.7)',
                transformOrigin: 'top center',
              }}
            >
              <div className="pl-1 sm:pl-4">
                <Gravatar
                  image="CadHub/jjze0hyqncxvkvsg4agz"
                  className="w-12 h-12 mr-4"
                  size={60}
                />
              </div>
              <div>
                <div className="text-xl sm:text-3xl">Oil Pumpjack</div>
                <div>matiasmiche</div>
              </div>
              <div className="flex self-start">
                <CadPackage
                  cadPackage="openscad"
                  className="px-3 py-1  sm:text-xl rounded transform translate-x-4 sm:translate-x-10"
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-start-1 px-4 py-32 lg:col-start-3 lg:row-start-1 lg:col-span-3 lg:pl-52">
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
      <ChooseYourCharacter />
      <Community />
      <div className="max-w-8xl mx-auto grid lg:grid-cols-5 py-16">
        <div className="row-start-2 col-start-1 lg:col-span-3 lg:col-start-3 lg:row-start-1 lg:-mx-10 h-full relative z-10">
          <div
            className="absolute inset-0 mb-24 mt-16 ml:10 mr:10 lg:ml-40 lg:mr-52 bg-gradient-to-tr from-pink-400 to-blue-600 opacity-30 overflow-hidden"
            style={{ clipPath: 'url(#code-blob-clip-path)' }}
          >
            <pre className="ml-10 mt-12 text-blue-100 text-xs font-fira-code">
              {scadCode.map((line, index) => (
                <div key={index}>
                  <span className="w-12 pr-6 text-blue-200 text-opacity-50 inline-block text-right">
                    {index + 1}
                  </span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
          <ModelSection assetUrl="/hinge.stl" scale={0.12} />
        </div>

        <div className="py-12 pb-32 ml-4 row-start-1 col-start-1 pr-12 pl-6 lg:py-32 lg:col-start-1 lg:col-span-3">
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

        <div className="flex items-end justify-center row-start-2 col-start-1 pb-24 lg:row-start-1 lg:col-start-3 lg:col-span-3 pt-96 lg:pt-0 lg:pr-10 pointer-events-none">
          <Link
            to={routes.project({
              userName: 'irevdev',
              projectTitle: 'tutorial-hinge',
            })}
          >
            <div
              className="grid grid-flow-col sm:gap-2 items-center bg-ch-gray-760 bg-opacity-95 text-ch-gray-300 rounded-md py-2 pl-2 font-fira-sans relative z-10 shadow-ch pointer-events-auto"
              style={{
                transform: 'translate3d(-5vw, -100px, 0.3px) scale(0.7)',
                transformOrigin: 'top center',
              }}
            >
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
      <Roadmap />
      <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <Footer />
    </div>
  )
}

const DisableRender = () => useFrame(() => null, 1000)

function ModelSection({
  assetUrl,
  scale,
}: {
  assetUrl: string
  scale: number
}) {
  const { ref, inView } = useInView()
  return (
    <div className="relative h-full">
      <FatalErrorBoundary
        page={() => (
          <div className="bg-gray-800 p-8 rounded-md text-ch-gray-300">
            something seams to have gone wrong here
          </div>
        )}
      >
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
              fallback={
                <Html center className="loading" children="Loading..." />
              }
            >
              <AssetWithGooey assetUrl={assetUrl} scale={scale} />
            </Suspense>

            {/* uncomment for framerate and render time */}
            {/* <Stats showPanel={0} className="three-debug-panel-1" /> */}
            {/* <Stats showPanel={1} className="three-debug-panel-2" /> */}
          </Canvas>
        </div>
      </FatalErrorBoundary>
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
                <DynamicProjectButton ideType={cadPackage} className="">
                  <CadPackage
                    cadPackage={cadPackage}
                    className="px-3 py-1 w-40 text-xl rounded"
                  />
                </DynamicProjectButton>
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
            21 contributors
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
