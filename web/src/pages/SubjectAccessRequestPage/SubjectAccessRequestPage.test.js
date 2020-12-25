import { render } from '@redwoodjs/testing'

import SubjectAccessRequestPage from './SubjectAccessRequestPage'

describe('SubjectAccessRequestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SubjectAccessRequestPage />)
    }).not.toThrow()
  })
})
