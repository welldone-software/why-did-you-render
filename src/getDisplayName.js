import {isString} from 'lodash'

export default function getDisplayName(type){
  return (
    type.displayName ||
    type.name ||
    (type.type && getDisplayName(type.type)) ||
    (isString(type) ? type : undefined)
  )
}
