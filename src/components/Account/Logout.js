import supabase from '../App/supabaseProvider'
// import { useNavigate } from 'react-router-dom';


async function Logout() {
  // const navigate = useNavigate();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error);
    }
  } catch (exception) {
    console.error(exception);

    // navigate('/error', { replace: true });
  }
}

export default Logout