export type CadPackageType = 'openscad' | 'cadquery' | 'jscad' | 'INIT'

interface CadPackageConfig {
  label: string
  buttonClasses: string
  dotClasses: string
}

export const cadPackageConfigs: { [key in CadPackageType]: CadPackageConfig } =
  {
    openscad: {
      label: 'OpenSCAD',
      buttonClasses: 'bg-yellow-800',
      dotClasses: 'bg-yellow-200',
    },
    cadquery: {
      label: 'CadQuery',
      buttonClasses: 'bg-ch-blue-700',
      dotClasses: 'bg-blue-800',
    },
    jscad: {
      label: 'JSCAD',
      buttonClasses: 'bg-ch-purple-500',
      dotClasses: 'bg-yellow-300',
    },
    INIT: {
      label: '',
      buttonClasses: '',
      dotClasses: '',
    },
  }

interface CadPackageProps {
  cadPackage: CadPackageType
  className?: string
  dotClass?: string
  onClick?: any
}

const CadPackage = ({
  cadPackage,
  className = '',
  dotClass = 'w-5 h-5',
  onClick,
}: CadPackageProps) => {
  const cadPackageConfig = cadPackageConfigs[cadPackage]

  return (
    <button
      onClick={onClick}
      className={
        `grid grid-flow-col-dense items-center gap-2 text-gray-100 bg-opacity-30 ${
          onClick && ' hover:bg-opacity-80 '
        } ${cadPackageConfig?.buttonClasses} ` + className
      }
    >
      <div
        className={`${cadPackageConfig?.dotClasses} ${dotClass} rounded-full`}
      />
      {cadPackageConfig?.label}
    </button>
  )
}

export default CadPackage
