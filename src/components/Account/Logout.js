import supabase from '../App/supabaseProvider'


async function Logout() {
  // TODO: wrap in try-catch
  const { error } = await supabase.auth.signOut();

  if (error) {
   // TODO: surface errors here...
    return;
  }
}

export default Logout