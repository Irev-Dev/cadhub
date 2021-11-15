import { Loading, Empty, Success } from './EmbedProjectCell'
import { standard } from './EmbedProjectCell.mock'

export const loading = () => {
  return Loading ? <Loading /> : null
}

export const empty = () => {
  return Empty ? <Empty /> : null
}

export const success = () => {
  return Success ? <Success {...standard()} /> : null
}

export default { title: 'Cells/EmbedProjectCell' }
