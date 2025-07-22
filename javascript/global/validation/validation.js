"use strict";

function validateEmail(email) {
  if (email.length < 5) return false;
  if (email.indexOf('@') === -1) return false;
  if (email.indexOf('.') === -1) return false;
  return true;
}

function validatePassword(password, minLength) {
  if (!password) return false;
  if (password.length < minLength) return false;
  return true;
}

function validateRequired(value) {
  if (!value) return false;
  if (value.trim().length === 0) return false;
  return true;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.classList.add('errorInput');
  
  const errorDiv = document.getElementById(inputId + 'Error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hide');
  }
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.classList.remove('errorInput');
  
  const errorMessage = document.getElementById(inputId + 'Error');
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('hide');
  }
}

function clearAllErrors(formElement) {
  const inputs = formElement.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    clearError(inputs[i].id);
  }
}

function initPasswordToggle(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector('img');
  
  if (!input || !icon) return;
  
  input.setAttribute('data-visible', 'false');
  input.style.webkitTextSecurity = 'disc';
  
  input.addEventListener('input', function() {
    updatePasswordIcon(inputId);
  });
  
  icon.addEventListener('click', function() {
    togglePasswordVisibility(inputId);
  });
  
  updatePasswordIcon(inputId);
}

function updatePasswordIcon(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector('img');
  
  if (!input || !icon) return;
  
  if (input.value.length > 0) {
    const isVisible = input.getAttribute('data-visible') === 'true';
    
    if (isVisible) {
      icon.src = '../assets/icons/login/visibility.svg';
      icon.alt = 'Hide password';
    } else {
      icon.src = '../assets/icons/login/visibilityoff.svg';
      icon.alt = 'Show password';
    }
    icon.style.cursor = 'pointer';
  } else {
    icon.src = '../assets/icons/login/lock.png';
    icon.alt = 'lock';
    icon.style.cursor = 'default';
  }
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector('img');
  
  if (!input || !icon || input.value.length === 0) return;
  
  const isCurrentlyVisible = input.getAttribute('data-visible') === 'true';
  
  if (isCurrentlyVisible) {
    input.style.webkitTextSecurity = 'disc';
    input.setAttribute('data-visible', 'false');
    icon.src = '../assets/icons/login/visibilityoff.svg';
    icon.alt = 'Show password';
  } else {
    input.style.webkitTextSecurity = 'none';
    input.setAttribute('data-visible', 'true');
    icon.src = '../assets/icons/login/visibility.svg';
    icon.alt = 'Hide password';
  }
}

function initAllPasswordToggles() {
  const passwordIds = ['password', 'confirmPassword'];
  
  for (let i = 0; i < passwordIds.length; i++) {
    const input = document.getElementById(passwordIds[i]);
    if (input) {
      initPasswordToggle(passwordIds[i]);
    }
  }
}