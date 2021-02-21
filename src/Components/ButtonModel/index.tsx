import React, { memo, useMemo, useState } from 'react'
import { Button } from 'antd'
import { useEventCallback } from '@/hooks'
import LowCodeEdit from '@/ComponentsEdit'

// Button Model
export default memo(function(props: LowComponentsProps): JSX.Element {
  const ButtonSyle: React.CSSProperties = useMemo(() => Object.assign(props.styles || {}, { left: props.left, top: props.top }), [props.left, props.top, props.styles])
  const DragStart = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
    props.onDragStart && props.onDragStart(e, props.compKey)
  }, [props.onDragStart])

  const DragEnd = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onDragEnd(e, 'ButtonModel', props.compKey)
  }, [props.onDragEnd])

  return <div className="m-components__container" style={ButtonSyle} onDragStart={DragStart} onDragEnd={DragEnd}>
    <Button draggable={true} >
      {props.name}
    </Button>
    {props.edit && <LowCodeEdit />}
  </div>
})