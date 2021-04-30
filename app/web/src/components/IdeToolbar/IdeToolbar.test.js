import { render } from '@redwoodjs/testing'

import IdeToolbar from './IdeToolbar'

describe('IdeToolbar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IdeToolbar />)
    }).not.toThrow()
  })
})
