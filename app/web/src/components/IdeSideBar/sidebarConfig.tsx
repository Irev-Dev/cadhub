import { ReactFragment, ReactNode, useEffect, useReducer, useState } from 'react'
import { SvgNames } from 'src/components/Svg/Svg'

interface SidebarConfigType {
    name: string,
    icon: SvgNames,
    disabled: boolean,
    panel: ReactFragment | null,
}

export const sidebarTopConfig : SidebarConfigType[] = [
    {
        name: 'Files',
        icon: 'files',
        disabled: false,
        panel: <article className="px-2 py-4">
            <p><em>Coming Soon</em></p>
            <hr className="my-4"/>
            <p>
                We're working on multi-file support in tandem with the GitHub integration.
            </p>
        </article>,
    },
    {
        name: 'GitHub',
        icon: 'github',
        disabled: false,
        panel: <article className="px-2 py-4">
            <p><em>Coming Soon</em></p>
            <hr className="my-4"/>
            <p>
                This integration will allow you to sync a project with a GitHub repo and push changes back to it as a commit!
            </p>
        </article>,
    },
    {
        name: 'Visibility',
        icon: 'eye',
        disabled: true,
        panel: null,
    },
]

const settingsConfig = [
    {
        title: "Editor",
        name: "editor",
        open: false,
        content: <p className="p-2">This text will go in a details element!</p>,
    },
    {
        title: "Viewer",
        name: "viewer",
        open: false,
        content: <p className="p-2">This text will go in a details element!</p>
    },
    {
        title: "Console",
        name: "console",
        open: false,
        content: <p className="p-2">This text will go in a details element!</p>
    },
]

export const sidebarBottomConfig : SidebarConfigType[] = [
    {
        name: 'Settings',
        icon: 'gear',
        disabled: false,
        panel: <article className="">
        { settingsConfig.map(item => (
            <details key={'settings-tray-'+item.name}>
                <summary className="px-2 py-1 bg-ch-pink-800 bg-opacity-20 my-px">{ item.title }</summary>
                { item.content }
            </details>
        ))}
        </article>,
    },
]

export const sidebarCombinedConfig = [
    ...sidebarTopConfig,
    ...sidebarBottomConfig,
]

function SettingsMenu() {
    console.log('hello?', settingsConfig)
    return (
        <article className="px-2 py-4">
        { settingsConfig.map(item => (
            <details key={'settings-tray-'+item.name}>
                <summary>{ item.title }</summary>
                { item.content }
            </details>
        ))}
        </article>
    )
}