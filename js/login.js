// Handle user login
const supabase = window.supabaseClient;
async function handleLogin(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
  
    if (error) {
      console.error('Error logging in:', error.message);
      return { success: false, message: error.message };
    }
  
    return { success: true, user: user };
  }
  
  // Event listener for the login form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const result = await handleLogin(email, password);
    if (result.success) {
      alert('Login successful!');
      window.location.href = 'homepage.html'; 
    } else {
      document.getElementById('error-message').innerText = `Error: ${result.message}`;
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.querySelector('.auth-container').classList.add('scale-in');
    }, 200);
  });