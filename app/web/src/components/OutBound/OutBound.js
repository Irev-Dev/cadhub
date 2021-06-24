import ReactGA from 'react-ga'

const OutBound = ({ className, children, to }) => {
  return (
    <a
      className={className}
      target="_blank"
      href={to}
      onClick={() => {
        ReactGA.event({
          category: 'outbound',
          action: to,
        })
        return true
      }}
      rel="noreferrer"
    >
      {children}
    </a>
  )
}

export default OutBound
