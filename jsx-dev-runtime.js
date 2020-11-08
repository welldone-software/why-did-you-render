/* eslint-disable*/
var jsxDevRuntime = require('react/jsx-dev-runtime')
var WDYR = require('@welldone-software/why-did-you-render')

var origJsxDev = jsxDevRuntime.jsxDEV
var wdyrStore = WDYR.wdyrStore

module.exports = jsxDevRuntime
module.exports.jsxDEV = function jsxDEV(){
  var args = Array.prototype.slice.call(arguments)

  if(wdyrStore.React && wdyrStore.React.isWDYR){
    var origType = args[0]
    var rest = args.slice(1)

    var WDYRType = WDYR.getWDYRType(origType)
    if(WDYRType){
      try{
        var element = origJsxDev.apply(null, [WDYRType].concat(rest))
        if(wdyrStore.options.logOwnerReasons){
          WDYR.storeOwnerData(element)
        }
        return element
      }catch(e){
        wdyrStore.options.consoleLog('whyDidYouRender JSX transform error. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
          errorInfo: {
            error: e,
            componentNameOrComponent: origType,
            rest: rest,
            options: wdyrStore.options
          }
        })
      }
    }
  }

  return origJsxDev.apply(null, args)
}
