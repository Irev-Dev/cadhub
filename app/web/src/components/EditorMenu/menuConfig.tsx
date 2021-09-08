import React from 'react'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { makeStlDownloadHandler, PullTitleFromFirstLine } from './helpers'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import { DropdownItem } from './Dropdowns'

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
      component: (props) => {
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
      component: (props) => {
        const { state, thunkDispatch, config } = props
        const handleStlDownload = makeStlDownloadHandler({
          type: state.objectData?.type,
          ideType: state.ideType,
          geometry: state.objectData?.data,
          quality: state.objectData?.quality,
          fileName: PullTitleFromFirstLine(state.code || ''),
          thunkDispatch,
        })

        config.callback = handleStlDownload

        return <DropdownItem {...props} />
      },
    },
  ],
}

const editMenuConfig = {
  name: 'edit',
  label: 'Edit',
  disabled: true,
  items: [],
}

const viewMenuConfig = {
  name: 'view',
  label: 'View',
  disabled: false,
  items: [
    {
      label: 'Reset layout',
      shortcut: 'ctrl+shift+r',
      shortcutLabel: 'Ctrl Shift R',
      component: (props) => {
        const { config, thunkDispatch } = props
        config.callback = () => thunkDispatch({ type: 'resetLayout' })
        return <DropdownItem {...props} />
      },
    },
    {
      label: 'All shortcuts',
      shortcut: 'ctrl+shift+/',
      shortcutLabel: 'Ctrl Shift /',
      component: (props) => {
        const { config } = props
        const [open, setOpen] = useShortcutModalContext()
        config.callback = () => setOpen(true)
        return <DropdownItem {...props} />
      },
    },
  ],
}

export const editorMenuConfig = [fileMenuConfig, editMenuConfig, viewMenuConfig]

export interface EditorMenuItemConfig {
  label: string
  shortcut: string
  shortcutLabel: React.ReactElement | string
  component: (props: any) => React.ReactElement
}

export interface EditorMenuConfig {
  name: string
  label: string
  disabled: boolean
  items: Array<EditorMenuItemConfig>
}
