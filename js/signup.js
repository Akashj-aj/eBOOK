const supabase = window.supabaseClient; // Import supabase

// Handle user signup
async function handleSignUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
  
    if (error) {
      console.error('Error signing up:', error.message);
      return { success: false, message: error.message };
    }
  
    return { success: true, user: user };
  }
  
  // Event listener for the signup form
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const result = await handleSignUp(email, password);
    if (result.success) {
      alert('Signup successful! Please check your email to confirm your account.');
      window.location.href = 'login.html';  // Redirect to login page
    } else {
      document.getElementById('error-message').innerText = `Error: ${result.message}`;
    }
  });
  