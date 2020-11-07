import { useState } from 'react'
import { getActiveClasses } from "get-active-classes"
import Popover from '@material-ui/core/Popover'

import Svg from 'src/components/Svg'

const emojiMenu = ['❤️', '👍', '😄', '🙌']
// const emojiMenu = ['🏆', '❤️', '👍', '😊', '😄', '🚀', '👏', '🙌']
const noEmotes =[{
  emoji: '❤️',
  count: 0,
}]

const textShadow = {textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'}

const EmojiReaction = ({ emotes, onEmote = () => {}, className }) => {
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
    onEmote(emoji)
    closePopover()
  }

  return (
    <>
      <div className={getActiveClasses("h-10 relative overflow-hidden py-4", className)}>
          <div className="absolute left-0 w-8 inset-y-0 z-10 flex items-center bg-gray-100">
            <div className="h-8 w-8 relative" aria-describedby={popoverId} onClick={togglePopover}>
              <button
                className="bg-gray-200 border-2 m-px w-full h-full border-gray-300 rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:border-indigo-200 transform hover:-translate-y-px transition-all duration-150"
              >
                <Svg className="h-8 w-8 pt-px mt-px text-gray-500" name="dots-vertical" />
              </button>
            </div>
          </div>

        <div className="whitespace-no-wrap absolute right-0 inset-y-0 flex items-center flex-row-reverse">
          {(emotes.length ? emotes : noEmotes).map((emote, i) => (
            <span
              className="rounded-full tracking-wide hover:bg-indigo-100 p-1 mx-px transform hover:-translate-y-px transition-all duration-150"
              style={textShadow}
              key={`${emote.emoji}--${i}`}
              onClick={() => handleEmojiClick(emote.emoji)}
            >
              <span className="text-lg pr-1">{emote.emoji}</span><span className="text-sm font-ropa-sans">{emote.count}</span>
            </span>
          ))}
        </div>
      </div>
      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="py-2 mt-2">
          {emojiMenu.map((emoji, i) => (
            <button
              className="p-2"
              style={textShadow}
              key={`${emoji}-${i}}`}
              onClick={() => handleEmojiClick(emoji)}
            >{emoji}</button>
          ))}
        </div>
      </Popover>
    </>
  )
}

export default EmojiReaction
