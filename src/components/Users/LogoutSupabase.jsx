

async function signOut({supabase}){
    const { error } = await supabase.auth.signOut()
}

export default signOut