import ImageUploader from './ImageUploader'

export const generated = () => {
  return (
    <>
      <h3>AspectRatio:1, no initial image, editable</h3>
      <
        ImageUploader
        onImageUpload={({cloudinaryPublicId}) => console.log(cloudinaryPublicId)}
        aspectRatio={1}
        isEditable={true}
        className={"bg-red-400 rounded-half rounded-br-xl"}
      />
      <h3>AspectRatio 16:9, no initial image, editable</h3>
      <
        ImageUploader
        onImageUpload={({cloudinaryPublicId}) => console.log(cloudinaryPublicId)}
        aspectRatio={16/9}
        isEditable={true}
        className={"bg-red-400 rounded-xl"}
        imageUrl="CadHub/inakek2urbreynblzhgt"
      />
      <h3>AspectRatio:1, no initial image, NOT editable</h3>
      <
        ImageUploader
        onImageUpload={({cloudinaryPublicId}) => console.log(cloudinaryPublicId)}
        aspectRatio={1}
        className={"rounded-half rounded-br-xl"}
      />
      <h3>AspectRatio ,16:9 no initial image, NOT editable</h3>
      <
        ImageUploader
        onImageUpload={({cloudinaryPublicId}) => console.log(cloudinaryPublicId)}
        aspectRatio={16/9}
        className={"rounded-xl"}
        imageUrl="CadHub/inakek2urbreynblzhgt"
      />
    </>
  )
}

export default { title: 'Components/ImageUploader' }
