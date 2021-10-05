import { useTexture } from '@react-three/drei'

export default function useSafeTexture(texture: string) {
  let colorMap
  try {
    // breaks on netlify's prerendering service if not caught
    // see app/web/src/components/FatalErrorBoundary/FatalErrorBoundary.tsx for more into on debugging the service
    colorMap = useTexture(texture)
  } catch (error) {}
  return colorMap
}
