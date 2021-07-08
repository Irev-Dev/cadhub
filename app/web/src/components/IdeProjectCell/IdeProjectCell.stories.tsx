import { Loading, Empty, Success } from './IdeProjectCell'
import { standard } from './IdeProjectCell.mock'

export const loading = () => {
  return Loading ? <Loading /> : null
}

export const empty = () => {
  return Empty ? <Empty /> : null
}

export const success = () => {
  return Success ? <Success {...standard()} /> : null
}

export default { title: 'Cells/IdeProjectCell' }
