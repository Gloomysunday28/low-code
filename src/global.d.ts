declare module '*.png'
declare module '*.jpg'

declare interface LowComponentsProps {
  key: string,
  type?: string,
  compKey?: string,
  name?: string | number,
  locked?: boolean,
  styles?: React.CSSProperties,
  onDragEnd?: (e, ...rest?) => void
}
