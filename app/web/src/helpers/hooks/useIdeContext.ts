import { createContext, useContext } from 'react'
import { State, initialState } from 'src/helpers/hooks/useIdeState'
import type { Project } from 'src/components/IdeProjectCell/IdeProjectCell'

interface IdeContextType {
  state: State
  thunkDispatch: (actionOrThunk: any) => any
  project: null | Project
}

export const IdeContext = createContext<IdeContextType>({
  state: initialState,
  thunkDispatch: () => {},
  project: null,
})

export function useIdeContext() {
  return useContext(IdeContext)
}
