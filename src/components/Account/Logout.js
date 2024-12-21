import supabase from '../App/supabaseProvider'
// import { useNavigate } from 'react-router-dom';


async function Logout() {
  // TODO: wrap in try-catch
  // const navigate = useNavigate();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error);
    }
  } catch (exception) {
    console.error("An exception occurred:", exception.message);

    // navigate('/error', { replace: true });
  }
}

export default Logout