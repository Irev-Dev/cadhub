import {Fragment} from 'react'

import InputText from 'src/components/InputText'

const ProfileTextInput = ({fields, isEditable, onChange= () => {}}) => {
  return (
    <div>
      <div className="grid items-center" style={{gridTemplateColumns: 'auto 1fr'}}>
        {Object.entries(fields).map(([property, value]) => (<Fragment key={property}>
          <span className="capitalize text-gray-500 text-sm align-middle my-3">{property}:</span>

          <InputText
            className="text-xl"
            value={value}
            onChange={({target}) => onChange({...fields, [property]: target.value})}
            isEditable={isEditable}
          />

        </Fragment>))}
      </div>
    </div>
  )
}

export default ProfileTextInput
