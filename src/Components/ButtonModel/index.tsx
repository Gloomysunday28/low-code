import React, { memo, useEffect, useRef, useMemo, useState, useLayoutEffect } from 'react'
import { Button } from 'antd'
import { useEventCallback, useProvider } from '@/hooks'
import LowCodeEdit from '@/baseComponents/ComponentsEdit'

interface Layout {
  [propsName: string]: string | number,
}

// Button Model
export default memo(function(props: LowComponentsProps): JSX.Element {
  const button = useRef(null)
  const context = useProvider()
  const [layout, setLayout] = useState<Layout>({})
  const ButtonSyle: React.CSSProperties = useMemo(() => ({ position: 'absolute', left: props.left, top: props.top, ...layout}), [props.left, props.top, layout])
  const DragStart = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
    props.onDragStart && props.onDragStart(e, props.compKey)
  }, [props.onDragStart])

  const DragEnd = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onDragEnd(e, 'ButtonModel', props.compKey)
  }, [props.onDragEnd])

  useEffect(() => {
    const { width, height } = button.current.getBoundingClientRect()
    setLayout({
      width,
      height
    })
  }, [])

  return <div className="m-components__container" style={ButtonSyle} onDragStart={DragStart} onDragEnd={DragEnd}>
    <Button draggable={true} ref={button} style={{ width: '100%', height: '100%' }}>
      {props.name}
    </Button>
    {props.edit && <LowCodeEdit context={context} left={props.left} top={props.top} setLayout={setLayout} layout={layout}/>}
  </div>
})