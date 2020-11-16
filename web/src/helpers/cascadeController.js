import { initialize, getEditor } from 'src/cascade/js/MainPage/CascadeMain'

class CascadeController {
  _hasInitialised = false
  incomingOnCodeChang = () => {}
  controllerOnCodeChange = (code) => {
    this.incomingOnCodeChang(code)
  }

  initialise(onCodeChange, code) {
    // only inits on first call, after that it just updates the editor and revaluates code, maybe should rename?
    this.incomingOnCodeChang = onCodeChange
    if (!this._hasInitialised) {
      initialize(this.controllerOnCodeChange, code)
      this._hasInitialised = true
      return
    }
    const editor = getEditor()
    editor.setValue(code)
    editor.evaluateCode(false)
    return this.domNode
  }
}

export default new CascadeController()
