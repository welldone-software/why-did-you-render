import { isString } from 'lodash';

/**
 * @returns {string}
 */
export default function getDisplayName(type) {
  return (
    type.displayName ||
    type.name ||
    (type.type && getDisplayName(type.type)) ||
    (type.render && getDisplayName(type.render)) ||
    (isString(type) ? type : 'Unknown')
  );
}
