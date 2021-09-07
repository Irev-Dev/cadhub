import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook';
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import { editorMenuConfig } from './menuConfig';

const SHORTCUT = 'ctrl+/, command+/'

const useStyles = makeStyles({
  root: {
    transform: `translate3d(0,0,50px)`,
  },
})

const AllShortcutsModal = () => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    useHotkeys(SHORTCUT, () => setOpen(!open), [open])

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className={classes.root}>
        <div className="bg-ch-gray-700 font-fira-sans max-w-7xl rounded shadow-lg text-ch-gray-300 p-4">
            <h2 className="text-2xl mb-4">All Shortcuts</h2>
        { editorMenuConfig.filter(menu => menu.items.length).map(menu =>
            <section key={"allshortcuts-"+menu.name}
            className="my-6">
                <h3 className="text-xl border-b-2 pb-2 mb-2">{ menu.label }</h3>
            { menu.items.map(item => (
                <div className="flex gap-8 justify-between" key={"allshortcuts-"+menu.name+"-"+item.label}>
                    <p>{ item.label }</p>
                    <span className="text-right font-fira-code text-ch-gray-400">{ item.shortcutLabel }</span>
                </div>
            ))}
            </section>
        )}
        </div>
        </Dialog>
    )
    }


    export default AllShortcutsModal
