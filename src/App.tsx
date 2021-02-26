import React, { useEffect, useState, useRef, lazy, Suspense } from 'react'
import LowCodeHeader from '@/baseComponents/Header'
import { useEventCallback } from '@/hooks'
import Provider from '@/context'
import '@compiled/react'
import './App.css';

const ButtonModel = lazy(() => import(`./components/ButtonModel`))

let contextRef: null | CanvasRenderingContext2D = null
const edgeX: number = 320
const edgeY: number = 95
function App() {
  const canvasRef = useRef(null)
  const lowCodeHeaderRef = useRef(null)
  const {1: setUpdate} = useState<boolean>(false)
  const [ContainerComponents, setComponents] = useState<Array<LowComponentsProps>>([])
  const [currentDragComp, setCurrentComponent] = useState<LowComponentsProps>(null)

  // 选择左侧组件进行拖拽
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
            left: clientX - edgeX - 20,
            top: clientY - edgeY- 15,
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

  // 已在画布中的组件拖拽
  const dropExist = (e: React.MouseEvent<HTMLDivElement>) => {
    dropOver(e)
    setUpdate(update => !update)
  }

  // 拖拽开始点击获取当前拖拽组件
  const dropStart = useEventCallback((e, key: string) => {
    setCurrentComponent(ContainerComponents.find(comp => comp.key === key))
  }, [ContainerComponents])

  // 拖拽移动
  const dropOver = useEventCallback((e) => {
    const { clientX, clientY } = e
    if (currentDragComp) {
      currentDragComp.left = clientX - edgeX - 20
      currentDragComp.top = clientY - edgeY - 15
    }
  }, [currentDragComp])

  // 边缘检测， 选中区域是否囊括了组件
  const edgeCollision = useEventCallback(({
    startX,
    startY,
    endX,
    endY
  }) => { // 边缘碰撞
    // console.log(endX)
    // console.log(endY)
    // console.log(startX)
    // console.log(startY)
    setComponents(components => {
      const edgeProps: Array<LowComponentsProps> = []
      components = components.slice(0)
      // console.log('components', components)
      components.forEach(comp => {
        const { left: cLeft, top: cTop, width, height } = comp
        const cWL = cLeft + (width as number) 
        const cTH = cTop + (height as number)
        comp.edit = false
        if (startX > endX) {
          if (startX > cLeft && startY > cTop && endX < cWL && endY < cTH) {
            comp.edit = true
            edgeProps.push(comp)
          }
        } else {
          if (startX < cWL && startY < cTH && endX > cLeft && endY > cTop) {
            comp.edit = true
            edgeProps.push(comp)
          }
        }
      })

      tightenDraw(edgeProps)

      return components
    })
  }, [])

  // 计算上下左右的边界值
  const tightenDraw = useEventCallback((edgeProps) => {
    let drawPlace = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
    edgeProps.forEach(props => {
      const { left: cLeft, top: cTop, width, height } = props
      const endX = cLeft + width
      const endY = cTop + height
      drawPlace.x = drawPlace.x && drawPlace.x < cLeft ? drawPlace.x : cLeft
      drawPlace.y = drawPlace.y && drawPlace.y < cTop ? drawPlace.y : cTop
      drawPlace.width = drawPlace.width > endX ? drawPlace.width : endX
      drawPlace.height = drawPlace.height > endY ? drawPlace.height : endY
    })

    contextRef.strokeRect(drawPlace.x, drawPlace.y, drawPlace.width - drawPlace.x, drawPlace.height - drawPlace.y)
    // lowCodeHeaderRef.current.setCommands(commands => {
    //   commands = commands.slice(0)
    //   commands.push({
    //     action: strokeRect
    //   })

    //   return commands
    // })
  }, [])

  // 每个类型组件的渲染
  const renderComponents = useEventCallback((compProps: LowComponentsProps) => {
    switch (compProps.type) {
      case 'ButtonModel':
        return <ButtonModel {...compProps}/>
    }
  }, [])

  const drawLayoutRasterized = useEventCallback(() => {
  }, [])

  const selectCavanvs = useEventCallback((e) => {
    const { clientX: startX, clientY: startY } = e
    const sX = startX - edgeX
    const sY = startY - edgeY
    document.onmousemove = function(event) {
      const { clientX, clientY } = event
      contextRef.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.beginPath()
      contextRef.strokeRect(sX, sY, clientX - startX, clientY - startY)
      contextRef.strokeStyle = '#1890ff'
      contextRef.globalAlpha = 0.8
    }
    document.onmouseup = function(event) {
      const { clientX, clientY } = event
      document.onmousemove = null
      contextRef.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      contextRef.closePath()
      edgeCollision({
        startX: sX,
        startY: sY,
        endX: clientX - edgeX,
        endY: clientY - edgeY
      })
    }
  }, [])

  // 拉伸缩放更改对应model的props值
  const changeModelLayout = useEventCallback((key) => {
    setComponents((ContainerComponents) => {
      ContainerComponents.find(comp => comp.key === key)

      return ContainerComponents
    })
  }, [])

  useEffect(() => {
    const container = document.getElementsByClassName('c-layout__container')[0]
    canvasRef.current.width = container.clientWidth
    canvasRef.current.height = container.clientHeight
    canvasRef.current.addEventListener('mousedown', selectCavanvs)
    contextRef = canvasRef.current.getContext('2d')
    drawLayoutRasterized()
  }, [drawLayoutRasterized, selectCavanvs])

  return (
    <Provider.Provider value={changeModelLayout}>
      <div className="g-lowcode__layout">
        <LowCodeHeader ref={lowCodeHeaderRef}/>
        <div className="App">
          <div className="components">
            <Suspense fallback={null}>
              <ButtonModel name="按钮" key="ButtonModel" onDragEnd={drop}/>
            </Suspense>
          </div>
          <div className="c-layout__container">
            <canvas ref={canvasRef}/>
            {ContainerComponents.map(renderComponents)}
          </div>
          <div className="c-attributes__container">

          </div>
        </div>
      </div>
    </Provider.Provider>
  );
}

export default App;
