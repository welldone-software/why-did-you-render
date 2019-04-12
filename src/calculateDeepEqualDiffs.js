import {isArray, isPlainObject, isDate, isRegExp, isFunction, keys as getKeys, has} from 'lodash'
import {diffTypes} from './consts'

const hasElementType = typeof Element !== 'undefined'

// copied from https://github.com/facebook/react/packages/shared/ReactSymbols.js
const hasSymbol = typeof Symbol === 'function' && Symbol.for
const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7
const isReactElement = object => object.$$typeof === REACT_ELEMENT_TYPE
// end

function trackDiff(a, b, diffsAccumulator, pathString, diffType){
  diffsAccumulator.push({
    diffType,
    pathString,
    prevValue: a,
    nextValue: b
  })
  return diffType !== diffTypes.different
}

function accumulateDeepEqualDiffs(a, b, diffsAccumulator, pathString = ''){
  if(a === b){
    return true
  }

  if(!a || !b){
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isArray(a) && isArray(b)){
    const length = a.length
    if(length !== b.length){
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
    }

    let allChildrenDeepEqual = true
    for(let i = length; i-- !== 0;){
      if(!accumulateDeepEqualDiffs(a[i], b[i], diffsAccumulator, `${pathString}[${i}]`)){
        allChildrenDeepEqual = false
      }
    }

    return allChildrenDeepEqual ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.deepEquals) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isDate(a) && isDate(b)){
    return a.getTime() === b.getTime() ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.date) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isRegExp(a) && isRegExp(b)){
    return a.toString() === b.toString() ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.regex) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(hasElementType && a instanceof Element && b instanceof Element){
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isReactElement(a) && isReactElement(b)){
    if(a.type !== b.type){
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
    }

    else{
      const reactElementPropsAreDeepEqual =
        accumulateDeepEqualDiffs(a.props, b.props, diffsAccumulator, `${pathString}.props`)

      return reactElementPropsAreDeepEqual ?
        trackDiff(a, b, diffsAccumulator, pathString, diffTypes.reactElement) :
        trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
    }
  }

  if(isFunction(a) && isFunction(b)){
    return a.name === b.name ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.function) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isPlainObject(a) && isPlainObject(b)){
    const keys = getKeys(a)
    const length = keys.length
    if(length !== getKeys(b).length){
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
    }

    for(let i = length; i-- !== 0;){
      if(!has(b, keys[i])){
        return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
      }
    }

    let allChildrenDeepEqual = true
    for(let i = length; i-- !== 0;){
      const key = keys[i]
      if(!accumulateDeepEqualDiffs(a[key], b[key], diffsAccumulator, `${pathString}.${key}`)){
        allChildrenDeepEqual = false
      }
    }

    return allChildrenDeepEqual ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.deepEquals) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
}

export default function calculateDeepEqualDiffs(a, b, initialPathString){
  try{
    const diffs = []
    accumulateDeepEqualDiffs(a, b, diffs, initialPathString)
    return diffs
  }catch(error){
    if((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)){
      // warn on circular references, don't crash.
      // browsers throw different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      // eslint-disable-next-line no-console
      console.warn('Warning: why-did-you-render couldn\'t handle circular references in props.', error.name, error.message)
      return false
    }
    throw error
  }
}
