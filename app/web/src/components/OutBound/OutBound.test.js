import { render } from '@redwoodjs/testing'

import OutBound from './OutBound'

describe('OutBound', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OutBound />)
    }).not.toThrow()
  })
})
