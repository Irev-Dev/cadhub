import { render } from '@redwoodjs/testing'

import Part2Page from './Part2Page'

describe('Part2Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Part2Page />)
    }).not.toThrow()
  })
})
