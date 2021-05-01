import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

export default function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout
      title={`Learn with ${siteConfig.title}`}
      description="The premier to learn Code-CAD"
    >
      <header
        className={clsx(
          'bg-gradient-to-r from-red-300 via-red-200 to-pink-100',
          styles.heroBanner
        )}
      >
        <div className="container">
          <h1 className="font-ropa-sans text-6xl pb-8 text-indigo-600">
            {siteConfig.title}
          </h1>
          <p className="font-ropa-sans text-indigo-700 max-w-3xl mx-auto text-lg">
            Cadhub is a community hub for Code-CAD projects aiming to push the
            paradigm forward.
          </p>
          <p className="font-ropa-sans text-indigo-700 max-w-3xl mx-auto text-lg">
            Code-CAD is the premier way to design parts, it fits into
            software-dev work-flow and is right level of abstraction having,
            parts defined as auditable scripts.
          </p>
          <p className="font-ropa-sans text-indigo-700 max-w-3xl mx-auto text-lg pb-6">
            We have beta integrations with OpenSCAD and CadQuery. The best way
            to learn more is to:
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'font-mono border-indigo-100 border rounded-md py-2 px-4 bg-pink-200 text-indigo-800 font-bold shadow hover:shadow-md',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-6xl mx-auto px-2 pb-32">
          <h2 className="text-indigo-700 text-5xl font-roboto my-16 tracking-widest font-light">
            What's the potential of code-cad?
          </h2>
          <MarketingPoint
            leadingPoint="Communication"
            title="Tech-drawing and CAD as communication medium"
          >
            <p className="max-w-2xl">
              Have you ever started frantically reaching for a pen when trying
              to explain an idea?
            </p>
            <p className="pt-4">
              Engineers love drawings and CAD extends that, though now
              communicating with machines is just as important as with
              colleagues. What better way to do that than with a deterministic,
              expressive and auditable script?
            </p>
          </MarketingPoint>
          <div className="mt-24">
            <div className="text-2xl text-pink-400 font-bold tracking-widest">
              Extensible
            </div>
            <h3 className="text-indigo-700 text-4xl mt-4">
              If <span className="line-through">it bleeds</span> it's text, we
              can <span className="line-through">kill</span> hack it
            </h3>
            <div className="text-gray-600 max-w-3xl text-2xl font-light mt-4">
              <ul className="list-disc pl-6">
                <li>Build your own helper functions and abstractions</li>
                <li>
                  Trigger{' '}
                  <a href="https://en.wikipedia.org/wiki/Finite_element_method">
                    FEM
                  </a>{' '}
                  or regenerate tool paths with a{' '}
                  <a href="https://www.redhat.com/en/topics/devops/what-is-ci-cd">
                    CI/CD
                  </a>{' '}
                  process
                </li>
                <li>
                  Auto-generate a{' '}
                  <a href="https://en.wikipedia.org/wiki/Bill_of_materials">
                    BOM
                  </a>
                </li>
                <li>
                  Integrate it into your{' '}
                  <a href="https://www.ptc.com/en/technologies/plm">PLM</a>{' '}
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
              working on a complex assembly without treading on each other --
              what else is there to say?
            </p>
          </MarketingPoint>
          <MarketingPoint
            leadingPoint="Rise of the developer"
            title="Leverage a growing industry"
          >
            <p>
              Software is taking over the world, and so are developers. In the
              U.S. developers are 1.4M strong and are predicted to increase
              their{' '}
              <a href="https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm">
                ranks by 22%
              </a>{' '}
              over the next 10 years. As coders proliferate, so will the number
              of areas in which they operate, including CAD.
            </p>
          </MarketingPoint>
        </div>
      </main>
    </Layout>
  )
}

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
