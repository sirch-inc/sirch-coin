import supabase from '../../Config/supabaseConfig'

async function Logout() {
    // TODO: handle errors here...
    const { error } = await supabase.auth.signOut()
}

export default Logout