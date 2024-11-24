import supabase from '../App/supabaseProvider'


async function Logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
   // TODO: surface errors here...
    return;
  }
}

export default Logout