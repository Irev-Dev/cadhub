import Svg from 'src/components/Svg/Svg'

const TopButton = ({children}) => (
  <button className="flex bg-gray-500 h-10 justify-center items-center px-4 rounded">
    <div className="rounded-full bg-gray-200 h-6 w-6 mr-4"/>
    {children}
  </button>
)

const IdeHeader = () => {
  return (
    <div className="h-16 bg-gray-900 flex justify-between items-center">
      <div className="w-16 h-full flex items-center justify-center bg-gray-700">
        <Svg className="w-12" name="favicon" />
      </div>
      <div className="text-gray-200 flex gap-4 mr-4">
        <TopButton>Render</TopButton>
        <TopButton>Share</TopButton>
        <TopButton>Fork</TopButton>
      </div>
    </div>
  )
}

export default IdeHeader
