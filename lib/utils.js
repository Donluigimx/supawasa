
/**
 * @param {number} ms
 * @param {function} cb
 */
function delayAction(ms, cb) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const value = await cb();
      resolve(value);
    }, ms)
  })
}

exports.delayAction = delayAction;
