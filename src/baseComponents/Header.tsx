import React, { memo, forwardRef, useState, useImperativeHandle } from 'react'
import { Button } from 'antd'
import { useEventCallback } from '@/hooks'
interface RefHeader {
  setCommands: any
}

export default memo(forwardRef<RefHeader, React.HTMLProps<HTMLElement>>(function LowCodeHeader(props, ref): JSX.Element {
  const [commandActions, setCommands] = useState<Array<LowCodeHeader.Commands>>([]) // 命令模式 记录每一个重要的操作，方便回退, 可以利用双端队列进行数据删减增加

  const revokeCommand = useEventCallback(() => {
    const action = commandActions.pop()
    action.action()
  }, [commandActions])
  useImperativeHandle(ref, () => ({
    setCommands
  }))

  return <header className="c-lowcode__header">
    <Button onClick={revokeCommand}>撤销</Button>
  </header>
}))
