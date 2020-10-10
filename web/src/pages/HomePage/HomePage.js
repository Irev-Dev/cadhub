import BlogLayout from 'src/layouts/BlogLayout'
import BlogPostsCell from 'src/components/BlogPostsCell'
import { initialize } from 'src/cascade/js/MainPage/CascadeMain'


const HomePage = () => {
  return (

    <BlogLayout>
      <BlogPostsCell/>
      <div>
        <button onClick={() => new initialize()}>init</button>
        <h1 hidden></h1>
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
        <div id="appbody" style={{height:'auto'}}>
            {/* <link data-name="vs/editor/editor.main" rel="stylesheet" href="./node_modules/monaco-editor/min/vs/editor/editor.main.css"> */}
            {/* <script>var require = { paths: { 'vs': 'node_modules/monaco-editor/min/vs' } };</script>
            <script type="text/javascript" src="./node_modules/monaco-editor/min/vs/loader.js"></script>
            <script type="text/javascript" src="./node_modules/monaco-editor/min/vs/editor/editor.main.nls.js"></script>
            <script type="text/javascript" src="./node_modules/monaco-editor/min/vs/editor/editor.main.js"></script>
            <script type="text/javascript" src="./js/MainPage/CascadeMain.js"></script> */}
        </div>
      </div>
    </BlogLayout>
  )
}

export default HomePage
