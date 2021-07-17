import { ideTypeNameMap } from 'src/helpers/hooks/useIdeContext'

interface CadPackageProps {
  cadPackage: string
  className?: string
}

const CadPackage = ({ cadPackage, className = '' }: CadPackageProps) => {
  const cadName = ideTypeNameMap[cadPackage] || ''
  const isOpenScad = cadPackage === 'openscad'
  const isCadQuery = cadPackage === 'cadquery'
  return (
    <div
      className={
        `flex items-center gap-2 cursor-default text-gray-100 ${
          isOpenScad && 'bg-yellow-800'
        } ${isCadQuery && 'bg-ch-blue-300'} bg-opacity-30 ` + className
      }
    >
      <div
        className={`${isOpenScad && 'bg-yellow-200'} ${
          isCadQuery && 'bg-blue-800'
        } w-5 h-5 rounded-full`}
      />
      <div>{cadName}</div>
    </div>
  )
}

export default CadPackage
