import MainLayout from 'src/layouts/MainLayout'
// import BlogPostsCell from 'src/components/BlogPostsCell'
import { initialize } from 'src/cascade/js/MainPage/CascadeMain'
import { useEffect, useState } from 'react'

const starterCode =
`// Welcome to Cascade Studio!   Here are some useful functions:
//  Translate(), Rotate(), Scale(), Union(), Difference(), Intersection()
//  Box(), Sphere(), Cylinder(), Cone(), Text3D(), Polygon()
//  Offset(), Extrude(), RotatedExtrude(), Revolve(), Pipe(), Loft(),
//  FilletEdges(), ChamferEdges(),
//  Slider(), Button(), Checkbox()

// Uncomment and hover over them to see their apis

let holeRadius = Slider("Radius", 30 , 20 , 40);

let sphere     = Sphere(50);
let cylinderZ  =                     Cylinder(holeRadius, 200, true);
let cylinderY  = Rotate([0,1,0], 90, Cylinder(holeRadius, 200, true));
let cylinderX  = Rotate([1,0,0], 90, Cylinder(holeRadius, 200, true));

Translate([0, 0, 50], Difference(sphere, [cylinderX, cylinderY, cylinderZ]));

Translate([-100, 0, 100], Text3D("cadhub.xyz"));

// Don't forget to push imported or oc-defined shapes into sceneShapes to add them to the workspace!
`;

const HomePage1 = () => {
  const [code, setCode] = useState(starterCode)
  useEffect(() => {
    const sickCallback = (code) => setCode(code)
    new initialize(sickCallback, starterCode)
  }, [])
  return (

    <MainLayout>
      <div>current code {code}</div>
      <BlogPostsCell/>
      <div>
        <div id="topnav" className="topnav">
            <a href="https://github.com/zalo/CascadeStudio">Cascade Studio 0.0.6</a>
            <a href="#" id="main-proj-button" title="Sets this project to save in local storage." onClick={() => makeMainProject()}>Make Main Project</a>
            <a href="#" title="Save Project to .json" onClick={() => saveProject()}>Save Project</a>
            <label htmlFor="project-file" title="Load Project from .json">Load Project
                <input
                  id="project-file"
                  name="project-file"
                  type="file"
                  accept=".json"
                  style={{display:'none'}}
                  onInput={() => loadProject()}
                />
            </label>
            <a href="#" onClick={() => threejsViewport.saveShapeSTEP()}>Save STEP</a>
            <a href="#" onClick={() => threejsViewport.saveShapeSTL()}>Save STL</a>
            <a href="#" onClick={() => threejsViewport.saveShapeOBJ()}>Save OBJ</a>
            <label htmlFor="files" title="Import STEP, IGES, or (ASCII) STL from File">Import STEP/IGES/STL
                <input id="files" name="files" type="file" accept=".iges,.step,.igs,.stp,.stl" multiple style={{display: 'none'}} onInput={ () =>loadFiles()}/>
            </label>
            <a href="#" title="Clears the external step/iges/stl files stored in the project." onClick={() => clearExternalFiles()}>Clear Imported Files</a>
            <a href="" title="Resets the project and localstorage." onClick={() => {
              window.localStorage.clear();
              window.history.replaceState({}, 'Cascade Studio','?')
            }}>Reset Project</a>
        </div>
        <div id="cascade-container" style={{height:'auto'}}>
        </div>
        <footer>footer</footer>
      </div>
    </MainLayout>
  )
}

const HomePage = () => {
  return (
    <MainLayout>
      hi
    </MainLayout>
  )
}

export default HomePage
