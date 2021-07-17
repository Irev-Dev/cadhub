import { render } from '@redwoodjs/testing'

import ProjectPage from './ProjectPage'

describe('ProjectPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProjectPage />)
    }).not.toThrow()
  })
})
