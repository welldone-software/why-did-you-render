/**
 * @typedef {import('../types').ObjectDifference} ObjectDifference
 */
import calculateDeepEqualDiffs from './calculateDeepEqualDiffs';

const emptyObject = {};

/**
 * @param {object} userPrevObj 
 * @param {object} userNextObj 
 * @param {{ shallow?: boolean }} options
 * @returns {ObjectDifference[] | false}
 */
export default function findObjectsDifferences(userPrevObj, userNextObj, { shallow = true } = {}) {
  if (userPrevObj === userNextObj) {
    return false;
  }

  if (!shallow) {
    return calculateDeepEqualDiffs(userPrevObj, userNextObj);
  }

  const prevObj = userPrevObj || emptyObject;
  const nextObj = userNextObj || emptyObject;

  const keysOfBothObjects = Object.keys({ ...prevObj, ...nextObj });

  const result = [];
  for (const key of keysOfBothObjects) {
    const deepEqualDiffs = calculateDeepEqualDiffs(prevObj[key], nextObj[key], key);
    deepEqualDiffs && result.push(...deepEqualDiffs);
  }
  return result;
}
