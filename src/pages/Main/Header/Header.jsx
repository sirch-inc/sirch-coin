import NavBar from '../NavBar';
import './Header.css';


// TODO: remove this?
export default function Header({ supabase }) {
  return (
    <header>
      <NavBar supabase={supabase}/>
    </header>
  );
}