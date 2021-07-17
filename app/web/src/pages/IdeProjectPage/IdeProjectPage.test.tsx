import { render } from '@redwoodjs/testing'

import IdeProjectPage from './IdeProjectPage'

describe('IdeProjectPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IdeProjectPage />)
    }).not.toThrow()
  })
})
