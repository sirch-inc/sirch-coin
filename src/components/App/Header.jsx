import NavBar from './NavBar';


// TODO: remove this?
export default function Header({ supabase }) {
  return (
    <header>
      <NavBar supabase={supabase}/>
    </header>
  );
}