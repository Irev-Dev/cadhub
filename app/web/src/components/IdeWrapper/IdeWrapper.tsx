import { useState } from 'react'
import IdeContainer from 'src/components/IdeContainer/IdeContainer'
import { useRender } from './useRender'
import IdeSideBar from 'src/components/IdeSideBar/IdeSideBar'
import TopNav from 'src/components/TopNav/TopNav'
import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import { ShortcutsModalContext } from 'src/components/EditorMenu/AllShortcutsModal'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import type { CadPackageType } from 'src/components/CadPackage/CadPackage'

interface Props {
  cadPackage: CadPackageType
}

const IdeWrapper = ({ cadPackage }: Props) => {
  const { state, project } = useIdeContext()
  const handleRender = useRender()
  const saveCode = useSaveCode()
  const onRender = () => {
    handleRender()
    saveCode({ code: state.code })
  }
  useIdeInit(cadPackage, project?.code || state?.code)
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false)
  const shortcutModalContextValues = {
    open: shortcutModalOpen,
    toggleOpen: () => setShortcutModalOpen(!shortcutModalOpen),
  }

  return (
    <div className="h-full flex flex-col">
      <ShortcutsModalContext.Provider value={shortcutModalContextValues}>
        <nav className="flex">
          <TopNav>
            <IdeHeader handleRender={onRender} context="ide" />
          </TopNav>
        </nav>
        <div className="h-full flex flex-grow bg-ch-gray-900">
          <div className="flex-shrink-0">
            <IdeSideBar />
          </div>
          <div className="h-full flex flex-grow">
            <IdeContainer />
          </div>
        </div>
      </ShortcutsModalContext.Provider>
    </div>
  )
}

export default IdeWrapper
