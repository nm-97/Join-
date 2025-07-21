"use strict";

function validateSignupForm() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const errorMessage = document.getElementsByClassName('errorMessage')[0];
  
  if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !termsCheckbox || !errorMessage) return false;
  
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  let isValid = true;
  let errorText = '';
  
  nameInput.classList.remove('errorInput');
  emailInput.classList.remove('errorInput');
  passwordInput.classList.remove('errorInput');
  confirmPasswordInput.classList.remove('errorInput');
  errorMessage.classList.add('hide');
  
  if (!validateRequired(name)) {
    nameInput.classList.add('errorInput');
    errorText = 'Please enter your name.';
    isValid = false;
  }
  
  if (!validateRequired(email)) {
    emailInput.classList.add('errorInput');
    if (!errorText) errorText = 'Please enter an email address.';
    isValid = false;
  } else if (!validateEmail(email)) {
    emailInput.classList.add('errorInput');
    if (!errorText) errorText = 'Please enter a valid email address.';
    isValid = false;
  }
  
  if (!validateRequired(password)) {
    passwordInput.classList.add('errorInput');
    if (!errorText) errorText = 'Please enter a password.';
    isValid = false;
  } else if (!validatePassword(password, 6)) {
    passwordInput.classList.add('errorInput');
    if (!errorText) errorText = 'Password must be at least 6 characters long.';
    isValid = false;
  }
  
  if (!validateRequired(confirmPassword)) {
    confirmPasswordInput.classList.add('errorInput');
    if (!errorText) errorText = 'Please confirm your password.';
    isValid = false;
  } else if (password !== confirmPassword) {
    passwordInput.classList.add('errorInput');
    confirmPasswordInput.classList.add('errorInput');
    if (!errorText) errorText = 'Passwords do not match.';
    isValid = false;
  }
  
  if (!termsCheckbox.checked) {
    if (!errorText) errorText = 'Please accept the Privacy Policy.';
    isValid = false;
  }
  
  if (!isValid) {
    errorMessage.textContent = errorText;
    errorMessage.classList.remove('hide');
  }
  
  return isValid;
}

async function signupUser(event) {
  event.preventDefault();
  
  if (!validateSignupForm()) {
    return;
  }
  
  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  try {
    const signupResult = await createUser(userData);
    
    if (!signupResult.success) {
      const emailInput = document.getElementById('email');
      const errorMessage = document.getElementsByClassName('errorMessage')[0];
      
      emailInput.classList.add('errorInput');
      errorMessage.textContent = 'This email address is already registered.';
      errorMessage.classList.remove('hide');
      return;
    }
    
    const errorMessage = document.getElementsByClassName('errorMessage')[0];
    errorMessage.textContent = 'Registration successful! You can now log in.';
    errorMessage.style.color = '#4CAF50';
    errorMessage.classList.remove('hide');
    
    setTimeout(() => {
      window.location.href = '../html/index.html';
    }, 2000);
    
  } catch (error) {
    const errorMessage = document.getElementsByClassName('errorMessage')[0];
    errorMessage.textContent = 'An error occurred. Please try again.';
    errorMessage.classList.remove('hide');
    console.error('SignUp Fehler:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initAllPasswordToggles();
});