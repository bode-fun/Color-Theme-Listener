const { Gio } = imports.gi
const Main = imports.ui.main;

const DEFAULT_SCHEME_NAME = 'default'
const LIGHT_SCHEME_NAME = 'prefer-light'
const DARK_SCHEME_NAME = 'prefer-dark'

class ThemeSwitcherExtension {
  schema = undefined
  colorShemeConnectionId = undefined
  
  constructor() {}
  
  enable() {
    this.schema = Gio.Settings.new('org.gnome.desktop.interface')
    this.colorShemeConnectionId = this.schema.connect('changed::color-scheme', () => {
        this.handleSchemeChangeEvent() 
      })
  }
  
  disable() {
    if (this.schema && this.id) {
        this.restoreInitialState()
        this.schema.disconnect(this.id)
    }
    this.schema = undefined
    this.id = undefined
  }
  
  handleSchemeChangeEvent() {
    let currentScheme = this.schema.get_string('color-scheme')
     switch(currentScheme)
        {
            case DEFAULT_SCHEME_NAME:
            case LIGHT_SCHEME_NAME:
                this.changeLegacyColorTheme()  
                break
            case DARK_SCHEME_NAME:
                this.changeLegacyColorTheme(false)
                break
            default:
                break
        }
  }
  
  changeLegacyColorTheme(shouldBeLight = true) {
    let theme = this.schema.get_string('gtk-theme')
    const isDarkTheme = theme.endsWith("-dark")
    
    if(isDarkTheme && shouldBeLight) {
      theme = theme.slice(0,-5)
    } else if (!isDarkTheme && !shouldBeLight) {
        theme += "-dark"
      }
      
    console.log(`Setting legacy theme: ${theme}`)
    this.schema.set_string('gtk-theme', theme)         
  }
}

function init() {
  return new ThemeSwitcherExtension()
}

