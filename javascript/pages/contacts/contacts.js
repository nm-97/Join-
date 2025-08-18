/**
 * @fileoverview Contacts page main controller for the JOIN application
 * Coordinates contact initialization and module orchestration
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Initializes contacts page when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("contacts.html")) {
    initializeContacts();
  }
});

/**
 * Handles session storage contact overlay on page load
 * Shows floating contact overlay if contact ID is found in session storage
 */
window.addEventListener("load", async () => {
  const contactIdForOverlay = sessionStorage.getItem("contactIdForOverlay");
  if (contactIdForOverlay) {
    const contact = await fetchContactByIdAndUser(contactIdForOverlay);
    if (contact) {
      showFloatingContactForResponsive(contact);
    }
    sessionStorage.removeItem("contactIdForOverlay");
  }
});
