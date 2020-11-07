import { getActiveClasses } from "get-active-classes"

import InputText from 'src/components/InputText'

const Breadcrumb = ({ userName, partTitle, onPartTitleChange, className }) => {
  return (
    <h3 className={getActiveClasses("text-2xl font-roboto", className)}>
      <div className="w-1 inline-block text-indigo-800 bg-indigo-800 mr-2">.</div>
      <span className={getActiveClasses({"text-gray-500": !onPartTitleChange, 'text-gray-400': onPartTitleChange})}>
        {userName}
      </span>
      <div className="w-1 inline-block bg-gray-400 text-gray-400 mx-3 transform -skew-x-20" >.</div>
      <InputText
        value={partTitle}
        onChange={onPartTitleChange}
        isEditable={onPartTitleChange}
        className={getActiveClasses("text-indigo-800 text-2xl", {'-ml-2': !onPartTitleChange})}
      />
    </h3>
  )
}

export default Breadcrumb
