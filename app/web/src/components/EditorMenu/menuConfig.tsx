import React from 'react'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { makeStlDownloadHandler, PullTitleFromFirstLine } from 'src/helpers/download_stl'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import { DropdownItem } from './Dropdowns'
import { useShortcutsModalContext } from './AllShortcutsModal'
import type { State } from 'src/helpers/hooks/useIdeState'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

export function cmdOrCtrl() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl'
}

const fileMenuConfig: EditorMenuConfig = {
  name: 'file',
  label: 'File',
  disabled: false,
  items: [
    {
      label: 'Save & Render',
      shortcut: 'ctrl+s, command+s',
      shortcutLabel: cmdOrCtrl() + ' S',
      Component: (props) => {
        const { state, config } = props
        const handleRender = useRender()
        const saveCode = useSaveCode()
        function onRender(e) {
          e.preventDefault()
          handleRender()
          saveCode({ code: state.code })
        }

        config.callback = onRender

        return <DropdownItem {...props} />
      },
    },
    {
      label: 'Download STL',
      shortcut: 'ctrl+shift+d, command+shift+d',
      shortcutLabel: cmdOrCtrl() + ' Shift D',
      Component: (props) => {
        const { state, thunkDispatch, config } = props
        const { project } = useIdeContext()
        const handleStlDownload = makeStlDownloadHandler({
          type: state.objectData?.type,
          ideType: state.ideType,
          geometry: state.objectData?.data,
          quality: state.objectData?.quality,
          fileName: project
            ? `${project.title}.stl`
            : PullTitleFromFirstLine(state.code || ''),
          thunkDispatch,
        })

        config.callback = handleStlDownload

        return <DropdownItem {...props} />
      },
    },
  ],
}

const editMenuConfig: EditorMenuConfig = {
  name: 'edit',
  label: 'Edit',
  disabled: true,
  items: [],
}

const viewMenuConfig: EditorMenuConfig = {
  name: 'view',
  label: 'View',
  disabled: false,
  items: [
    {
      label: 'Reset layout',
      shortcut: 'ctrl+shift+r',
      shortcutLabel: 'Ctrl Shift R',
      Component: (props) => {
        const { config, thunkDispatch } = props
        config.callback = () => thunkDispatch({ type: 'resetLayout' })
        return <DropdownItem {...props} />
      },
    },
    {
      label: 'All shortcuts',
      shortcut: 'ctrl+shift+/',
      shortcutLabel: 'Ctrl Shift /',
      Component: (props) => {
        const { config } = props
        const { toggleOpen } = useShortcutsModalContext()
        config.callback = toggleOpen
        return <DropdownItem {...props} />
      },
    },
  ],
}

export const editorMenuConfig = [fileMenuConfig, editMenuConfig, viewMenuConfig]

interface EditorMenuItemConfigBase {
  label: string
  shortcut: string
  shortcutLabel: React.ReactElement | string
  callback?: (...a: any[]) => void
}
export interface EditorMenuItemConfig extends EditorMenuItemConfigBase {
  Component: React.FC<{
    config: EditorMenuItemConfigBase
    state: State
    thunkDispatch: any
  }>
}

export interface EditorMenuConfig {
  name: string
  label: string
  disabled: boolean
  items: Array<EditorMenuItemConfig>
}
