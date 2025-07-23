"use strict";

function validateContactForm() {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const errorMessage = document.getElementsByClassName('errorMessage')[0];
  
  if (!nameInput || !emailInput || !phoneInput || !errorMessage) return false;
  
  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  
  clearContactErrors();
  
  const validationResult = checkAllContactFields(name, email, phone);
  
  if (!validationResult.isValid) {
    markContactErrorInputs(name, email, phone);
    showContactError(validationResult.errorText);
    return false;
  }
  
  return true;
}

function checkAllContactFields(name, email, phone) {
  if (!validateRequired(name)) {
    return { isValid: false, errorText: 'Please enter a name.' };
  }
  
  if (email && !validateEmail(email)) {
    return { isValid: false, errorText: 'Please enter a valid email address.' };
  }
  
  if (phone && !validatePhone(phone)) {
    return { isValid: false, errorText: 'Phone number is too long or contains invalid characters.' };
  }
  
  return { isValid: true };
}

function validatePhone(phone) {
  if (phone.length > 15) return false;
  
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
}

function markContactErrorInputs(name, email, phone) {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  
  if (!validateRequired(name)) {
    nameInput.classList.add('errorInput');
  }
  
  if (email && !validateEmail(email)) {
    emailInput.classList.add('errorInput');
  }
  
  if (phone && !validatePhone(phone)) {
    phoneInput.classList.add('errorInput');
  }
}

function clearContactErrors() {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const errorMessage = document.getElementsByClassName('errorMessage')[0];
  
  if (nameInput) nameInput.classList.remove('errorInput');
  if (emailInput) emailInput.classList.remove('errorInput');
  if (phoneInput) phoneInput.classList.remove('errorInput');
  if (errorMessage) errorMessage.classList.add('hide');
}

function showContactError(text) {
  const errorMessage = document.getElementsByClassName('errorMessage')[0];
  if (errorMessage) {
    errorMessage.textContent = text;
    errorMessage.classList.remove('hide');
  }
}

function setupPhoneInputFilter() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]');
  
  for (let i = 0; i < phoneInputs.length; i++) {
    const phoneInput = phoneInputs[i];
    
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value;
      let filteredValue = value.replace(/[^0-9+\-\s()]/g, '');
      
      if (value !== filteredValue) {
        e.target.value = filteredValue;
      }
    });
  }
}