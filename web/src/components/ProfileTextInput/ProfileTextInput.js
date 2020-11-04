import {Fragment, useState} from 'react'

const ProfileTextInput = ({fields, isEditable, onChange= () => {}}) => {
  const keyValueDisplay = Object.entries(fields)
  return (
    <div>
      <div className="grid items-center" style={{gridTemplateColumns: 'auto 1fr'}}>
        {keyValueDisplay.map(([property, value]) => (<Fragment key={property}>
          <span className="capitalize text-gray-500 text-sm align-middle my-3">{property}:</span>
          {
            isEditable ?
              <div className="relative ml-2">
                <div className="absolute inset-0 mb-2 rounded bg-gray-200 shadow-inner bg-gray-100" />
                <input
                  className=" pl-2 pt-1 text-indigo-800 font-medium text-xl mb-px pb-px bg-transparent relative"
                  onChange={({target}) => onChange({...fields, [property]: target.value})}
                  value={value}
                  type="text"
                />
              </div>:
              <span className="pl-2 text-indigo-800 font-medium text-xl mb-px pb-px">{value}</span>
          }
        </Fragment>))}
      </div>
    </div>
  )
}

export default ProfileTextInput
