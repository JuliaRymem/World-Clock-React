// Header rubrik + knapp
interface HeaderProps {
  onAdd: () => void
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="header header--center">
      <h1 className="title title--xl">World Clock</h1>
      <button className="btn btn-primary header__add" onClick={onAdd}>
        Vill du lägga till en stad?
      </button>
    </header>
  )
}

export default Header