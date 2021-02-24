import React from 'react'
import { useEventCallback } from '@/hooks'
import styled from 'styled-components'
interface StyledProps {
  left?: string | number,
  top?: string | number,
  cursor?: string
}
interface EditProps {
  setLayout: any,
  left?: number,
  top?: number,
  context: any,
  layout: {
    width?: string | number,
    height?: string | number,
  }
}

enum MouseCursor {
  'cursor0' = 'nwse-resize',
  'cursor1' = 'ns-resize',
  'cursor2' = 'nesw-resize',
}

const EditDot = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 100%;
  border: 1px solid #1890ff;
  background: #fff;
  ${(props: StyledProps) => ({
    left: props.left,
    top: props.top,
    cursor: props.cursor
  })}
`

const dotDirectMap = new Map([
  [[0, 3, 5], 'left'],
  [[0, 1, 2], 'top'],
])
export default function ComponentsEdit(props: EditProps): JSX.Element {
  const getCurrentStyles = (key) => {
    switch (true) {
      case key < 3:
        return {
          left: (key * 50) + '%',
          top: 0,
          cursor: MouseCursor[`cursor${key}`]
        }
      case key >= 3 && key < 5:
        return {
          left: (key === 3 ? 0 : 100) + '%',
          top: '50%',
          cursor: 'ew-resize'
        }
      case key >= 5:
        return {
          left: ((key - 5) * 50) + '%',
          top: '100%',
          cursor: MouseCursor[`cursor${7 - key}`]
        }
      default:
        return
    }
  }

  const dragStart = useEventCallback((e) => {
    const { clientX: sX, clientY: sY, target: { dataset: { index } } } = e
    const numberIndex = +index
    document.onmousemove = function(event) {
      const { clientX, clientY } = event
      const width = Math.abs(clientX - sX)
      const height = Math.abs(clientY - sY)
      if (width && height) {
        let directSet = []
        for (let [key, direct] of dotDirectMap.entries()) {
          if (key.includes(numberIndex)) {
            directSet.push(direct)
          }
        }

        props.setLayout({
          width: (props.layout.width as number) + width,
          height: (props.layout.height as number) + height,
          ...directSet.reduce((params, direct, i) => {
            if (numberIndex) {
              params[direct] = (numberIndex > 2 ? props.left - width : props.top - height)
            } else {
              params[direct] = i ? props.top - height : props.left - width
            }
            
            return params
          }, {})
        })
      }
    }
    
    document.onmouseup = function() {
      document.onmousemove = null
    }
  }, [props.setLayout, props.layout])

  return <>
    {[...Array(8).keys()].map((key, index) => <EditDot onMouseDown={dragStart} data-index={index} {...getCurrentStyles(key)} key={key}>

    </EditDot>)}
  </>
}