import NavBar from '../NavBar/NavBar';
import './Header.css';


// TODO: remove this?
export default function Header({ supabase }) {
  return (
    <header>
      <NavBar supabase={supabase}/>
    </header>
  );
}