import supabase from '../Config/supabaseConfig'


async function signOut(){
    const { error } = await supabase.auth.signOut()
}

export default signOut