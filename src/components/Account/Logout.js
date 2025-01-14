import supabase from '../App/supabaseProvider';


async function Logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error);
    }
  } catch (exception) {
    console.error("An exception occurred:", exception.message);
  }
}

export default Logout;