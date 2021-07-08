import { useState } from 'react'
import { getActiveClasses } from 'get-active-classes'
import Popover from '@material-ui/core/Popover'
import { useAuth } from '@redwoodjs/auth'

import Svg from 'src/components/Svg/Svg'

const emojiMenu = ['❤️', '👍', '😄', '🙌']
// const emojiMenu = ['🏆', '❤️', '👍', '😊', '😄', '🚀', '👏', '🙌']
const noEmotes = [
  {
    emoji: '❤️',
    count: 0,
  },
]

const textShadow = { textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }

const EmojiReaction = ({
  emotes,
  userEmotes,
  onEmote = () => {},
  onShowProjectReactions,
  className,
}) => {
  const { currentUser } = useAuth()
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
    // TODO handle user not signed in better, maybe open up a modal, I danno think about it.
    currentUser && onEmote(emoji)
    closePopover()
  }

  return (
    <>
      <div
        className={getActiveClasses('relative overflow-hidden pt-1', className)}
      >
        <div className="z-10 flex items-center gap-4 h-10">
          <div
            className="h-full w-10"
            aria-describedby={popoverId}
            onClick={togglePopover}
          >
            <button className="bg-ch-gray-600 w-full h-full flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-150 rounded">
              <Svg className="w-8 text-ch-gray-300" name="dots-vertical" />
            </button>
          </div>
          {(emotes.length ? emotes : noEmotes).map((emote, i) => (
            <span
              className={getActiveClasses(
                'tracking-wide border border-transparent hover:border-ch-gray-300 h-full p-1 px-4 transform hover:-translate-y-px transition-all duration-150 flex items-center rounded',
                {
                  'bg-ch-gray-500 text-ch-gray-900':
                    currentUser && userEmotes?.includes(emote.emoji),
                  'bg-ch-gray-600': !(
                    currentUser && userEmotes?.includes(emote.emoji)
                  ),
                }
              )}
              style={textShadow}
              key={`${emote.emoji}--${i}`}
              onClick={() => handleEmojiClick(emote.emoji)}
            >
              <span className="text-lg pr-2">{emote.emoji}</span>
              <span className="text-sm font-fira-code">{emote.count}</span>
            </span>
          ))}
        </div>

        <div className="whitespace-nowrap flex items-center flex-row-reverse"></div>
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
        <div className="p-2 pr-3 flex flex-col">
          <div className="inline-flex">
            {emojiMenu.map((emoji, i) => (
              <button
                className="p-2"
                style={textShadow}
                key={`${emoji}-${i}}`}
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button className="text-gray-700" onClick={onShowProjectReactions}>
            View Reactions
          </button>
        </div>
      </Popover>
    </>
  )
}

export default EmojiReaction
