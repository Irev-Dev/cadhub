import { render } from '@redwoodjs/testing'

import EditPart2Page from './EditPart2Page'

describe('EditPart2Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditPart2Page />)
    }).not.toThrow()
  })
})
