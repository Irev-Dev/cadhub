import { render } from '@redwoodjs/testing'

import BlogPostPage from './BlogPostPage'

describe('BlogPostPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BlogPostPage />)
    }).not.toThrow()
  })
})
