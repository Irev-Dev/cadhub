import { render } from '@redwoodjs/testing'

import EmbedProjectPage from './EmbedProjectPage'

describe('EmbedProjectPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EmbedProjectPage />)
    }).not.toThrow()
  })
})
