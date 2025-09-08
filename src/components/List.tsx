// återanvändbar lista komponent i React med TypeScript

import React from 'react'

export interface ListProps<T> {
  items: T[]
  keyOf: (item: T) => React.Key
  render: (item: T) => React.ReactNode
  className?: string
}

export function List<T>({ items, keyOf, render, className }: ListProps<T>) {
  return (
    <div className={className}>
      {items.map(item => (
        <div key={keyOf(item)}>
          {render(item)}
        </div>
      ))}
    </div>
  )
}

export default List