import { render } from '@redwoodjs/testing'

import LoginModal from './LoginModal'

describe('LoginModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoginModal />)
    }).not.toThrow()
  })
})
