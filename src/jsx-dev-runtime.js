import {jsxDEV as origJsxDev} from 'react/jsx-dev-runtime'
// import wdyr from './whyDidYouRender'
// import patchFunctionalOrStrComponent from './patches/patchFunctionalOrStrComponent'

function jsxDEV(type, ...rest){
  const wdyrType = function(){
    return type()
  }
  return origJsxDev(wdyrType, ...rest)
}

export {jsxDEV}
