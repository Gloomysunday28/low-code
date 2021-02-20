import React, { useState, lazy, Suspense} from 'react'
import './App.css';
import { useEventCallback } from '@/hooks'

const ButtonModel = lazy(() => import(`./Components/ButtonModel`))

function App() {
  const [ContainerComponents, setComponents] = useState<Array<LowComponentsProps>>([])
  const drop = (e, type: string) => {
    const { clientX, clientY } = e
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
              left: `${clientX - 240}px`,
              top: `${clientY - 20}px`
            },
            onDragEnd: dropExist
          })
          break
        default:
          break
      }
      return components
    })
  }

  const dropExist = (e: React.MouseEvent<HTMLDivElement>, type, key) => {
    const { clientX, clientY } = e
    setComponents((components) => {
      components = components.slice(0)
      console.log('key', key)
      const existComponent = components.find(comp => comp.key === key)
      console.log('existComponent', existComponent)
      if (existComponent) {
        existComponent.styles = {
          ...existComponent.styles,
          left: `${clientX - 240}px`,
          top: `${clientY - 20}px`
        }
      }

      return components
    })
  }

  const renderComponents = useEventCallback((compProps: LowComponentsProps) => {
    switch (compProps.type) {
      case 'ButtonModel':
        return <ButtonModel {...compProps}/>
    }
  }, [])

  return (
    <div className="App">
      <div className="components">
        <Suspense fallback={null}>
          <ButtonModel name="按钮" key="ButtonModel" onDragEnd={drop}/>
        </Suspense>
      </div>
      <div className="container">
        {ContainerComponents.map(renderComponents)}
      </div>
    </div>
  );
}

export default App;
