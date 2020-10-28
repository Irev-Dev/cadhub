import { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Svg from 'src/components/Svg'

const emojiMenu = ['🏆', '❤️', '👍', '😊', '😄', '🚀', '👏', '🙌']

const EmojiReaction = ({ emotes, callback = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverId, setPopoverId] = useState(undefined)

  const openPopover = (target) => {
    setAnchorEl(target)
    setPopoverId('simple-popover')
    setIsOpen(true)
  }

  const closePopover = () => {
    setAnchorEl(null)
    setPopoverId(undefined)
    setIsOpen(false)
  }

  const togglePopover = ({ currentTarget }) => {
    if (isOpen) {
      return closePopover()
    }

    openPopover(currentTarget)
  }

  const handleEmojiClick = (emoji) => {
    callback(emoji)
    closePopover()
  }

  return [
    <div className="flex justify-between">
        <Fab size="medium" variant="round" aria-describedby={popoverId} onClick={togglePopover}>
          <div className="bg-gray-200 border-2 m-px border-gray-300 text-gray-500 absolute inset-0 rounded-full flex justify-center items-center">
            <Svg name="dots-vertical" />
          </div>
        </Fab>

      <div>
        {emotes.map((emote, i) => (
          <IconButton key={`${emote.emoji}--${i}`} onClick={() => handleEmojiClick(emote.emoji)}>
            {emote.emoji} <span>{emote.count}</span>
          </IconButton>
        ))}
      </div>
    </div>,
    <Popover
      id={popoverId}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {emojiMenu.map((emoji, i) => (
        <IconButton key={`${emoji}-${i}}`} onClick={() => handleEmojiClick(emoji)}>{emoji}</IconButton>
      ))}
    </Popover>,
  ]
}

export default EmojiReaction
