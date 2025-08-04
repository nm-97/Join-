/**
 * @fileoverview Contacts page functionality for the JOIN application
 * Handles contact management, display, creation, editing, and deletion
 * @author Join Project Team
 * @version 1.0.0
 */

let loadedContacts = [];

/**
 * Initializes contacts page when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("contacts.html")) {
    initializeContacts();
  }
});

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

/**
 * Handles window resize events to properly manage floating contact overlay positioning
 */
window.addEventListener("resize", () => {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );

  if (floatingContactContainer && floatingContactContainer.innerHTML) {
    // If there's content in the floating overlay, handle the resize
    handleFloatingOverlayResize();
  }
});

function handleFloatingOverlayResize() {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (!floatingContactContainer || !floatingContactContainer.innerHTML) return;

  const isMobile = isMobileDevice();
  const contactsList = document.getElementById("contactsList");
  const addContactButton = document.getElementById("addContactButton");
  const contactsMainContent = document.getElementById("contactsMainContent");
  const contactsRightPanel = document.getElementById("contactsRightPanel");

  if (isMobile) {
    configureMobileFloatingContact(
      floatingContactContainer,
      contactsList,
      addContactButton,
      contactsMainContent
    );
  } else {
    configureDesktopFloatingContact(
      floatingContactContainer,
      contactsList,
      addContactButton,
      contactsRightPanel
    );
  }
}

/**
 * Initializes the contacts page by fetching and rendering contacts
 */
async function initializeContacts() {
  try {
    const contacts = await fetchContactsByIdAndUser();
    loadedContacts = contacts;
    renderContactsList(contacts);
  } catch (error) {
    console.error("Error initializing contacts:", error);
  }
}

/**
 * Renders the contacts list with alphabetical separators
 * @param {Array} contacts - Array of contact objects to render
 */
function renderContactsList(contacts) {
  const contactsList = document.getElementById("contactsList");
  if (!contactsList) return;
  if (!contacts || !Array.isArray(contacts)) {
    contacts = [];
  }
  const validContacts = contacts.filter((contact) => contact && contact.name);
  const sortedContacts = validContacts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  let currentLetter = "";
  let html = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const showSeparator = firstLetter !== currentLetter;
    if (showSeparator) {
      currentLetter = firstLetter;
    }
    html += getContactWithSeparator(contact, showSeparator);
  }
  contactsList.innerHTML = html;
}

/**
 * Displays a contact in the floating overlay
 * @param {string} contactId - The ID of the contact to display
 */
async function showFloatingContact(contactId) {
  let contact = loadedContacts.find((c) => c.id === contactId);
  if (!contact) {
    contact = await fetchContactByIdAndUser(contactId);
  }
  if (!contact) return;
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.innerHTML = getFloatingContact(contact);
    floatingContactContainer.style.display = "block";
  }
}

function handleContactClick(contactId) {
  if (isMobileDevice()) {
    const contact = loadedContacts.find((c) => c.id === contactId);
    if (contact) {
      showFloatingContactForResponsive(contact);
    }
  } else {
    showFloatingContact(contactId);
  }
}

/**
 * Configures the floating contact overlay for mobile view
 * @param {HTMLElement} floatingContactContainer - The floating overlay container
 * @param {HTMLElement} contactsList - The contacts list element
 * @param {HTMLElement} addContactButton - The add contact button
 * @param {HTMLElement} contactsMainContent - The main content container (unused, can be null)
 */
function configureMobileFloatingContact(
  floatingContactContainer,
  contactsList,
  addContactButton,
  contactsMainContent
) {
  // Hide contacts list and add button in mobile view
  if (contactsList) contactsList.style.display = "none";
  if (addContactButton) {
    addContactButton.style.display = "none";
    addContactButton.classList.add("floating-hidden");
  }

  // Add class to body for additional targeting
  document.body.classList.add("floating-overlay-open");

  // Move overlay to body for mobile (fullscreen)
  document.body.appendChild(floatingContactContainer);

  // Add CSS class for mobile fullscreen behavior
  floatingContactContainer.classList.add("mobile-fullscreen");
  floatingContactContainer.classList.remove("desktop-mode");

  console.log("Overlay configured for mobile with CSS classes");
}

function configureDesktopFloatingContact(
  floatingContactContainer,
  contactsList,
  addContactButton,
  contactsRightPanel
) {
  // Add CSS class for desktop behavior
  floatingContactContainer.classList.add("desktop-mode");
  floatingContactContainer.classList.remove("mobile-fullscreen");

  // Hide add button for desktop too
  if (addContactButton) {
    addContactButton.style.display = "none";
    addContactButton.classList.add("floating-hidden");
  }

  // Add class to body for additional targeting
  document.body.classList.add("floating-overlay-open");

  // Ensure overlay is in the right panel
  if (contactsRightPanel) {
    contactsRightPanel.appendChild(floatingContactContainer);
  }

  // Keep contacts list visible in desktop view
  if (contactsList) contactsList.style.display = "block";
}

/**
 * Sets up the floating contact overlay content and event listeners
 * @param {HTMLElement} floatingContactContainer - The floating overlay container
 * @param {Object} contact - The contact object to display
 */
function setupFloatingContactContent(floatingContactContainer, contact) {
  floatingContactContainer.style.display = "block";
  setTimeout(() => {
    setupFloatingContactCloseListeners();
    setupFloatingContactOverlayListener();
  }, 100);
}

function showFloatingContactForResponsive(contact) {
  const isMobile = isMobileDevice();
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );

  const contactsList = document.getElementById("contactsList");
  const addContactButton = document.getElementById("addContactButton");
  const contactsMainContent = document.getElementById("contactsMainContent");
  const contactsRightPanel = document.getElementById("contactsRightPanel");

  floatingContactContainer.innerHTML = getFloatingContact(contact, isMobile);

  if (isMobile) {
    configureMobileFloatingContact(
      floatingContactContainer,
      contactsList,
      addContactButton,
      contactsMainContent
    );
  } else {
    configureDesktopFloatingContact(
      floatingContactContainer,
      contactsList,
      addContactButton,
      contactsRightPanel
    );
  }

  setupFloatingContactContent(floatingContactContainer, contact);

  // DEBUG: CSS-Styles überprüfen
  console.log("Container styles:", {
    display: floatingContactContainer.style.display,
    visibility: getComputedStyle(floatingContactContainer).visibility,
    opacity: getComputedStyle(floatingContactContainer).opacity,
    zIndex: getComputedStyle(floatingContactContainer).zIndex,
    position: getComputedStyle(floatingContactContainer).position,
    height: getComputedStyle(floatingContactContainer).height,
    width: getComputedStyle(floatingContactContainer).width,
  });
}

/**
 * Sets up touch start event listener for the close button
 * @param {HTMLElement} closeBtn - The close button element
 */
function setupCloseBtnTouchStart(closeBtn) {
  closeBtn.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    { passive: false }
  );
}

/**
 * Sets up touch end event listener for the close button
 * @param {HTMLElement} closeBtn - The close button element
 */
function setupCloseBtnTouchEnd(closeBtn) {
  closeBtn.addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeFloatingContactOverlayResponsive();
    },
    { passive: false }
  );
}

/**
 * Sets up click event listener for the close button
 * @param {HTMLElement} closeBtn - The close button element
 */
function setupCloseBtnClick(closeBtn) {
  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeFloatingContactOverlayResponsive();
  });
}

/**
 * Sets up event listeners for the floating contact close button
 */
function setupFloatingContactCloseListeners() {
  const closeBtn = document.querySelector(".floatingContactCloseBtn");

  if (closeBtn) {
    setupCloseBtnTouchStart(closeBtn);
    setupCloseBtnTouchEnd(closeBtn);
    setupCloseBtnClick(closeBtn);
  }
}

/**
 * Checks if the click/touch target should close the overlay
 * @param {HTMLElement} target - The event target element
 * @param {HTMLElement} overlay - The overlay element
 * @returns {boolean} True if overlay should be closed
 */
function shouldCloseOverlay(target, overlay) {
  return (
    target === overlay ||
    target.classList.contains("floatingContactMainContent")
  );
}

/**
 * Sets up click event listener for the overlay
 * @param {HTMLElement} overlay - The overlay element
 */
function setupOverlayClickListener(overlay) {
  overlay.addEventListener("click", function (e) {
    if (shouldCloseOverlay(e.target, overlay)) {
      closeFloatingContactOverlayResponsive();
    }
  });
}

/**
 * Sets up touch event listener for the overlay
 * @param {HTMLElement} overlay - The overlay element
 */
function setupOverlayTouchListener(overlay) {
  overlay.addEventListener(
    "touchstart",
    function (e) {
      if (shouldCloseOverlay(e.target, overlay)) {
        e.preventDefault();
        closeFloatingContactOverlayResponsive();
      }
    },
    { passive: false }
  );
}

/**
 * Sets up event listener for closing floating contact overlay when tapping on it
 */
function setupFloatingContactOverlayListener() {
  const overlay = document.getElementById("floatingContactOverlay");

  if (overlay) {
    setupOverlayClickListener(overlay);
    setupOverlayTouchListener(overlay);
  }
}

/**
 * Shows the contact menu dropdown for mobile view with delay
 * @param {string} contactId - The contact ID to generate menu for
 */
function showContactMenu(contactId) {
  setTimeout(() => {
    createContactMenuOverlay(contactId);
    setupContactMenuEventListeners();
  }, 50);
}

/**
 * Creates and appends the contact menu overlay to the DOM
 * @param {string} contactId - The contact ID to generate menu for
 */
function createContactMenuOverlay(contactId) {
  // Check if overlay already exists to prevent duplicates
  const existingOverlay = document.querySelector(".contact-menu-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = getContactMenuOverlay(contactId);
  document.body.insertAdjacentHTML("beforeend", overlay);
}

/**
 * Sets up event listeners for the contact menu overlay
 */
function setupContactMenuEventListeners() {
  setTimeout(() => {
    const overlayElement = document.querySelector(".contact-menu-overlay");
    if (overlayElement) {
      overlayElement.removeAttribute("onclick");
      const closeMenuHandler = function (e) {
        const overlay = document.querySelector(".contact-menu-overlay");
        if (overlay) {
          closeContactMenu();
          document.removeEventListener("touchstart", closeMenuHandler, true);
          document.removeEventListener("click", closeMenuHandler, true);
        }
      };
      document.addEventListener("touchstart", closeMenuHandler, true);
      document.addEventListener("click", closeMenuHandler, true);
    }
  }, 100);
}

/**
 * Closes the contact menu overlay
 */
function closeContactMenu() {
  const overlay = document.querySelector(".contact-menu-overlay");
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Closes the floating contact detail overlay for responsive design
 */
function closeFloatingContactOverlayResponsive() {
  if (isMobileDevice()) {
    const floatingContactContainer = document.getElementById(
      "floatingContactOverlay"
    );
    const contactsList = document.getElementById("contactsList");
    const addContactButton = document.querySelector(".addContactButton");
    if (floatingContactContainer) {
      floatingContactContainer.style.display = "none";
      floatingContactContainer.innerHTML = "";
    }
    if (contactsList) {
      contactsList.style.display = "block";
    }
    if (addContactButton) {
      addContactButton.style.display = "block";
      addContactButton.classList.remove("floating-hidden");
    }

    // Remove body class when closing overlay
    document.body.classList.remove("floating-overlay-open");
  } else {
    closeFloatingContactOverlay();
  }
}

/**
 * Selects a contact item in the UI and removes selection from previously selected item
 * @param {string} contactId - The ID of the contact to select
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
 * Displays the overlay for adding a new contact
 */
function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.innerHTML = getAddContactOverlay();
    overlay.style.display = "flex";
    setupPhoneInputFilter();
    setupAddContactOverlayEventListeners();
  }
}

/**
 * Closes and clears the add contact overlay
 */
function closeAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 200);
  }
}

/**
 * Sets up event listeners for the add contact overlay to close on outside click
 */
function setupAddContactOverlayEventListeners() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeAddContactOverlay();
      }
    });

    overlay.addEventListener("touchstart", function (e) {
      if (e.target === overlay) {
        e.preventDefault();
        closeAddContactOverlay();
      }
    });
  }
}

/**
 * Displays the overlay for editing an existing contact
 * @param {string} contactId - The ID of the contact to edit
 */
async function showEditContactOverlay(contactId) {
  try {
    const contact = await fetchContactByIdAndUser(contactId);

    if (!contact) {
      return;
    }

    const overlay = document.getElementById("editContactOverlay");

    if (overlay) {
      overlay.innerHTML = getEditContactOverlay(contact);
      overlay.style.display = "flex";
      setupPhoneInputFilter();
      setupEditContactOverlayEventListeners();
    }
  } catch (error) {
    console.error("Error showing edit contact overlay:", error);
  }
}

/**
 * Closes and clears the edit contact overlay
 */
function closeEditContactOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 200);
  }
}

/**
 * Sets up event listeners for the edit contact overlay to close on outside click
 */
function setupEditContactOverlayEventListeners() {
  const overlay = document.getElementById("editContactOverlay");
  if (overlay && window.innerWidth > 428) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeEditContactOverlay();
      }
    });

    overlay.addEventListener("touchstart", function (e) {
      if (e.target === overlay) {
        e.preventDefault();
        closeEditContactOverlay();
      }
    });
  }
}

/**
 * Handles creation of a new contact on form submission
 * @param {Event} event - The form submission event
 * @returns {Promise<void>} Resolves after creating the contact and updating the UI
 */
async function createContact(event) {
  event.preventDefault();
  if (!validateContactForm()) return;

  const contactData = extractContactFormData(event.target);
  await addContactToFirebaseByUser(contactData);

  closeAddContactOverlay();
  showSuccessMessage("Contact successfully created");

  await refreshContactsAfterCreation();
}

/**
 * Extracts contact data from the form
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Contact data object
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
 * Refreshes contacts list and floating overlay after contact creation
 * @returns {Promise<void>} Resolves after refreshing the UI
 */
async function refreshContactsAfterCreation() {
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);

  await refreshFloatingContactIfVisible();
}

/**
 * Refreshes the floating contact overlay if it's currently visible
 * @returns {Promise<void>} Resolves after refreshing the overlay
 */
async function refreshFloatingContactIfVisible() {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );

  if (!isFloatingContactVisible(floatingContactContainer)) return;

  const currentContactId = getCurrentlyDisplayedContactId();
  if (currentContactId) {
    await showFloatingContact(currentContactId);
  }
}

/**
 * Checks if the floating contact overlay is currently visible
 * @param {HTMLElement} container - The floating contact container
 * @returns {boolean} True if the overlay is visible
 */
function isFloatingContactVisible(container) {
  return container && container.style.display === "block";
}

/**
 * Gets the ID of the currently displayed contact in the floating overlay
 * @returns {string|null} The contact ID or null if none selected
 */
function getCurrentlyDisplayedContactId() {
  const currentContactElement = document.querySelector(".contactItem.selected");
  return currentContactElement
    ? currentContactElement.getAttribute("data-contact-id")
    : null;
}

/**
 * Handles updating an existing contact on form submission
 * @param {Event} event - The form submission event
 * @param {string} contactId - The ID of the contact to update
 * @returns {Promise<void>} Resolves after updating the contact and refreshing the UI
 */
async function updateContact(event, contactId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  await updateContactInFirebaseByUser(contactId, contactData);
  closeEditContactOverlay();
  showSuccessMessage("Contact successfully updated");
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
  await showFloatingContact(contactId);
}

/**
 * Deletes a contact and its assigned tasks, then updates the UI
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<void>} Resolves after deletion operations
 */
async function deleteContact(contactId) {
  await deleteContactFromFirebase(contactId);
  await deleteAssignedTasks(contactId);
  await updateContactsUI();
  showSuccessMessage("Contact successfully deleted");
}

/**
 * Deletes all tasks assigned to a specific contact
 * @param {string} contactId - The ID of the contact whose tasks will be deleted
 * @returns {Promise<void>} Resolves after all assigned tasks are deleted
 */
async function deleteAssignedTasks(contactId) {
  const allTasks = await fetchTaskByUser();
  for (const task of allTasks) {
    if (task.assignedTo === contactId) {
      await deleteTaskFromFirebaseByUser(task.id);
    }
  }
}

/**
 * Updates the contacts list UI after changes (creation, update, deletion)
 * @returns {Promise<void>} Resolves after re-rendering the contacts list
 */
async function updateContactsUI() {
  closeFloatingContactOverlay();
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
}

/**
 * Closes the floating contact detail overlay
 */
function closeFloatingContactOverlay() {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.style.display = "none";
    floatingContactContainer.innerHTML = "";
  }
}

/**
 * Displays a temporary success message to the user
 * @param {string} message - The success message to display
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
