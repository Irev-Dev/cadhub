import {
  topLeftFrame,
  bottomRightFrame,
  resizer,
  abstractCode,
  involuteDonut,
} from './mockEditorParts'
import Svg from 'src/components/Svg'
import { Link } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

const LandingSection = () => {
  const { logIn, isAuthenticated } = useAuth()
  return (
    <div className="mt-16">
      <div className="relative p-4 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-200 via-pink-200 to-red-400 landing-bg-clip-path" />
        <div className="max-w-6xl px-2 mx-auto font-roboto">
          <div className="relative">
            <div className="bg-pink-200 rounded-tr-2xl absolute top-0 right-0 h-24 w-32 hidden lg:block" />
            <div className="bg-pink-300 rounded-tr-2xl absolute bottom-0 right-0 h-24 w-32 mr-8 hidden lg:block" />
            <div className="inline-block relative z-10">
              <div className="flex-col flex">
                <div className="text-indigo-600 pb-3 tracking-widest">
                  Here's a thought,
                </div>
                <h1 className="font-bold text-indigo-800 text-5xl inline-block tracking-wider">
                  <span className="text-6xl">C</span>
                  ode is the future of <span className="text-6xl">C</span>
                  AD
                </h1>
                <div className="text-indigo-600 text-base font-normal self-end pt-3 tracking-widest">
                  No more click-n-drool.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-11 grid-rows-5 grid-flow-row-dense grid-flow-col-dense mt-32">
            <div className=" col-start-1 col-span-5 row-start-1 row-span-3">
              {topLeftFrame}
            </div>
            <div className="col-start-2 col-span-4 row-start-2 row-span-4 pt-8 animate-bounce-sm-slow">
              {abstractCode}
            </div>
            <div className="col-end-11 col-span-4 row-end-5 row-span-5 pt-12">
              {involuteDonut}
            </div>
            <div className="col-start-5 col-span-2 row-start-2 row-span-4">
              {resizer}
            </div>
            <div className="col-end-12 row-end-7 col-span-4 row-span-3">
              {bottomRightFrame}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-2">
        <h2 className="text-indigo-700 text-5xl font-roboto my-16 tracking-widest font-light">
          What's the potential of code-cad?
        </h2>
        <MarketingPoint
          leadingPoint="Communication"
          title="Tech-drawing and CAD as communication medium."
        >
          <p>
            Have you ever started frantically reaching for a pen when trying to
            explain an idea?
          </p>
          <p>
            Engineers love drawings and CAD extends that. Only now communicating
            with machines is just as important as with colleagues, and what
            better way to do that than with a deterministic, expressive and
            auditable script.
          </p>
        </MarketingPoint>
        <div className="mt-24">
          <div className="text-2xl text-pink-400 font-bold tracking-widest">
            Extensible
          </div>
          <h3 className="text-indigo-700 text-4xl mt-4">
            If <span className="line-through">it bleeds</span> it's text, we can{' '}
            <span className="line-through">kill</span> hack it
          </h3>
          <div className="text-gray-600 max-w-3xl text-2xl font-light mt-4">
            <ul className="list-disc pl-6">
              <li>Build your own helper functions and abstractions</li>
              <li>Trigger FEM or regenerate tool paths with a CI/CD process</li>
              <li>Auto-generate a BOM</li>
              <li>Integrate it into your PLM tools</li>
            </ul>
          </div>
        </div>
        <MarketingPoint
          leadingPoint="Git Good"
          title="All of the benefits of version control"
        >
          <p>
            Team coordination doesn't get any better than git. Multiple people
            working on a complex assembly without treading on each other. What
            else is there to say.
          </p>
        </MarketingPoint>
        <MarketingPoint
          leadingPoint="Rise of the developer"
          title="Leverage a growing industry"
        >
          <p>
            Software is taking over the world, and so are developers. In the
            U.S. developers are 1.4M strong and are predicted to increase their{' '}
            <Link
              className="text-gray-500 font-medium"
              to="https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm"
            >
              ranks by 22%
            </Link>{' '}
            over the next 10 years. As coders proliferate, so will the number of
            areas in which they operate, including CAD.
          </p>
        </MarketingPoint>
      </div>
      <div className="w-3/4 mx-auto h-px bg-pink-400 mt-32" />
      <div className="mt-24">
        <p className="text-center text-pink-400 max-w-xl text-2xl mx-auto font-medium">
          CadHub is a space to share cad projects and it’s our gift to the
          code-cad community. Let’s celebrate and promote code-cad together.
        </p>
        <div className="rounded-md shadow-md max-w-lg mx-auto border border-gray-300 mt-16">
          <p className="text-2xl font-medium text-gray-600 p-8">
            Projects use the excellent{' '}
            <Link
              className="text-gray-600 underline"
              to="https://github.com/zalo/CascadeStudio"
            >
              CascadeStudio
            </Link>{' '}
            with more integrations coming soon.
          </p>
          <button
            className="font-bold text-2xl bg-texture bg-purple-800 text-center w-full py-6 rounded-b-md border border-indigo-300 border-opacity-0 hover:border-opacity-100 hover:shadow-xl"
            onClick={logIn}
          >
            <span className="text-indigo-200">Start Hacking Now</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-64 pt-20 mb-20">
        <div className="flex text-2xl text-gray-500">
          See what other's have created
          <Svg
            name="arrow-down"
            className="h-12 w-12 animate-bounce text-indigo-300 ml-2"
          />
        </div>
      </div>
    </div>
  )
}

export default LandingSection

function MarketingPoint({ leadingPoint, title, children }) {
  return (
    <div className="mt-24">
      <div className="text-2xl text-pink-400 font-bold tracking-widest">
        {leadingPoint}
      </div>
      <h3 className="text-indigo-700 text-4xl mt-4">{title}</h3>
      <div className="text-gray-600 max-w-3xl text-2xl font-light mt-4">
        {children}
      </div>
    </div>
  )
}
