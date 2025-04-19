// Handle user sign-in
async function handleSignIn(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
  
    if (error) {
      console.error('Error signing in:', error.message);
      return null;
    }
  
    return user;
  }
  
  // Handle user sign-up
  async function handleSignUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
  
    if (error) {
      console.error('Error signing up:', error.message);
      return null;
    }
  
    return user;
  }
  
  // Get the current logged-in user
  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  