import { useRef, useEffect } from 'react'

const useKeyPress = (fn) => {
  const cb = useRef(fn)

  useEffect(() => {
    cb.current = fn
  }, [fn])

  useEffect(() => {
    const onUnload = cb.current

    window.addEventListener('keydown', onUnload)

    return () => window.removeEventListener('keydown', onUnload)
  }, [])
}

export default useKeyPress
