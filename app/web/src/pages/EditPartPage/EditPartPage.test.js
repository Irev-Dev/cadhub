import { render } from '@redwoodjs/testing'

import EditPartPage from './EditPartPage'

describe('EditPartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditPartPage />)
    }).not.toThrow()
  })
})
