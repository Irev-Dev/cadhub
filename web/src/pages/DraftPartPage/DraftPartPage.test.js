import { render } from '@redwoodjs/testing'

import DraftPartPage from './DraftPartPage'

describe('DraftPartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DraftPartPage />)
    }).not.toThrow()
  })
})
