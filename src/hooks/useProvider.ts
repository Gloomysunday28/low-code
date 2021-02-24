import React, { useContext } from 'react'
import Provider from '@/context'

export default function useProvider() {
  const context = useContext(Provider)
  return context
}