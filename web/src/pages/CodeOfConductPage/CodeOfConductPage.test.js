import { render } from '@redwoodjs/testing'

import CodeOfConductPage from './CodeOfConductPage'

describe('CodeOfConductPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CodeOfConductPage />)
    }).not.toThrow()
  })
})
