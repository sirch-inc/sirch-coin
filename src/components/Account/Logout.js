import supabase from '../../pages/Main/App/supabaseProvider';


async function Logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error);
    }

    return { success: true };
  } catch (exception) {
    console.error("An exception occurred:", exception.message);

    return { success: false, message: exception.message }
  }
}

export default Logout;