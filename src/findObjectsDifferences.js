import {reduce} from 'lodash'
import calculateDeepEqualDiffs from './calculateDeepEqualDiffs'

const emptyObject = {}

export default function findObjectsDifferences(userPrevObj, userNextObj, {shallow = true} = {}){
  if(userPrevObj === userNextObj){
    return false
  }

  if(!shallow){
    return calculateDeepEqualDiffs(userPrevObj, userNextObj)
  }

  const prevObj = userPrevObj || emptyObject
  const nextObj = userNextObj || emptyObject

  const keysOfBothObjects = Object.keys({...prevObj, ...nextObj})

  return reduce(keysOfBothObjects, (result, key) => {
    const deepEqualDiffs = calculateDeepEqualDiffs(prevObj[key], nextObj[key], key)
    if(deepEqualDiffs){
      result = [
        ...result,
        ...deepEqualDiffs
      ]
    }
    return result
  }, [])
}
