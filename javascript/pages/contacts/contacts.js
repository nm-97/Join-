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
      showFloatingContactOverlay(contact);
    }
    sessionStorage.removeItem("contactIdForOverlay");
  }
});

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

function showFloatingContactForResponsive(contact) {
  if (isMobileDevice()) {
    const floatingContactContainer = document.getElementById(
      "floatingContactOverlay"
    );
    const contactsList = document.getElementById("contactsList");
    const contactsMainContent = document.querySelector(".contactsMainContent");
    const addContactButton = document.querySelector(".addContactButton");

    if (floatingContactContainer && contactsList && contactsMainContent) {
      contactsList.style.display = "none";
      if (addContactButton) {
        addContactButton.style.display = "none";
      }
      contactsMainContent.appendChild(floatingContactContainer);
      floatingContactContainer.innerHTML = getFloatingContact(contact);
      floatingContactContainer.style.display = "block";

      // Add event listeners for close button and overlay after DOM is updated
      setTimeout(() => {
        setupFloatingContactCloseListeners();
        setupFloatingContactOverlayListener();
      }, 100);
    }
  }
}

/**
 * Sets up event listeners for the floating contact close button
 */
function setupFloatingContactCloseListeners() {
  const closeBtn = document.querySelector(".floatingContactCloseBtn");

  if (closeBtn) {
    // Touch Events
    closeBtn.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );

    closeBtn.addEventListener(
      "touchend",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeFloatingContactOverlayResponsive();
      },
      { passive: false }
    );

    // Click Event (backup)
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeFloatingContactOverlayResponsive();
    });
  }
}

/**
 * Sets up event listener for closing floating contact overlay when tapping on it
 */
function setupFloatingContactOverlayListener() {
  const overlay = document.getElementById("floatingContactOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      // Close overlay when clicking on the background (not on buttons or content)
      if (
        e.target === overlay ||
        e.target.classList.contains("floatingContactMainContent")
      ) {
        closeFloatingContactOverlayResponsive();
      }
    });

    overlay.addEventListener(
      "touchstart",
      function (e) {
        // Close overlay when touching on the background (not on buttons or content)
        if (
          e.target === overlay ||
          e.target.classList.contains("floatingContactMainContent")
        ) {
          e.preventDefault();
          closeFloatingContactOverlayResponsive();
        }
      },
      { passive: false }
    );
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
    }
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
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };
  await addContactToFirebaseByUser(contactData);
  closeAddContactOverlay();
  showSuccessMessage("Contact successfully created");
  const contacts = await fetchContactsByIdAndUser();
  renderContactsList(contacts);
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
