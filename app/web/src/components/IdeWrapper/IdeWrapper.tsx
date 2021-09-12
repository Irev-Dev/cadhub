import { useEffect, useState } from 'react'
import IdeContainer from 'src/components/IdeContainer/IdeContainer'
import { useRender } from './useRender'
import OutBound from 'src/components/OutBound/OutBound'
import IdeSideBar from 'src/components/IdeSideBar/IdeSideBar'
import IdeHeader from 'src/components/IdeHeader/IdeHeader'
import Svg from 'src/components/Svg/Svg'
import { useIdeInit } from 'src/components/EncodedUrl/helpers'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import { ShortcutsModalContext } from 'src/components/EditorMenu/AllShortcutsModal'

interface Props {
  cadPackage: string
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
          <IdeHeader handleRender={onRender} />
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
