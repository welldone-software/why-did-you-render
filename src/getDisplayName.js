import {isString} from 'lodash'

export default function getDisplayName(type){
  return type.displayName || type.name || (isString(type) ? type : undefined)
}
