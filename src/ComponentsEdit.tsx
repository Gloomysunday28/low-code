import React from 'react'
import styled from 'styled-components'
import { useEventCallback } from './hooks'

interface StyledProps {
  left?: string | number,
  top?: string | number,
  cursor?: string
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
export default function(): JSX.Element {
  const getCurrentStyles = (key) => {
    switch (true) {
      case key < 3:
        return {
          left: (key * 50) + '%',
          top: 0,
          cursor: 'nwse-resize'
        }
      case key >= 3 && key < 5:
        return {
          left: (key === 3 ? 0 : 100) + '%',
          top: '50%',
          cursor: 'nwse-resize'
        }
      case key >= 5:
        return {
          left: ((key - 5) * 50) + '%',
          top: '100%',
          cursor: 'nwse-resize'
        }
      default:
        return
    }
  }

  return <>
    {[...Array(8).keys()].map(key => <EditDot {...getCurrentStyles(key)} key={key}>

    </EditDot>)}
  </>
}