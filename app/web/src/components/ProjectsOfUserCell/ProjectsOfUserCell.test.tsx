import { render, screen } from '@redwoodjs/testing'
import { Loading, Empty, Success } from './ProjectsOfUserCell'
import { standard } from './ProjectsOfUserCell.mock'

describe('ProjectsOfUserCell', () => {
  test('Loading renders successfully', () => {
    render(<Loading />)
    // Use screen.debug() to see output
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  test('Success renders successfully', async () => {
    render(<Success projectsOfUser={standard().projectsOfUser} />)
    expect(screen.getByText(/42/i)).toBeInTheDocument()
  })
})
