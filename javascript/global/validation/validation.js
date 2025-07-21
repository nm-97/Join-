"use strict";

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validatePassword(password, minLength = 6) {
  return password && password.length >= minLength;
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.classList.add('errorInput');
  
  clearError(inputId);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'errorMessage';
  errorDiv.textContent = message;
  errorDiv.id = inputId + 'Error';
  
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.classList.remove('errorInput');
  
  const errorMessage = document.getElementById(inputId + 'Error');
  if (errorMessage) {
    errorMessage.remove();
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
  let icon = input ? input.parentNode.querySelector('img') : null;
  
  if (!icon && input) {
    icon = input.parentNode.parentNode.querySelector('img');
  }
  
  if (!input || !icon) return;
  
  input.dataset.passwordVisible = 'false';
  input.style.webkitTextSecurity = 'disc';
  
  input.addEventListener('input', function() {
    updatePasswordIcon(inputId);
  });
  
  icon.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    togglePasswordVisibility(inputId);
  });
  
  updatePasswordIcon(inputId);
}

function updatePasswordIcon(inputId) {
  const input = document.getElementById(inputId);
  let icon = input ? input.parentNode.querySelector('img') : null;
  
  if (!icon && input) {
    icon = input.parentNode.parentNode.querySelector('img');
  }
  
  if (!input || !icon) return;
  
  const hasValue = input.value.length > 0;
  
  if (hasValue) {
    const isVisible = input.dataset.passwordVisible === 'true';
    
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
  let icon = input ? input.parentNode.querySelector('img') : null;
  
  if (!icon && input) {
    icon = input.parentNode.parentNode.querySelector('img');
  }
  
  if (!input || !icon || input.value.length === 0) return;
  
  const isCurrentlyVisible = input.dataset.passwordVisible === 'true';
  
  if (isCurrentlyVisible) {
    input.style.webkitTextSecurity = 'disc';
    input.dataset.passwordVisible = 'false';
    icon.src = '../assets/icons/login/visibilityoff.svg';
    icon.alt = 'Show password';
  } else {
    input.style.webkitTextSecurity = 'none';
    input.dataset.passwordVisible = 'true';
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