declare module '*.png'
declare module '*.jpg'

declare interface LowComponentsProps {
  key: string,
  type?: string,
  compKey?: string,
  name?: string | number,
  left?: string,
  top?: string,
  locked?: boolean,
  edit?: boolean, // 是否可以编辑
  styles?: React.CSSProperties,
  width?: number | string,
  height?: number | string,
  onDragEnd?: (e, ...rest?) => void
  onDragStart?: (e, ...rest?) => void
}
