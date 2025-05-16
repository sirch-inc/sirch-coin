import NavBar from '../NavBar/NavBar';
import './Header.css';
import { SupabaseClient } from '@supabase/supabase-js';

interface HeaderProps {
  supabase: SupabaseClient;
}

export default function Header({ supabase }: HeaderProps) {
  return (
    <header>
      <NavBar supabase={supabase}/>
    </header>
  );
}