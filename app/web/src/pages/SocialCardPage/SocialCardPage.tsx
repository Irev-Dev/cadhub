import { Link, routes } from '@redwoodjs/router'
import SocialCardCell from 'src/components/SocialCardCell'

interface Props {
  userName: string
  projectTitle: string
}

const SocialCardPage = ({ userName, projectTitle }: Props) => {
  return <SocialCardCell userName={userName} projectTitle={projectTitle} />
}

export default SocialCardPage
