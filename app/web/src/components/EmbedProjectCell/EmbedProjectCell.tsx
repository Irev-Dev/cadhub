import { useIdeState } from 'src/helpers/hooks/useIdeState'
import { IdeContext } from 'src/helpers/hooks/useIdeContext'
import EmbedViewer from '../EmbedViewer/EmbedViewer'
import { QUERY as IdeQuery } from 'src/components/IdeProjectCell'

export const QUERY = IdeQuery
export interface Project {
  id: string
  title: string
  code: string
  description: string
  mainImage: string
  createdAt: string
  cadPackage: 'openscad' | 'cadquery'
  user: {
    id: string
    userName: string
    image: string
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Project not found</div>

interface SaveCodeArgs {
  input: any
  id: string
  isFork: boolean
}

export const Success = ({
  project,
  refetch,
}: {
  project: Project
  refetch: any
}) => {
  const [state, thunkDispatch] = useIdeState()

  return (
    <IdeContext.Provider value={{ state, thunkDispatch, project }}>
      <EmbedViewer project={project} />
    </IdeContext.Provider>
  )
}
