/**
 * @author [Mr.Cai]
 * @email [459963103@qq.com]
 * @create date 2020-03-06 14:29:41
 * @modify date 2020-03-06 14:29:41
 * @desc 使用函数防抖, 如果添加依赖的话则会不更新函数
 */
import { useCallback } from 'react'
import { debounce } from '../utils/utils'
const syncEvent = function(fn: any) {
  return function(e: React.SyntheticEvent) {
    typeof e === 'object' && e.persist && e.persist()
    fn.call(null, ...arguments)
  }
}
const useDebounce = function(fn, delayTime = 300, immdiate, devpendcies = []) {
  const currentFn = syncEvent(debounce(fn, delayTime, immdiate))
  // eslint-disable-next-line
  return useCallback(currentFn, devpendcies)
}

export {
  useDebounce
}
