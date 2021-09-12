import React, { ReactNode } from 'react'
import { SvgNames } from 'src/components/Svg/Svg'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'

interface SidebarConfigType {
    name: string,
    icon: SvgNames,
    disabled: boolean,
    panel: ReactNode | null,
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
        panel: <SettingsMenu parentName="Settings"/>,
    },
]

export const sidebarCombinedConfig = [
    ...sidebarTopConfig,
    ...sidebarBottomConfig,
]

function SettingsMenu({parentName}: {parentName: string}) {
    const { state, thunkDispatch } = useIdeContext()
    return (
        <article className="">
        { settingsConfig.map(item => (
            <li className="list-none" key={'settings-tray-'+item.name}>
                <button className="px-2 py-2 bg-ch-pink-800 bg-opacity-10 my-px" onClick={() => {
                  console.log('i was clicked')
                  thunkDispatch((dispatch) => dispatch({type: 'settingsButtonClicked', payload:[parentName, item.name]}))
                }} >{ item.title }</button>
                { state.sideTray.slice(-1)[0] === item.name && item.content }
            </li>
            // <details key={'settings-tray-'+item.name} open={state.sideTray.slice(-1)[0] === item.name}>
            //     <summary className="px-2 py-2 bg-ch-pink-800 bg-opacity-10 my-px"
            //       onClick={() => thunkDispatch((dispatch) => dispatch({type: 'settingsButtonClicked', payload:[parentName, item.name]}))}
            //     >{ item.title }hi there</summary>
            //     { state.sideTray.slice(-1)[0] === item.name && item.content }
            //     {state.sideTray.slice(-1)[0]}
            // </details>
        ))}
        </article>
    )
}
