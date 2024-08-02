import supabase from '../App/supabaseConfig'


async function Logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
  // TODO: surface errors here...
  }
}

export default Logout