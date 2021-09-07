import { Link, routes } from '@redwoodjs/router'
import OutBound from 'src/components/OutBound'

const Footer = () => {
  return (
    <div className="bg-indigo-900 text-indigo-200 font-roboto text-sm">
      <div className="flex h-16 md:justify-end items-center mx-2 md:mx-16 flex-wrap">
        <OutBound className="mr-8" to="https://github.com/Irev-Dev/cadhub">
          Github
        </OutBound>
        <OutBound className="mr-8" to="https://learn.cadhub.xyz/">
          Docs
        </OutBound>
        <OutBound
          className="mr-8"
          to="https://github.com/Irev-Dev/cadhub/discussions/212"
        >
          Road Map
        </OutBound>
        <OutBound className="mr-8" to="https://learn.cadhub.xyz/blog">
          Blog
        </OutBound>
        <Link className="mr-8" to={routes.codeOfConduct()}>
          Code of Conduct
        </Link>
        <Link to={routes.privacyPolicy()}>Privacy Policy</Link>
      </div>
    </div>
  )
}

export default Footer
