export type CadPackageType = 'openscad' | 'cadquery' | 'jscad'

export const ideTypeNameMap: { [key in CadPackageType]: string } = {
  openscad: 'OpenSCAD',
  cadquery: 'CadQuery',
  jscad: 'JSCAD',
}

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
  const isJsCad = cadPackage === 'jscad'
  return (
    <div
      className={
        `grid grid-flow-col-dense items-center gap-2 text-gray-100 ${
          isOpenScad && 'bg-yellow-800'
        } ${isCadQuery && 'bg-ch-blue-700'} ${
          isJsCad && 'bg-ch-purple-500'
        } bg-opacity-30 ` + className
      }
    >
      <div
        className={`${isOpenScad && 'bg-yellow-200'} ${
          isCadQuery && 'bg-blue-800'
        } ${isJsCad && 'bg-yellow-300'} ${dotClass} rounded-full`}
      />
      <div>{cadName}</div>
    </div>
  )
}

export default CadPackage
