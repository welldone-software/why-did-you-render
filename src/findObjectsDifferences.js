import {reduce} from 'lodash';
import calculateDeepEqualDiffs from './calculateDeepEqualDiffs';

const emptyObject = {};

export default function findObjectsDifferences(userPrevObj, userNextObj, {shallow = true, opaqueOverride} = {}) {
  if (userPrevObj === userNextObj) {
    return false;
  }

  // Check if either object should be treated as opaque
  if (opaqueOverride) {
    const prevIsOpaque = opaqueOverride(userPrevObj);
    const nextIsOpaque = opaqueOverride(userNextObj);
    if (prevIsOpaque || nextIsOpaque) {
      // If either is opaque, they're different unless they're the same reference (which we already checked)
      return [{
        pathString: '',
        diffType: 'different',
        prevValue: userPrevObj,
        nextValue: userNextObj,
      }];
    }
  }

  if (!shallow) {
    return calculateDeepEqualDiffs(userPrevObj, userNextObj, '', {opaqueOverride});
  }

  const prevObj = userPrevObj || emptyObject;
  const nextObj = userNextObj || emptyObject;

  const keysOfBothObjects = Object.keys({...prevObj, ...nextObj});

  return reduce(keysOfBothObjects, (result, key) => {
    const deepEqualDiffs = calculateDeepEqualDiffs(prevObj[key], nextObj[key], key, {opaqueOverride});
    if (deepEqualDiffs) {
      result = [
        ...result,
        ...deepEqualDiffs,
      ];
    }
    return result;
  }, []);
}
