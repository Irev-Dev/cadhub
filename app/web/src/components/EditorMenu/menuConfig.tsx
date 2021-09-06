import React from 'react'
import Svg from 'src/components/Svg/Svg'


export const fileMenuConfig = [
    {
        label: 'Cook Donut',
        shortcut: 'ctrl+d, command+d',
        shortcutLabel: <><CmdOrCtrl/> D</>,
        callback: () => alert('Donut is cooked!'),
    }
]

export const viewMenuConfig = [
    {
        label: 'Reset layout',
        shortcut: 'ctrl+alt+r, command+alt+r',
        shortcutLabel: <><CmdOrCtrl/> Alt R</>,
        callback: () => alert('Resetting the layout!'),
    }
]

export const editorMenuConfig = [
    {
        name: 'file',
        label: 'File',
        disabled: false,
        items: fileMenuConfig,
    },
    {
        name: 'edit',
        label: 'Edit',
        disabled: true,
        items: [],
    },
    {
        name: 'view',
        label: 'View',
        disabled: false,
        items: viewMenuConfig,
    },

]

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
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? (
        <Svg
        name="mac-cmd-key"
        className="h-3 w-3 inline-block text-left"
        />
      ) : (
        <span>'Ctrl'</span>
      )
}