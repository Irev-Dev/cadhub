import { render } from '@redwoodjs/testing'

import Breadcrumb from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Breadcrumb />)
    }).not.toThrow()
  })
})
