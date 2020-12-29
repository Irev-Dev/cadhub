import {
  topLeftFrame,
  bottomRightFrame,
  resizer,
  abstractCode,
  involuteDonut,
} from './mockEditorParts'
import Svg from 'src/components/Svg'
import OutBound from 'src/components/OutBound'
import LoginModal from 'src/components/LoginModal'
import { useState } from 'react'
import { routes, Link } from '@redwoodjs/router'

const LandingSection = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
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
            <div className="col-end-11 col-span-4 row-end-5 row-span-5 pt-12 animate-twist-sm-slow">
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
          title="Tech-drawing and CAD as communication medium"
        >
          <p className="max-w-2xl">
            Have you ever started frantically reaching for a pen when trying to
            explain an idea?
          </p>
          <p className="pt-4">
            Engineers love drawings and CAD extends that, though now
            communicating with machines is just as important as with colleagues.
            What better way to do that than with a deterministic, expressive and
            auditable script?
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
              <li>
                Trigger{' '}
                <QuickLink to="https://en.wikipedia.org/wiki/Finite_element_method">
                  FEM
                </QuickLink>{' '}
                or regenerate tool paths with a{' '}
                <QuickLink to="https://www.redhat.com/en/topics/devops/what-is-ci-cd">
                  CI/CD
                </QuickLink>{' '}
                process
              </li>
              <li>
                Auto-generate a{' '}
                <QuickLink to="https://en.wikipedia.org/wiki/Bill_of_materials">
                  BOM
                </QuickLink>
              </li>
              <li>
                Integrate it into your{' '}
                <QuickLink to="https://www.ptc.com/en/technologies/plm">
                  PLM
                </QuickLink>{' '}
                tools
              </li>
            </ul>
          </div>
        </div>
        <MarketingPoint
          leadingPoint="Git Good"
          title="All of the benefits of version control"
        >
          <p>
            Team coordination doesn't get any better than git. Multiple people
            working on a complex assembly without treading on each other -- what
            else is there to say?
          </p>
        </MarketingPoint>
        <MarketingPoint
          leadingPoint="Rise of the developer"
          title="Leverage a growing industry"
        >
          <p>
            Software is taking over the world, and so are developers. In the
            U.S. developers are 1.4M strong and are predicted to increase their{' '}
            <QuickLink to="https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm">
              ranks by 22%
            </QuickLink>{' '}
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
            <OutBound
              className="text-gray-600 underline"
              to="https://github.com/zalo/CascadeStudio"
            >
              CascadeStudio
            </OutBound>{' '}
            with more integrations coming soon.
          </p>
          <Link to={routes.draftPart()}>
            <div className="bg-texture bg-purple-800 text-center w-full py-6 rounded-b-md border border-indigo-300 border-opacity-0 hover:border-opacity-100 hover:shadow-xl">
              <span className="font-bold text-2xl text-indigo-200">
                Start Hacking Now
              </span>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex justify-center mt-64 pt-20 mb-32">
        <div className="flex text-2xl text-gray-500">
          See what other's have created
          <Svg
            name="arrow-down"
            className="h-12 w-12 animate-bounce text-indigo-300 ml-2"
          />
        </div>
      </div>
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        shouldStartWithSignup
      />
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

function QuickLink({ to, children }) {
  return (
    <OutBound className="text-gray-500 font-medium" to={to}>
      {children}
    </OutBound>
  )
}
