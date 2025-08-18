/**
 * @fileoverview Contacts form handling functionality
 * Handles form data extraction, validation, and processing
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Extracts and structures contact data from HTML form into standardized object
 * Uses FormData API to safely retrieve form values and creates contact data object
 * Ensures consistent data structure for Firebase storage and application use
 * @function extractContactFormData
 * @param {HTMLFormElement} form - The HTML form element containing contact input fields
 * @returns {Object} Structured contact data object with name, email, and phone properties
 * @returns {string} returns.name - Contact's full name from form input
 * @returns {string} returns.email - Contact's email address from form input
 * @returns {string} returns.phone - Contact's phone number from form input
 */
function extractContactFormData(form) {
  const formData = new FormData(form);
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };
}

/**
 * Sets up phone input filtering to allow only numeric characters, spaces, and common phone symbols
 * Applies input event listener to phone input field to filter out invalid characters
 * Provides real-time input validation for better user experience during phone number entry
 * @function setupPhoneInputFilter
 * @returns {void} No return value, attaches input event listener to phone input field
 */
function setupPhoneInputFilter() {
  const phoneInput = document.getElementById("contactPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      // Allow only numbers, spaces, +, -, (, ), and common phone formatting characters
      this.value = this.value.replace(/[^\d\s\+\-\(\)]/g, "");
    });
  }
}
