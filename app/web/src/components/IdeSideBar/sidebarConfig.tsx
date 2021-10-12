import { ReactNode } from 'react'
import { SvgNames } from 'src/components/Svg/Svg'
import { useIdeContext } from 'src/helpers/hooks/useIdeContext'
import { createRemoveUpdate, updateTree } from 'react-mosaic-component'
import type { MosaicPath } from 'react-mosaic-component'
import Toggle from 'src/components/Toggle'

interface SidebarConfigType {
  name: string
  icon: SvgNames
  disabled: boolean
  panel: ReactNode | null
}

interface MosaicTree {
  first: string | MosaicTree
  second: string | MosaicTree
}

const getPathById = (
  tree: MosaicTree,
  id: string,
  path: MosaicPath = []
): MosaicPath => {
  if (tree.first === id || tree.second === id) {
    return [...path, tree.first === id ? 'first' : 'second']
  }
  if (typeof tree.first !== 'string' && typeof tree.second !== 'string') {
    throw new Error('id not found')
  }
  try {
    if (typeof tree.first !== 'string') {
      return getPathById(tree.first, id, [...path, 'first'])
    }
  } catch (error) {
    throw new Error('id not found')
  }
  try {
    if (typeof tree.second !== 'string') {
      return getPathById(tree.second, id, [...path, 'second'])
    }
  } catch (error) {
    throw new Error('id not found')
  }
  throw new Error('id not found')
}

export const sidebarTopConfig: SidebarConfigType[] = [
  {
    name: 'Files',
    icon: 'files',
    disabled: false,
    panel: (
      <article className="px-2 py-4">
        <p>
          <em>Coming Soon</em>
        </p>
        <hr className="my-4" />
        <p>
          We're working on multi-file support in tandem with the GitHub
          integration.
        </p>
      </article>
    ),
  },
  {
    name: 'GitHub',
    icon: 'github',
    disabled: false,
    panel: (
      <article className="px-2 py-4">
        <p>
          <em>Coming Soon</em>
        </p>
        <hr className="my-4" />
        <p>
          This integration will allow you to sync a project with a GitHub repo
          and push changes back to it as a commit!
        </p>
      </article>
    ),
  },
  {
    name: 'Visibility',
    icon: 'eye',
    disabled: true,
    panel: null,
  },
]

const DiscordLink = () => (
  <a
    className="underline text-ch-pink-300"
    href="https://discord.gg/SD7zFRNjGH"
    target="_blank"
    rel="noreferrer"
  >
    Discord
  </a>
)

interface settingsConfig {
  title: string
  name: string
  Content: React.FC
}

const settingsConfig: settingsConfig[] = [
  {
    title: 'Editor',
    name: 'editor',
    Content: () => (
      <div className="p-2">
        <p>
          <em>Coming Soon</em>
        </p>
        <hr className="my-2" />
        <p className="p-2">
          We're building configuration settings for the Viewer pane now. Join us
          on <DiscordLink /> if you want to lend a hand!
        </p>
      </div>
    ),
  },
  {
    title: 'Viewer',
    name: 'viewer',
    Content: () => (
      <div className="p-2">
        <p>
          <em>Coming Soon</em>
        </p>
        <hr className="my-2" />
        <p className="p-2">
          We're building configuration settings for the Viewer pane now. Join us
          on <DiscordLink /> if you want to lend a hand!
        </p>
      </div>
    ),
  },
  {
    title: 'Console',
    name: 'console',
    Content: () => {
      const { state, thunkDispatch } = useIdeContext()
      const consolePath = React.useMemo<MosaicPath | null>(() => {
        try {
          const path = getPathById(state.layout, 'Console')
          return path
        } catch (error) {
          return null
        }
      }, [state.layout])
      return (
        <div className="p-2">
          <li className="list-none select-none">
            <label
              className="grid items-center my-2 cursor-pointer"
              style={{ gridTemplateColumns: '1fr auto' }}
            >
              <span>Visible</span>
              <Toggle
                offLabel="Hide"
                onLabel="Show"
                onChange={(newValue) => {
                  if (consolePath) {
                    const newTree = updateTree(state.layout, [
                      createRemoveUpdate(state.layout, consolePath),
                    ])
                    thunkDispatch({ type: 'setLayout', payload: newTree })
                  } else {
                    // Split 'Viewer' panel to add console back in
                    const viewerPath = getPathById(state.layout, 'Viewer')
                    const newTree = { ...state.layout }
                    let temp = newTree
                    viewerPath.forEach((name) => {
                      if (newTree[name] === 'Viewer') {
                        newTree[name] = {
                          direction: 'column',
                          first: 'Viewer',
                          second: 'Console',
                          splitPercentage: 70,
                        }
                        return
                      }
                      temp = { ...newTree[name] }
                    })
                    thunkDispatch({ type: 'setLayout', payload: newTree })
                  }
                }}
                checked={!!consolePath}
              />
            </label>
          </li>
        </div>
      )
    },
  },
]

export const sidebarBottomConfig: SidebarConfigType[] = [
  {
    name: 'Settings',
    icon: 'gear',
    disabled: false,
    panel: <SettingsMenu parentName="Settings" />,
  },
]

export const sidebarCombinedConfig = [
  ...sidebarTopConfig,
  ...sidebarBottomConfig,
]

function SettingsMenu({ parentName }: { parentName: string }) {
  const { state, thunkDispatch } = useIdeContext()
  return (
    <article className="">
      {settingsConfig.map(({ name, title, Content }) => (
        <details
          key={'settings-tray-' + name}
          open={state.sideTray.slice(-1)[0] === name}
        >
          <summary
            className="px-2 py-2 bg-ch-pink-800 bg-opacity-10 my-px cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              thunkDispatch((dispatch) =>
                dispatch({
                  type: 'settingsButtonClicked',
                  payload: [parentName, name],
                })
              )
            }}
          >
            {title}
          </summary>
          <Content />
        </details>
      ))}
    </article>
  )
}
