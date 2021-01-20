import { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

export const QUERY = gql`
  query FIND_PART_BY_USERNAME_TITLE(
    $userName: String!
    $partTitle: String
    $currentUserId: String
  ) {
    userPart: userName(userName: $userName) {
      id
      name
      userName
      bio
      image
      Part(partTitle: $partTitle) {
        id
        title
        description
        code
        mainImage
        createdAt
        updatedAt
        userId
        Reaction {
          emote
          user {
            userName
            image
          }
        }
        userReactions: Reaction(userId: $currentUserId) {
          emote
        }
        Comment {
          id
          text
          user {
            userName
            image
          }
        }
      }
    }
  }
`

const emojiMenu = ['all', '❤️', '👍', '😄', '🙌']

const ReactionList = ({}) => {
  return (
    <Dialog open={true}>
      <Tabs
        value={1}
        onChange={() => {}}
        variant="scrollable"
        scrollButtons="off"
        textColor="primary"
        indicatorColor="primary"
      >
        {emojiMenu.map((emoji, i) => (
          <Tab label={emoji} key={`${emoji}-${i}}`} style={{ minWidth: 100 }} />
        ))}
      </Tabs>
      <section>List</section>
    </Dialog>
  )
}

export default ReactionList
