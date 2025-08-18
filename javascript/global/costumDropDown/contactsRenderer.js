/**
 * Contact dropdown rendering and template processing
 * Handles HTML generation and display logic for contact items
 */

/**
 * Determines if a contact is the current user for display purposes
 * Checks if contact matches current user ID and type for special labeling
 * @function isContactCurrentUser
 * @param {Object} contact - Contact object to check
 * @param {Object} currentUser - Current user object
 * @returns {boolean} True if contact is current user, false otherwise
 */
function isContactCurrentUser(contact, currentUser) {
  return currentUser.type === "registered" && contact.id === currentUser.id;
}

/**
 * Generates display name for contact with current user indication
 * Adds "(You)" suffix to current user's name for better identification
 * @function generateContactDisplayName
 * @param {Object} contact - Contact object with name property
 * @param {boolean} isCurrentUser - Whether this contact is the current user
 * @returns {string} Display name with optional "(You)" suffix
 */
function generateContactDisplayName(contact, isCurrentUser) {
  return isCurrentUser ? `${contact.name} (You)` : contact.name;
}

/**
 * Processes a single contact and generates its HTML representation
 * Creates template data for one contact including all display properties
 * @function processContactForTemplate
 * @param {Object} contact - Contact object to process
 * @param {Object} currentUser - Current user object for comparison
 * @returns {string} HTML string for the contact item
 */
function processContactForTemplate(contact, currentUser) {
  const initials = getInitials(contact.name);
  const avatarColor = getAvatarColor(contact.name);
  const isCurrentUser = isContactCurrentUser(contact, currentUser);
  const displayName = generateContactDisplayName(contact, isCurrentUser);

  return generateContactItemTemplate(
    contact,
    initials,
    avatarColor,
    displayName
  );
}

/**
 * Generates HTML for all contacts using template functions
 * Processes each contact and combines their HTML representations
 * @function generateContactsListHtml
 * @param {Array} contacts - Array of contact objects to render
 * @returns {string} Complete HTML string for all contacts
 */
function generateContactsListHtml(contacts) {
  const currentUser = getCurrentUser();
  let html = "";

  for (let i = 0; i < contacts.length; i++) {
    html += processContactForTemplate(contacts[i], currentUser);
  }

  return html;
}

/**
 * Renders contacts dropdown HTML with avatars and checkboxes for selection
 * Creates interactive contact list using template functions and sets up events
 * @function renderContactsDropdown
 * @param {Array} contacts - Array of contact objects to render
 * @returns {void}
 */
function renderContactsDropdown(contacts) {
  const contactsList = document.getElementById("contactsDropdownList");
  if (!contactsList) return;

  const html = generateContactsListHtml(contacts);
  contactsList.innerHTML = html;
  setupContactCheckboxes();
}
