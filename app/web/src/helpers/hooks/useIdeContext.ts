import { IdeContext } from 'src/pages/DevIdePage/DevIdePage'
import { useContext } from 'react'

export function useIdeContext() {
  return useContext(IdeContext)
}

export const ideTypeNameMap = {
  openScad: 'OpenSCAD',
  cadQuery: 'CadQuery',
}
