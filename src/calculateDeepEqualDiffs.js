import {isArray, isPlainObject, isDate, isRegExp, isFunction, isSet, keys as getKeys, has} from 'lodash'
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
    const arrayLength = a.length
    if(arrayLength !== b.length){
      return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.different)
    }

    const arrayItemDiffs = []
    let numberOfDeepEqualsItems = 0
    for(let i = arrayLength; i--; i > 0){
      const diffEquals = accumulateDeepEqualDiffs(a[i], b[i], arrayItemDiffs, `${pathString}[${i}]`)
      if(diffEquals){
        numberOfDeepEqualsItems++
      }
    }

    if(numberOfDeepEqualsItems === arrayLength){
      return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.deepEquals)
    }

    diffsAccumulator.push(...arrayItemDiffs)

    return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.different)
  }

  if(isSet(a) && isSet(b)){
    if(a.size !== b.size){
      return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different)
    }

    for(const valA of a){
      if(!b.has(valA)){
        return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different)
      }
    }

    return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.deepEquals)
  }

  if(isDate(a) && isDate(b)){
    return a.getTime() === b.getTime() ?
      trackDiff(new Date(a), new Date(b), diffsAccumulator, pathString, diffTypes.date) :
      trackDiff(new Date(a), new Date(b), diffsAccumulator, pathString, diffTypes.different)
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

    const reactElementPropsAreDeepEqual =
      accumulateDeepEqualDiffs(a.props, b.props, [], `${pathString}.props`)

    return reactElementPropsAreDeepEqual ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.reactElement) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isFunction(a) && isFunction(b)){
    return a.name === b.name ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.function) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different)
  }

  if(isPlainObject(a) && isPlainObject(b)){
    const keys = getKeys(a)
    const keysLength = keys.length
    if(keysLength !== getKeys(b).length){
      return trackDiff({...a}, {...b}, diffsAccumulator, pathString, diffTypes.different)
    }

    for(let i = keysLength; i--; i > 0){
      if(!has(b, keys[i])){
        return trackDiff({...a}, {...b}, diffsAccumulator, pathString, diffTypes.different)
      }
    }

    const objectValuesDiffs = []
    let numberOfDeepEqualsObjectValues = 0
    for(let i = keysLength; i--; i > 0){
      const key = keys[i]
      const deepEquals = accumulateDeepEqualDiffs(a[key], b[key], objectValuesDiffs, `${pathString}.${key}`)
      if(deepEquals){
        numberOfDeepEqualsObjectValues++
      }
    }

    if(numberOfDeepEqualsObjectValues === keysLength){
      return trackDiff({...a}, {...b}, diffsAccumulator, pathString, diffTypes.deepEquals)
    }

    diffsAccumulator.push(...objectValuesDiffs)

    return trackDiff({...a}, {...b}, diffsAccumulator, pathString, diffTypes.different)
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
