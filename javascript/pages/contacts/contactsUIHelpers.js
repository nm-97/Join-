/**
 * @fileoverview Contacts UI helper functions
 * Handles UI state management, visual feedback, and utility functions
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Determines if the current device is mobile based on screen width
 * @function isMobileDevice
 * @returns {boolean} True if screen width is 428px or less, false otherwise
 */
function isMobileDevice() {
  return window.innerWidth <= 428;
}

/**
 * Determines if the current device is in tablet/mobile view
 * @function isTabletOrMobile
 * @returns {boolean} True if screen width is 1024px or less, false otherwise
 */
function isTabletOrMobile() {
  return window.innerWidth <= 1024;
}

/**
 * Generates contact template with enhanced rendering data
 * @function getContactRenderData
 * @param {Object} contact - The contact object
 * @returns {Object} Enhanced contact data with initials and color
 */
function getContactRenderData(contact) {
  return {
    ...contact,
    initials: getInitials(contact.name),
    color: getAvatarColor(contact.name),
    letter: contact.name.charAt(0).toUpperCase(),
  };
}

/**
 * Determines mobile header configuration for floating contact
 * @function getMobileHeaderConfig
 * @param {boolean} isMobile - Force mobile mode
 * @returns {Object} Configuration for mobile header display
 */
function getMobileHeaderConfig(isMobile = false) {
  return {
    shouldShow: isMobile || isTabletOrMobile(),
    isTabletOrMobile: isTabletOrMobile(),
  };
}

/**
 * Selects a contact item in the UI and manages selection state
 * Removes 'selected' class from previously selected contact and applies it to new contact
 * Provides visual feedback for currently active contact in the list
 * @function selectContactItem
 * @param {string} contactId - Unique identifier of the contact to select, must match element ID
 * @returns {void} No return value, manipulates CSS classes for visual selection state
 */
function selectContactItem(contactId) {
  const previousSelected = document.querySelector(".contactItem.selected");
  if (previousSelected) {
    previousSelected.classList.remove("selected");
  }
  const contactItem = document.getElementById(contactId);
  if (contactItem) {
    contactItem.classList.add("selected");
  }
}

/**
 * Updates the contacts list UI after data changes (creation, update, deletion)
 * Closes any open floating overlays, fetches fresh data, and re-renders contact list
 * Ensures UI reflects current state after any contact modification operations
 * @async
 * @function updateContactsUI
 * @throws {Error} When Firebase fetch or UI rendering operations fail
 * @returns {Promise<void>} Promise that resolves when contacts list UI is fully updated
 */
async function updateContactsUI() {
  closeFloatingContactOverlay();
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
  const contactsList = document.getElementById("contactsList");
  if (contactsList) {
    contactsList.style.display = "block";
  }
  const addContactButton = document.getElementById("addContactButton");
  if (addContactButton) {
    addContactButton.style.display = "flex";
    addContactButton.classList.remove("floating-hidden");
  }
}

/**
 * Displays a temporary success message notification to provide user feedback
 * Creates and shows success message element for 3 seconds, then automatically removes it
 * Uses template function to generate consistent message styling and behavior
 * @function showSuccessMessage
 * @param {string} message - The success message text to display to the user
 * @returns {void} No return value, creates temporary DOM element with auto-removal
 */
function showSuccessMessage(message) {
  const successElement = document.createElement("div");
  successElement.innerHTML = getSuccessContactMessageTemplate({ message });
  document.body.appendChild(successElement);
  setTimeout(() => {
    if (document.body.contains(successElement)) {
      document.body.removeChild(successElement);
    }
  }, 3000);
}

/**
 * Determines if floating contact overlay is currently visible to the user
 * Checks both element existence and CSS display property to confirm visibility state
 * Used to optimize performance by avoiding unnecessary overlay updates
 * @function isFloatingContactVisible
 * @param {HTMLElement|null} container - The floating contact overlay DOM element
 * @returns {boolean} True if container exists and has display:block style, false otherwise
 */
function isFloatingContactVisible(container) {
  return container && container.style.display === "block";
}

/**
 * Retrieves the unique identifier of the currently selected/displayed contact
 * Searches DOM for contact item with 'selected' CSS class and extracts its data attribute
 * Returns null if no contact is currently selected in the UI
 * @function getCurrentlyDisplayedContactId
 * @returns {string|null} Contact ID from data-contact-id attribute, or null if none selected
 */
function getCurrentlyDisplayedContactId() {
  const currentContactElement = document.querySelector(".contactItem.selected");
  return currentContactElement
    ? currentContactElement.getAttribute("data-contact-id")
    : null;
}

/**
 * Checks if the current device is mobile based on screen width
 * Uses 1024px breakpoint to determine mobile vs desktop layout
 * Provides consistent device detection across the contacts functionality
 * @function isMobileDevice
 * @returns {boolean} True if screen width is 1024px or less, false otherwise
 */
function isMobileDevice() {
  return window.innerWidth <= 1024;
}
