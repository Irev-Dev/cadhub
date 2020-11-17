import { initialize, getEditor } from 'src/cascade/js/MainPage/CascadeMain'

class CascadeController {
  _hasInitialised = false
  incomingOnCodeChang = () => {}
  controllerOnCodeChange = (code) => {
    this.incomingOnCodeChang(code)
  }

  initialise(onCodeChange, code) {
    const onInit = () => {
      const editor = getEditor()
      editor.setValue(code)
      editor.evaluateCode(false)
    }
    // only inits on first call, after that it just updates the editor and revaluates code, maybe should rename?
    this.incomingOnCodeChang = onCodeChange
    if (!this._hasInitialised) {
      initialize(this.controllerOnCodeChange, code, onInit)
      this._hasInitialised = true
      return
    }
    onInit()
  }
}

export default new CascadeController()
