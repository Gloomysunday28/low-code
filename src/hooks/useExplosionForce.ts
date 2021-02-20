/**
 * @author [Mr.Cai]
 * @email [459963103@qq.com]
 * @create date 2020-03-12 11:22:26
 * @modify date 2020-03-12 11:22:26
 * @desc 防爆力点击
 */
import { useState } from 'react'

export default function useExplosionForce(fn): [boolean, (rest?) => void] {
  const [requestLoading, setRequestLoading] = useState(false)
  return [requestLoading, function() {
    setRequestLoading(true)
    Promise.resolve(fn.apply(null, arguments)).finally(() => {
      setRequestLoading(false)
    })
  }]
}
