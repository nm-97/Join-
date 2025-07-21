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