let timeoutId = 0
const DelayedPingAnimation = ({
  isLoading: isLoading,
}: {
  isLoading: boolean
}) => {
  const [showLoading, setShowLoading] = React.useState(false)
  React.useEffect(() => {
    if (!isLoading && showLoading) {
      setShowLoading(isLoading)
      clearTimeout(timeoutId)
    } else if (isLoading && !showLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(isLoading)
        console.log('setloading')
      }, 300) as unknown as number
    } else if (!isLoading) {
      setShowLoading(isLoading)
      clearTimeout(timeoutId)
    }
  }, [isLoading])

  if (showLoading && isLoading)
    return (
      <div className="inset-0 absolute flex items-center justify-center">
        <div className="h-16 w-16 bg-pink-600 rounded-full animate-ping"></div>
      </div>
    )
  return null
}

export default DelayedPingAnimation
