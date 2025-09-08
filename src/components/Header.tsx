// Header rubrik + knapp
import React from 'react'

interface HeaderProps {
  onAdd: () => void
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="header header--center">
      <h1 className="title title--xl">World Clock</h1>
      <button className="btn btn-primary header__add" onClick={onAdd}>
        + Lägg till stad
      </button>
    </header>
  )
}

export default Header