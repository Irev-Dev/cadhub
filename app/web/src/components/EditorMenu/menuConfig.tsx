import React from 'react'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { makeStlDownloadHandler, PullTitleFromFirstLine } from './helpers'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import { DropdownItem } from './Dropdowns'

export function cmdOrCtrl() {
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl'
}

const fileMenuConfig = {
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
            }
        },
        {
            label: 'Cook Donut',
            shortcut: 'ctrl+d, command+d',
            shortcutLabel: cmdOrCtrl() + ' D',
            component: (props) => {
                const { config } = props
                config.callback = () => alert('Donut is cooked!')
                return <DropdownItem {...props} />
            }
        }
    ]
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
            shortcut: 'ctrl+alt+r, command+alt+r',
            shortcutLabel: cmdOrCtrl() + ' Alt R',
            component: (props) => {
                const { config, thunkDispatch } = props
                config.callback = () => thunkDispatch({ type: 'resetLayout' })
                return <DropdownItem {...props } />
            }
        },
    ],
}

export const editorMenuConfig = [
    fileMenuConfig,
    editMenuConfig,
    viewMenuConfig,
]

// TODO: set up these types properly. The callback is especially giving me trouble.
export interface EditorMenuItemConfig {
    label: string,
    shortcut: string,
    shortcutLabel: React.ReactNode | string,
    callback: any, // I don't understand how to make this a more specific type
}

export interface EditorMenuConfig {
    name: string,
    label: string,
    disabled: boolean,
    items: Array<EditorMenuItemConfig>,
}