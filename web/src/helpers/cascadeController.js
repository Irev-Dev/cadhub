import { initialize } from 'src/cascade/js/MainPage/CascadeMain'
import { monacoEditor } from 'src/cascade/js/MainPage/CascadeState'

class CascadeController {
  _hasInitialised = false
  incomingOnCodeChang = () => {}
  controllerOnCodeChange = (code) => {
    this.incomingOnCodeChang(code)
  }

  initialise(onCodeChange, code) {
    const onInit = () => {
      const editor = monacoEditor
      editor.setValue(code)
      editor.evaluateCode(false)
    }
    // only inits on first call, after that it just updates the editor and revaluates code, maybe should rename?
    this.incomingOnCodeChang = onCodeChange
    if (!this._hasInitialised) {
      new initialize(this.controllerOnCodeChange, code, onInit)
      this._hasInitialised = true
      return
    }
    onInit()
  }

  capture(environment) {
    let width = 512, height = 384; // These can be adjusted to the best size for the Part Profile.
    environment.camera.aspect = width / height;
    environment.camera.updateProjectionMatrix();
    environment.renderer.setSize(width, height);
    environment.renderer.render(environment.scene, environment.camera, null, false);
    let imgBlob = new Promise((resolve, reject) => {
      environment.renderer.domElement.toBlob(
        (blob) => {
          blob.name = `part_capture-${ Date.now() }`
          resolve(blob)
        },
        'image/jpeg',
        1
      );
    })

    // Return to original dimensions
    environment.onWindowResize();

    return imgBlob
  }
}

export default new CascadeController()
