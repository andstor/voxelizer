/**
 * Checks if the passed options contains more than one true value.
 * If so, an Error is thrown.
 * @param {Object} options
 * @throws Error
 * @memberof module:voxelizer/utils
 */
export function onlyOneTrue(options) {
  let trueCount = 0;
  let keys = Object.keys(options);
  for (const option in options) {
    if (options[option]) trueCount++;
  }
  if (trueCount > 1) {
    throw new Error('Only one of the options: \"' + keys.join('\", \"') + '\" can be set to \"true\"');
  } else {
    return true;
  }
}
