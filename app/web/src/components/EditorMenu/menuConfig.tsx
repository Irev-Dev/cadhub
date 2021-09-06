import React from 'react'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { useRender } from 'src/components/IdeWrapper/useRender'
import { makeStlDownloadHandler, PullTitleFromFirstLine } from './helpers'
import { useSaveCode } from 'src/components/IdeWrapper/useSaveCode'
import Svg from 'src/components/Svg/Svg'


const fileMenuConfig = {
    name: 'file',
    label: 'File',
    disabled: false,
    items: [
        {
            label: 'Save & Render',
            shortcut: 'ctrl+s, command+s',
            shortcutLabel: <><CmdOrCtrl/> S</>,
            // This is my main issue. How do I pass in a callback that relies on the hooks and state within the component?
            // Put another way, how do I make the state and hooks used within a component configurable from outside the component itself?
            callback: (e, /* { options } */) => {
                // These do not work
                // const handleRender = useRender()
                // const saveCode = useSaveCode()
                // handleRender()
                // saveCode({ code: state.code })
                e.preventDefault()
                alert('Saving & Rendering!')
            },
        },
        {
            label: 'Download STL',
            shortcut: 'ctrl+shift+d, command+shift+d',
            shortcutLabel: <><CmdOrCtrl/> Shift D</>,
            callback: () => alert('Downloading STL!'),
        },
        {
            label: 'Cook Donut',
            shortcut: 'ctrl+d, command+d',
            shortcutLabel: <><CmdOrCtrl/> D</>,
            callback: () => alert('Donut is cooked!'),
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
            shortcutLabel: <><CmdOrCtrl/> Alt R</>,
            callback: () => alert('Resetting the layout!'),
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

function CmdOrCtrl() {
    return <span> { /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl' }</span>
}