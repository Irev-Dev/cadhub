import IdeToolbar from './IdeToolbar'

export const generated = () => {
  return (
    <div>
      {[
        <IdeToolbar canEdit />,
        <IdeToolbar canEdit isChanges />,
        <IdeToolbar />,
        <IdeToolbar isChanges />,
      ].map((toolbar, index) => (
        <div key={index} className="pb-2">
          {toolbar}
        </div>
      ))}
    </div>
  )
}

export default { title: 'Components/IdeToolbar' }
