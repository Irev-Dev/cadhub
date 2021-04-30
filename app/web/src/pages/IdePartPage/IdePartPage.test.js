import { render } from '@redwoodjs/testing'

import IdePartPage from './IdePartPage'

describe('IdePartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IdePartPage />)
    }).not.toThrow()
  })
})
