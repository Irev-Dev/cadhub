import { ideTypeNameMap } from 'src/helpers/hooks/useIdeContext'
import type { CadPackage as CadPackageType } from 'src/helpers/hooks/useIdeState'

interface CadPackageProps {
  cadPackage: CadPackageType
  className?: string
  dotClass?: string
}

const CadPackage = ({
  cadPackage,
  className = '',
  dotClass = 'w-5 h-5',
}: CadPackageProps) => {
  const cadName = ideTypeNameMap[cadPackage] || ''
  const isOpenScad = cadPackage === 'openscad'
  const isCadQuery = cadPackage === 'cadquery'
  return (
    <div
      className={
        `grid grid-flow-col-dense items-center gap-2 cursor-default text-gray-100 ${
          isOpenScad && 'bg-yellow-800'
        } ${isCadQuery && 'bg-ch-blue-700'} bg-opacity-30 ` + className
      }
    >
      <div
        className={`${isOpenScad && 'bg-yellow-200'} ${
          isCadQuery && 'bg-blue-800'
        } ${dotClass} rounded-full`}
      />
      <div>{cadName}</div>
    </div>
  )
}

export default CadPackage
