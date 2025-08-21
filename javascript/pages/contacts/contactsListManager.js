/**
 * @fileoverview Contacts list management functionality
 * Handles contact list rendering, sorting, validation, and HTML generation
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Renders the complete contacts list with alphabetical separators in the DOM
 * Validates input data, sorts contacts alphabetically, and generates HTML with letter separators
 * Updates the contactsList element in the DOM with the generated HTML
 * @function renderContactsList
 * @param {Array<Object>} contacts - Array of contact objects with at minimum a 'name' property
 * @param {string} contacts[].name - Contact's full name (required for sorting and display)
 * @param {string} contacts[].id - Unique identifier for the contact
 * @param {string} [contacts[].email] - Contact's email address
 * @param {string} [contacts[].phone] - Contact's phone number
 * @returns {void} No return value, directly manipulates DOM
 */
function renderContactsList(contacts) {
  const contactsList = document.getElementById("contactsList");
  if (!contactsList) return;
  const validContacts = validateAndFilterContacts(contacts);
  const sortedContacts = sortContactsAlphabetically(validContacts);
  const html = generateContactsHTML(sortedContacts);
  contactsList.innerHTML = html;
}

/**
 * Validates and filters contacts array to ensure data integrity
 * Filters out null, undefined contacts and contacts without names
 * Handles edge cases like null input or non-array input gracefully
 * @function validateAndFilterContacts
 * @param {Array<Object>|null|undefined} contacts - Array of contact objects to validate, can be null/undefined
 * @returns {Array<Object>} Array of valid contact objects that have a truthy 'name' property, empty array if input invalid
 */
function validateAndFilterContacts(contacts) {
  if (!contacts || !Array.isArray(contacts)) {
    return [];
  }
  return contacts.filter((contact) => contact && contact.name);
}

/**
 * Sorts contacts alphabetically by name using locale-aware comparison
 * Uses JavaScript's localeCompare for proper international character sorting
 * Modifies the original array in place and returns it for chaining
 * @function sortContactsAlphabetically
 * @param {Array<Object>} contacts - Array of contact objects to sort, each must have a 'name' property
 * @param {string} contacts[].name - Contact's name used for alphabetical sorting
 * @returns {Array<Object>} The same array reference, now sorted alphabetically by name
 */
function sortContactsAlphabetically(contacts) {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generates complete HTML string for contacts list with alphabetical letter separators
 * Creates visual separators (A, B, C, etc.) when the first letter of contact names changes
 * Uses enhanced render data for each contact to generate individual HTML
 * @function generateContactsHTML
 * @param {Array<Object>} contacts - Array of sorted contact objects
 * @param {string} contacts[].name - Contact's name, first letter used for separator logic
 * @returns {string} Complete HTML string ready to be inserted into DOM, includes all contacts and separators
 */
function generateContactsHTML(contacts) {
  let currentLetter = "";
  let html = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const contactData = getContactRenderData(contact);
    const firstLetter = contactData.letter;
    const showSeparator = firstLetter !== currentLetter;

    if (showSeparator) {
      currentLetter = firstLetter;
    }

    html += getContactWithSeparator(contactData, showSeparator, firstLetter);
  }
  return html;
}
