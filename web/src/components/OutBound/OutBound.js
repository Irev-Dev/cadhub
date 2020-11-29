import ReactGA from 'react-ga'

const OutBound = ({ className, children, to }) => {
  return (
    <a
      className={className}
      href={to}
      onClick={() => {
        ReactGA.event({
          category: 'outbound',
          action: to,
        })
        return true
      }}
    >
      {children}
    </a>
  )
}

export default OutBound
