import React, { useEffect, useState, useRef, lazy, Suspense} from 'react'
import './App.css';
import { useEventCallback } from '@/hooks'

const ButtonModel = lazy(() => import(`./Components/ButtonModel`))

let contextRef: null | CanvasRenderingContext2D = null
function App() {
  const canvasRef = useRef(null)
  const [ContainerComponents, setComponents] = useState<Array<LowComponentsProps>>([])
  const [currentDragComp, setCurrentComponent] = useState<LowComponentsProps>(null)
  const drop = (e, type: string) => {
    const { clientX, clientY } = e
    const { width, height } = e.target.getBoundingClientRect()
    setComponents((components) => {
      components = components.slice(0)
      const randomKey = Math.random().toString(36).substr(2)
      switch (type) {
        case 'ButtonModel':
          components.push({
            type,
            key: `ButtonModel${randomKey}`,
            compKey: `ButtonModel${randomKey}`,
            name: '按钮',
            styles: {
              position: 'absolute',
            },
            left: `${clientX - 240}px`,
            top: `${clientY - 30}px`,
            onDragStart: dropStart,
            onDragEnd: dropExist,
            edit: false,
            width,
            height
          })
          break
        default:
          break
      }
      return components
    })
  }

  const dropExist = (e: React.MouseEvent<HTMLDivElement>, type, key) => {
    setComponents((components) => {
      components = components.slice(0)
      dropOver(e)
      return components
    })
  }

  const dropStart = useEventCallback((e, key: string) => {
    setCurrentComponent(ContainerComponents.find(comp => comp.key === key))
  }, [ContainerComponents])

  const dropOver = useEventCallback((e) => {
    const { clientX, clientY } = e
    if (currentDragComp) {
      currentDragComp.left = `${clientX - 240}px`
      currentDragComp.top = `${clientY - 30}px`
    }
  }, [currentDragComp])

  const edgeCollision = useEventCallback(({
    startX,
    startY,
    endX,
    endY
  }) => { // 边缘碰撞
    setComponents(components => {
      components = components.slice(0)

      components.forEach(comp => {
        const { left, top, width, height } = comp
        const cLeft = parseInt(left, 10)
        const cTop = parseInt(top, 10)
        if (startX < endX) {

        } else {
          console.log(startX)
          console.log(startY)
          console.log((width as number) + cLeft)
          if (endX < (width as number) + cLeft && endY < cTop + (height as number)) {
            comp.edit = true
          }
        }
        // if (startX)
      })
      return components
    })
  }, [currentDragComp])

  const renderComponents = useEventCallback((compProps: LowComponentsProps) => {
    switch (compProps.type) {
      case 'ButtonModel':
        return <ButtonModel {...compProps}/>
    }
  }, [])

  const drawLayoutRasterized = useEventCallback(() => {
  }, [])

  const selectCavanvs = useEventCallback((e) => {
    const { offsetX: startX, offsetY: startY } = e
    canvasRef.current.onmousemove = function(event) {
      const { offsetX, offsetY } = event
      contextRef.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.beginPath()
      contextRef.strokeRect(startX, startY, offsetX - startX, offsetY - startY)
      contextRef.strokeStyle = '#1890ff'
      contextRef.globalAlpha = 0.8
    }
    document.onmouseup = function(event) {
      const { offsetX, offsetY } = event
      canvasRef.current.onmousemove = null
      contextRef.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.closePath()
      edgeCollision({
        startX,
        startY,
        endX: offsetX,
        endY: offsetY
      })
    }
  }, [])

  useEffect(() => {
    const container = document.getElementsByClassName('container')[0]
    canvasRef.current.width = container.clientWidth
    canvasRef.current.height = container.clientHeight
    canvasRef.current.addEventListener('mousedown', selectCavanvs)
    contextRef = canvasRef.current.getContext('2d')
    drawLayoutRasterized()
  }, [])

  return (
    <div className="App">
      <div className="components">
        <Suspense fallback={null}>
          <ButtonModel name="按钮" key="ButtonModel" onDragEnd={drop}/>
        </Suspense>
      </div>
      <div className="container" onDragOver={edgeCollision} >
        <canvas ref={canvasRef}/>
        {ContainerComponents.map(renderComponents)}
      </div>
    </div>
  );
}

export default App;
