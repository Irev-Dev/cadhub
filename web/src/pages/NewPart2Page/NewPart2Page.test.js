import { render } from '@redwoodjs/testing'

import NewPart2Page from './NewPart2Page'

describe('NewPart2Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewPart2Page />)
    }).not.toThrow()
  })
})
