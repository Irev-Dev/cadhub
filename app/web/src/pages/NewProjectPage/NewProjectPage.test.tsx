import { render } from '@redwoodjs/testing'

import NewProjectPage from './NewProjectPage'

describe('NewProjectPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewProjectPage />)
    }).not.toThrow()
  })
})
