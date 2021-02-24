/**
 * @author [Mr.Cai]
 * @email [459963103@qq.com]
 * @create date 2020-03-06 13:58:49
 * @modify date 2020-03-06 13:58:49
 * @desc 充分利用useRef类似于全局变量，它的值不会因为闭包的关系而不更新并且指针始终指向一个地址
 * useCallback则不会重新生成新的函数，否则当useCallback的依赖发生变化时也会生成新的函数
 */
import { useRef, useEffect, useCallback } from 'react'
const useEventCallback = function(fn, devpendcies: Array<unknown> = []) {
  const ref = useRef(function() { return void 0 })

  useEffect(() => {
    ref.current = fn
    // eslint-disable-next-line
  }, devpendcies)

  return useCallback(function(...rest) {
    return ref.current.call(null, ...arguments)
  }, [ref])
}

export {
  useEventCallback
}
