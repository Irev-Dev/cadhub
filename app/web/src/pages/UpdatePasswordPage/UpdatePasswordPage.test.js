import { render } from '@redwoodjs/testing'

import UpdatePasswordPage from './UpdatePasswordPage'

describe('UpdatePasswordPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UpdatePasswordPage />)
    }).not.toThrow()
  })
})
