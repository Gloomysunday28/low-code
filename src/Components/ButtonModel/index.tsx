import React, { memo, useMemo } from 'react'
import { Button } from 'antd'
import { useEventCallback } from '@/hooks'

// Button Model
export default memo(function(props: LowComponentsProps): JSX.Element {
  const ButtonSyle: React.CSSProperties = useMemo(() => props.styles || {}, [props.styles])
  const DragEnd = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(props)
    props.onDragEnd(e, 'ButtonModel', props.compKey)
  }, [props.onDragEnd])

  return <div style={ButtonSyle} onDragEnd={DragEnd}>
    <Button draggable={true} >
      {props.name}
    </Button>
  </div>
})