import {keys, reduce} from 'lodash'
import calculateDeepEqualDiffs from './calculateDeepEqualDiffs'

const emptyObject = {}

export default function findObjectsDifferences(userPrevObj, userNextObj){
  if(userPrevObj === userNextObj){
    return false
  }

  const prevObj = userPrevObj || emptyObject
  const nextObj = userNextObj || emptyObject

  const keysOfBothObjects = keys({...prevObj, ...nextObj})

  return reduce(keysOfBothObjects, (result, key) => {
    const deepEqualDiffs = calculateDeepEqualDiffs(prevObj[key], nextObj[key], key)
    if(deepEqualDiffs){
      result = [
        ...(result || []),
        ...deepEqualDiffs
      ]
    }
    return result
  }, [])
}
