import { render } from '@redwoodjs/testing'

import DraftProjectPage from './DraftProjectPage'

describe('DraftProjectPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DraftProjectPage />)
    }).not.toThrow()
  })
})
