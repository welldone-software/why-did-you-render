import {isString} from 'lodash'

export default function getDisplayName(type){
  return isString(type) ? type : (type.displayName || type.name)
}
