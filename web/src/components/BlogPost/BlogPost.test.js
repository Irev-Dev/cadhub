import { render } from '@redwoodjs/testing'

import BlogPost from './BlogPost'

describe('BlogPost', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BlogPost />)
    }).not.toThrow()
  })
})
