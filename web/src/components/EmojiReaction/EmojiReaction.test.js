import { render } from '@redwoodjs/testing'

import EmojiReaction from './EmojiReaction'

describe('EmojiReaction', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EmojiReaction />)
    }).not.toThrow()
  })
})
