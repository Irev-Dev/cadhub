import { useAuth } from '@redwoodjs/auth'
import CascadeController from 'src/helpers/cascadeController'
import IdeToolbar from 'src/components/IdeToolbar'
import { useEffect, useState } from 'react'
import { threejsViewport } from 'src/cascade/js/MainPage/CascadeState'
import { element } from 'prop-types'
import { uploadToCloudinary } from 'src/helpers/cloudinary'

const defaultExampleCode = `// Welcome to Cascade Studio!   Here are some useful functions:
//  Translate(), Rotate(), Scale(), Union(), Difference(), Intersection()
//  Box(), Sphere(), Cylinder(), Cone(), Text3D(), Polygon()
//  Offset(), Extrude(), RotatedExtrude(), Revolve(), Pipe(), Loft(),
//  FilletEdges(), ChamferEdges(),
//  Slider(), Button(), Checkbox()

let holeRadius = Slider("Radius", 30 , 20 , 40);

let sphere     = Sphere(50);
let cylinderZ  =                     Cylinder(holeRadius, 200, true);
let cylinderY  = Rotate([0,1,0], 90, Cylinder(holeRadius, 200, true));
let cylinderX  = Rotate([1,0,0], 90, Cylinder(holeRadius, 200, true));

Translate([0, 0, 50], Difference(sphere, [cylinderX, cylinderY, cylinderZ]));

Translate([-130, 0, 100], Text3D("Start Hacking"));

// Don't forget to push imported or oc-defined shapes into sceneShapes to add them to the workspace!`

const IdeCascadeStudio = ({ part, saveCode, loading }) => {
  const isDraft = !part
  const [code, setCode] = useState(isDraft ? defaultExampleCode : part.code)
  const { currentUser } = useAuth()
  const canEdit = currentUser?.sub === part?.user?.id
  useEffect(() => {
    // Cascade studio attaches "cascade-container" a div outside the react app in 'web/src/index.html', and so we are
    // "opening" and "closing" it for the ide part of the app by displaying none or block. Which is why this useEffect
    // returns a clean up function that hides the div again.
    setCode(part?.code || '')
    const onCodeChange = (code) => setCode(code)
    CascadeController.initialise(onCodeChange, code || '')
    const element = document.getElementById('cascade-container')
    element.setAttribute('style', 'display: block; opacity: 100%; overflow: hidden; height: calc(100vh - 8rem)') // eslint-disable-line
    return () => {
      element.setAttribute('style',  'display: none; overflow: hidden; height: calc(100vh - 8rem)') // eslint-disable-line
    }
  }, [part?.code])
  const isChanges = code !== part?.code

  return (
    <>
      <div>
        <IdeToolbar
          canEdit={canEdit}
          isChanges={isChanges && !loading}
          isDraft={isDraft}
          code={code}
          onSave={() => {
            saveCode({
              input: {
                code,
                title: part?.title,
                userId: currentUser?.sub,
                description: part?.description,
              },
              id: part.id,
              isFork: !canEdit,
            })
          }}
          onExport={(type) => threejsViewport[`saveShape${type}`]()}
          userNamePart={{
            userName: part?.user?.userName,
            partTitle: part?.title,
            image: part?.user?.image,
          }}
          onCapture={ async () => {
            // Get the canvas image as a Data URL
            const imgBlob = await CascadeController.capture(threejsViewport.environment)
            const imgURL = window.URL.createObjectURL(imgBlob)

            // TODO: Upload the image to Cloudinary
            // uploadToCloudinary(imgBlob)

            // TODO: Save the screenshot as the mainImage if none has been set
            // If it has been set, pass along the Blob without uploading
            // onSave(part?.id, { ...input, mainImage: cloudinaryPublicId })
          }}
        />
      </div>
    </>
  )
}

export default IdeCascadeStudio
