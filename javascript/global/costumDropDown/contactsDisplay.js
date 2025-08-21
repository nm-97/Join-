/**
 * Contact display management and visual feedback
 * Handles selected contact avatars and overflow indicators
 */

/**
 * Generates HTML for contacts within display limit using template functions
 * Creates avatar elements for each contact up to the maximum display count
 * @function generateContactAvatarsHtml
 * @param {Array} contactsToShow - Array of contacts to display as avatars
 * @returns {string} HTML string containing all contact avatar elements
 */
function generateContactAvatarsHtml(contactsToShow) {
  let html = "";
  for (let i = 0; i < contactsToShow.length; i++) {
    const contact = contactsToShow[i];
    const initials = getInitials(contact.name);
    const avatarColor = getAvatarColor(contact.name);
    html += generateSelectedContactAvatarTemplate(
      contact,
      initials,
      avatarColor
    );
  }
  return html;
}

/**
 * Generates HTML for overflow indicator when more contacts are selected than can be displayed
 * Creates "+X more" indicator element for additional selected contacts
 * @function generateOverflowHtml
 * @param {number} totalContacts - Total number of selected contacts
 * @param {number} maxDisplay - Maximum number of contacts to display
 * @returns {string} HTML string for overflow indicator or empty string if no overflow
 */
function generateOverflowHtml(totalContacts, maxDisplay) {
  if (totalContacts <= maxDisplay) {
    return "";
  }
  const remaining = totalContacts - maxDisplay;
  return generateOverflowIndicatorTemplate(remaining);
}

/**
 * Updates the visual display of selected contacts as avatar badges with overflow handling
 * Shows up to 5 contacts with avatars and displays "+X more" indicator for additional selections
 * @function updateSelectedContactsDisplay
 * @returns {void}
 */
function updateSelectedContactsDisplay() {
  const displayContainer = document.getElementById("selectedContactsDisplay");
  if (!displayContainer) return;
  if (selectedContacts.length === 0) {
    displayContainer.innerHTML = "";
    return;
  }
  const maxDisplay = 5;
  const contactsToShow = selectedContacts.slice(0, maxDisplay);
  const contactAvatarsHtml = generateContactAvatarsHtml(contactsToShow);
  const overflowHtml = generateOverflowHtml(
    selectedContacts.length,
    maxDisplay
  );
  displayContainer.innerHTML = contactAvatarsHtml + overflowHtml;
}
