const resolveInspect = function (res) {
  return {
    value: res,
    status: 'fulfilled'
  }
}

const rejectInspect = function (res) {
  return {
    value: res,
    status: 'rejected'
  }
}

// getToken,
/**
 * @description 函数防抖
 * @param {Function} fn // 执行函数
 * @param {Number | String} delayTime // 延迟时间
 * @param {Boolean} immidate // 是否在第一次执行的时候立即执行, 将函数执行放在第一帧
 */
const debounce = (fn, delayTime, immidate) => {
  let timer = null
  return (...rest) => {
    if (immidate && Object.prototype.toString.call(timer) === '[object Null]') { // 立即触发第一次
      fn && fn.call(this, ...rest)
    }

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      if (!immidate) {
        fn && fn.apply(this, rest)
      }
      timer = null
    }, delayTime)
  }
}
const throttle = (fn, mustRun) => {
  let timer = null
  let oldTime = +new Date()

  return function () {
    let newTime = +new Date()

    if (timer) clearTimeout(timer)
    const arg = arguments
    timer = setTimeout(() => {
      fn && fn.call(this, ...(arg))
    }, mustRun)

    if (newTime - oldTime > mustRun) {
      fn && fn.call(this, ...(arg))
      oldTime = newTime
    }
  }
}
/**
 * @param {Function} beforeFn // 在执行真正需要执行的函数之前先进行验证，类似于代理模式
 * @param {Function} realFn // 真正需要执行的函数
 */
const decorateDesign = (beforeFn, realFn) => {
  return function () {
    let result = beforeFn.call(this, ...arguments)
    if (result) {
      realFn.call(this, result)
    }
  }
}
// 去重对象形式的元素
function deduplicateObj(array, field) {
  const obj = {}
  const arr = []

  for (let node of array) {
    if (!obj[node[field]]) {
      arr.push(node)
      obj[node[field]] = true
    }
  }

  return arr
}
// 去重原始类型形式的元素数组
function deduplicateConst(array) {
  return array.filter((node, index, arr) => {
    return arr.indexOf(node) === index
  })
}
/**
 * @author Mr.Cai
 * @description 模拟Promise原生带有allsetteld方法，该方法与all方法类似，但是不会因为某个环节发生错误就会终止整个数组
 * @param {function} promises 所有请求的集合
 * @returns 返回promise数组
*/
function allSettled(promises) {
  if (!Array.isArray(promises)) return console.warn('promises is not an array')
  const promisesSet = promises.map((pro: Promise<any>) => {
    if (pro.then) return resolveInspect(new Error('reject'))
    return pro.then(resolveInspect, rejectInspect)
  })

  return Promise.all(promisesSet)
}

export { debounce, throttle, allSettled, deduplicateConst, deduplicateObj, decorateDesign }
