"use strict";

function validateLoginForm() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementsByClassName('errorMessage')[0];
  
  if (!emailInput || !passwordInput || !errorMessage) return false;
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  let isValid = true;
  
  emailInput.classList.remove('errorInput');
  passwordInput.classList.remove('errorInput');
  errorMessage.classList.add('hide');
  
  if (!validateRequired(email) || !validateEmail(email) || 
      !validateRequired(password) || !validatePassword(password, 6)) {
    
    emailInput.classList.add('errorInput');
    passwordInput.classList.add('errorInput');
    
    errorMessage.textContent = 'Check your email and password. Please try again.';
    errorMessage.classList.remove('hide');
    isValid = false;
  }
  
  return isValid;
}

async function loginUser(event) {
  event.preventDefault();
  
  if (!validateLoginForm()) {
    return;
  }
  
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  try {
    const loginResult = await checkUserCredentials(email, password);
    
    if (!loginResult.success) {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementsByClassName('errorMessage')[0];
      
      emailInput.classList.add('errorInput');
      passwordInput.classList.add('errorInput');
      errorMessage.textContent = 'Check your email and password. Please try again.';
      errorMessage.classList.remove('hide');
      return;
    }
    
    setUserLogin(loginResult.user);
    
  } catch (error) {
    const errorMessage = document.getElementsByClassName('errorMessage')[0];
    errorMessage.textContent = 'An error occurred. Please try again.';
    errorMessage.classList.remove('hide');
    console.error('Login Fehler:', error);
  }
}