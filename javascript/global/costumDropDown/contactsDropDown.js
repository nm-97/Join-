/**
 * Contact dropdown management and initialization
 * Handles contact loading, user management, and dropdown setup
 */

/** @type {Array} Array to store all loaded contacts */
let allContacts = [];

/**
 * Creates a contact object from current user data for dropdown inclusion
 * Builds contact structure with user information for consistent data format
 * @function createCurrentUserContact
 * @param {Object} currentUser - Current user object with id, name, email
 * @returns {Object} Contact object formatted for dropdown usage
 */
function createCurrentUserContact(currentUser) {
  return {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    phone: "",
    address: "",
  };
}

/**
 * Checks if current user is already present in contacts array
 * Performs ID-based lookup to prevent duplicate user entries
 * @function isCurrentUserInContacts
 * @param {Array} contacts - Array of contact objects to search
 * @param {Object} currentUser - Current user object with id property
 * @returns {boolean} True if user is already in contacts, false otherwise
 */
function isCurrentUserInContacts(contacts, currentUser) {
  return contacts.some((contact) => contact.id === currentUser.id);
}

/**
 * Adds current user to contacts array if not already present
 * Ensures current user appears in contacts dropdown for self-assignment
 * @function addCurrentUserToContacts
 * @param {Array} contacts - Array of contact objects to modify
 * @param {Object} currentUser - Current user object
 * @returns {Array} Updated contacts array with current user included
 */
function addCurrentUserToContacts(contacts, currentUser) {
  if (currentUser.type !== "registered") {
    return contacts;
  }
  if (!isCurrentUserInContacts(contacts, currentUser)) {
    const currentUserContact = createCurrentUserContact(currentUser);
    contacts.unshift(currentUserContact);
  }
  return contacts;
}

/**
 * Initializes the contacts dropdown component with all required setup
 * Orchestrates dropdown initialization including render and event setup
 * @function initializeContactsDropdown
 * @param {Array} contacts - Array of contact objects to display
 * @returns {void}
 */
function initializeContactsDropdown(contacts) {
  allContacts = contacts;
  renderContactsDropdown(allContacts);
  setupDropdownEvents("customDropdown", "dropdownInput", "dropdownArrow");
}

/**
 * Loads contacts from the database and sets up the contacts dropdown component
 * Main entry point for contacts dropdown initialization with error handling
 * @async
 * @function loadContacts
 * @returns {Promise<void>} Promise that resolves when contacts are loaded and dropdown is ready
 */
async function loadContacts() {
  try {
    let contacts = await fetchContactsByIdAndUser();
    const currentUser = getCurrentUser();
    contacts = addCurrentUserToContacts(contacts, currentUser);
    initializeContactsDropdown(contacts);
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}
