import { useState } from 'react'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { Link, routes } from '@redwoodjs/router'
import { countEmotes } from 'src/helpers/emote'
import ImageUploader from 'src/components/ImageUploader'

const PartReactions = ({ reactions }) => {
  const emotes = countEmotes(reactions)
  const [tab, setTab] = useState(0)
  const onTabChange = (_, newValue) => {
    setTab(newValue)
  }

  return (
    <>
      <div className="bg-gray-100 p-4 min-h-md rounded-lg shadow-lg">
        <Tabs
          value={tab}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="off"
          textColor="primary"
          indicatorColor="primary"
        >
          {emotes.map((emote, i) => (
            <Tab
              label={`${emote.emoji} ${emote.count}`}
              key={`${emote.emoji}-${i}}`}
              style={{ minWidth: 100 }}
            />
          ))}
        </Tabs>
        <ul>
          {reactions
            .filter((reaction) => reaction.emote === emotes[tab].emoji)
            .map((reactionPart, i) => (
              <li
                className="flex flex-row p-2 items-center"
                key={`${reactionPart.emote}-${i}}`}
              >
                <div className="w-8 h-8 overflow-hidden rounded-full border border-indigo-300 shadow flex-shrink-0">
                  <ImageUploader
                    className=""
                    aspectRatio={1}
                    imageUrl={reactionPart.user?.image}
                    width={50}
                  />
                </div>
                <div className="ml-4 font-roboto">
                  <div className="text-gray-800 font-bold text-md mb-1">
                    <Link
                      to={routes.user({
                        userName: reactionPart.user?.userName,
                      })}
                    >
                      {reactionPart.user?.userName}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default PartReactions
