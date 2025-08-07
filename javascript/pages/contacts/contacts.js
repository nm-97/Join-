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
 * Initializes the contacts page by fetching user's contacts from Firebase and rendering them
 * Handles errors gracefully and logs them to console for debugging
 * @async
 * @function initializeContacts
 * @throws {Error} When Firebase fetch operation fails
 * @returns {Promise<void>} Promise that resolves when contacts are loaded and rendered
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
 * Calls getContactWithSeparator template function for each contact to generate individual HTML
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
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const showSeparator = firstLetter !== currentLetter;
    if (showSeparator) {
      currentLetter = firstLetter;
    }
    html += getContactWithSeparator(contact, showSeparator);
  }
  return html;
}

/**
 * Displays a specific contact in the floating overlay panel
 * First searches in loaded contacts cache, then fetches from Firebase if not found
 * Sets up overlay mode tracking for responsive behavior and displays contact details
 * @async
 * @function showFloatingContact
 * @param {string} contactId - Unique identifier of the contact to display
 * @throws {Error} When Firebase fetch operation fails
 * @returns {Promise<void>} Promise that resolves when contact is displayed in overlay
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
    trackOverlayMode();
  }
}

/**
 * Shows the contact menu dropdown overlay for mobile view with controlled timing
 * Uses setTimeout to prevent immediate closure and sets up proper event handling
 * Creates menu overlay with edit/delete options for the specified contact
 * @function showContactMenu
 * @param {string} contactId - Unique identifier of the contact for menu generation
 * @returns {void} No return value, creates and displays menu overlay in DOM
 */
function showContactMenu(contactId) {
  setTimeout(() => {
    createContactMenuOverlay(contactId);
    setupContactMenuEventListeners();
  }, 50);
}

/**
 * Creates and appends the contact menu overlay to the document body
 * Removes any existing menu overlay to prevent duplicates before creating new one
 * Generates menu HTML using template function and inserts it into DOM
 * @function createContactMenuOverlay
 * @param {string} contactId - Unique identifier of the contact for menu generation and actions
 * @returns {void} No return value, directly manipulates DOM by adding overlay element
 */
function createContactMenuOverlay(contactId) {
  const existingOverlay = document.querySelector(".contact-menu-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
  const overlay = getContactMenuOverlay(contactId);
  document.body.insertAdjacentHTML("beforeend", overlay);
}

/**
 * Sets up comprehensive event listeners for the contact menu overlay
 * Delegates to specialized functions for button setup and outside-click handling
 * @function setupContactMenuEventListeners
 * @returns {void} No return value, attaches event listeners to document and overlay elements
 */
function setupContactMenuEventListeners() {
  setTimeout(() => {
    const overlayElement = document.querySelector(".contact-menu-overlay");
    if (overlayElement) {
      setupMenuButtonListeners(overlayElement);
      setupMenuOutsideClickHandler();
    }
  }, 100);
}

/**
 * Sets up event listeners for edit and delete buttons in the contact menu
 * @function setupMenuButtonListeners
 * @param {HTMLElement} overlayElement - The contact menu overlay element
 * @returns {void} No return value, attaches click listeners to menu buttons
 */
function setupMenuButtonListeners(overlayElement) {
  const editBtn = overlayElement.querySelector(".floatingEditBtn");
  const deleteBtn = overlayElement.querySelector(".floatingDeleteBtn");
  
  if (editBtn) {
    setupEditButtonListener(editBtn);
  }
  
  if (deleteBtn) {
    setupDeleteButtonListener(deleteBtn);
  }
}

/**
 * Sets up click event listener for the edit button
 * @function setupEditButtonListener
 * @param {HTMLElement} editBtn - The edit button element
 * @returns {void} No return value, attaches click listener to edit button
 */
function setupEditButtonListener(editBtn) {
  editBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    const contactId = editBtn.getAttribute("data-contact-id");
    showEditContactOverlay(contactId);
    closeContactMenu();
  });
}

/**
 * Sets up click event listener for the delete button
 * @function setupDeleteButtonListener
 * @param {HTMLElement} deleteBtn - The delete button element
 * @returns {void} No return value, attaches click listener to delete button
 */
function setupDeleteButtonListener(deleteBtn) {
  deleteBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    const contactId = deleteBtn.getAttribute("data-contact-id");
    deleteContact(contactId);
    closeContactMenu();
  });
}

/**
 * Sets up outside-click detection to automatically close the contact menu
 * Uses capture phase event handling for reliable outside-click detection
 * @function setupMenuOutsideClickHandler
 * @returns {void} No return value, attaches document-level event listeners
 */
function setupMenuOutsideClickHandler() {
  const closeMenuHandler = function (e) {
    const overlay = document.querySelector(".contact-menu-overlay");
    const menuContent = document.querySelector(".contact-menu-content");
    
    if (overlay && menuContent && !menuContent.contains(e.target)) {
      closeContactMenu();
      document.removeEventListener("touchstart", closeMenuHandler, true);
      document.removeEventListener("click", closeMenuHandler, true);
    }
  };
  
  document.addEventListener("touchstart", closeMenuHandler, true);
  document.addEventListener("click", closeMenuHandler, true);
}

/**
 * Closes and removes the contact menu overlay from the DOM
 * Safely checks for overlay existence before attempting removal
 * @function closeContactMenu
 * @returns {void} No return value, removes overlay element from DOM if it exists
 */
function closeContactMenu() {
  const overlay = document.querySelector(".contact-menu-overlay");
  if (overlay) {
    overlay.remove();
  }
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
 * Displays the overlay modal for adding a new contact to the system
 * Populates overlay with add contact form template and initializes form validation
 * Sets up phone input filtering and outside-click event listeners for user experience
 * @function showAddContactOverlay
 * @returns {void} No return value, displays modal overlay and sets up form interactions
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
 * Closes and clears the add contact overlay with smooth animation
 * Applies closing CSS class for animation, then hides overlay and clears content after delay
 * Ensures proper cleanup of form data and event listeners
 * @function closeAddContactOverlay
 * @returns {void} No return value, animates overlay closure and cleans up DOM
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
 * Sets up comprehensive event listeners for add contact overlay interaction
 * Handles both click and touch events for closing overlay when clicking outside form area
 * Prevents default touch behavior to avoid conflicts with overlay closing logic
 * @function setupAddContactOverlayEventListeners
 * @returns {void} No return value, attaches event listeners for overlay interaction
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
 * Displays the overlay modal for editing an existing contact's information
 * Fetches contact data from Firebase, populates edit form with current values
 * Handles error cases gracefully and sets up form validation and event listeners
 * @async
 * @function showEditContactOverlay
 * @param {string} contactId - Unique identifier of the contact to edit
 * @throws {Error} When Firebase fetch operation fails or contact not found
 * @returns {Promise<void>} Promise that resolves when edit overlay is displayed with contact data
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
 * Closes and clears the edit contact overlay with smooth animation
 * Applies closing CSS class for transition effect, then hides and cleans up after delay
 * Ensures all form data is cleared and event listeners are properly removed
 * @function closeEditContactOverlay
 * @returns {void} No return value, animates overlay closure and performs cleanup
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
 * Sets up event listeners for edit contact overlay with responsive behavior
 * Only sets up listeners for screens wider than 428px to prevent mobile conflicts
 * Delegates to separate functions for click and touch event handling
 * @function setupEditContactOverlayEventListeners
 * @returns {void} No return value, conditionally sets up overlay event handling
 */
function setupEditContactOverlayEventListeners() {
  const overlay = document.getElementById("editContactOverlay");
  if (!shouldSetupEditOverlayListeners(overlay)) return;
  setupEditOverlayClickListener(overlay);
  setupEditOverlayTouchListener(overlay);
}

/**
 * Determines if edit overlay event listeners should be activated based on screen size
 * Checks overlay existence and ensures screen width is above mobile breakpoint (428px)
 * Prevents event listener conflicts on mobile devices where overlay behavior differs
 * @function shouldSetupEditOverlayListeners
 * @param {HTMLElement|null} overlay - The edit overlay DOM element to check
 * @returns {boolean} True if overlay exists and screen is wider than 428px, false otherwise
 */
function shouldSetupEditOverlayListeners(overlay) {
  return overlay && window.innerWidth > 428;
}

/**
 * Sets up click event listener for edit overlay outside-click detection
 * Closes overlay only when clicking directly on overlay background, not form content
 * Provides intuitive user experience for modal dismissal
 * @function setupEditOverlayClickListener
 * @param {HTMLElement} overlay - The edit overlay DOM element to attach listener to
 * @returns {void} No return value, attaches click event listener to overlay
 */
function setupEditOverlayClickListener(overlay) {
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeEditContactOverlay();
    }
  });
}

/**
 * Sets up touch event listener for edit overlay with default behavior prevention
 * Handles touch interactions on overlay background to close modal on mobile/tablet devices
 * Prevents default touch behavior to avoid scrolling or other conflicts
 * @function setupEditOverlayTouchListener
 * @param {HTMLElement} overlay - The edit overlay DOM element to attach touch listener to
 * @returns {void} No return value, attaches touchstart event listener with preventDefault
 */
function setupEditOverlayTouchListener(overlay) {
  overlay.addEventListener("touchstart", function (e) {
    if (e.target === overlay) {
      e.preventDefault();
      closeEditContactOverlay();
    }
  });
}

/**
 * Handles complete new contact creation workflow from form submission to UI update
 * Validates form data, extracts contact information, saves to Firebase, and refreshes UI
 * Shows success feedback and updates both contact list and any visible overlays
 * @async
 * @function createContact
 * @param {Event} event - Form submission event containing contact data
 * @throws {Error} When form validation fails or Firebase save operation fails
 * @returns {Promise<void>} Promise that resolves when contact is created and UI updated
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
 * Refreshes contacts list and floating overlay after successful contact creation
 * Fetches updated contacts from Firebase, updates local cache, and re-renders UI
 * Ensures any visible floating contact overlay displays current data
 * @async
 * @function refreshContactsAfterCreation
 * @throws {Error} When Firebase fetch operation fails
 * @returns {Promise<void>} Promise that resolves when UI refresh is complete
 */
async function refreshContactsAfterCreation() {
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
  await refreshFloatingContactIfVisible();
}

/**
 * Conditionally refreshes floating contact overlay if currently visible and active
 * Checks overlay visibility state and refreshes displayed contact if user is viewing one
 * Prevents unnecessary API calls when no overlay is shown to user
 * @async
 * @function refreshFloatingContactIfVisible
 * @throws {Error} When Firebase fetch operation fails for contact refresh
 * @returns {Promise<void>} Promise that resolves when overlay refresh is complete or skipped
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
 * Handles complete contact update workflow from form submission to UI refresh
 * Orchestrates the update process by extracting form data, updating Firebase, and refreshing UI
 * Delegates specific tasks to specialized functions for better code organization
 * @async
 * @function updateContact
 * @param {Event} event - Form submission event containing updated contact data
 * @param {string} contactId - Unique identifier of the contact being updated
 * @throws {Error} When form data extraction, Firebase update, or UI refresh fails
 * @returns {Promise<void>} Promise that resolves when contact update workflow is complete
 */
async function updateContact(event, contactId) {
  event.preventDefault();
  const contactData = extractContactFormData(event.target);
  await performContactUpdate(contactId, contactData);
  await finalizeContactUpdate(contactId);
}

/**
 * Executes the Firebase database update operation for contact information
 * Isolated function for updating contact data in Firebase, enables better error handling
 * Calls Firebase utility function with contact ID and updated data object
 * @async
 * @function performContactUpdate
 * @param {string} contactId - Unique identifier of the contact to update in Firebase
 * @param {Object} contactData - Updated contact information object with name, email, phone
 * @throws {Error} When Firebase update operation fails due to network or permission issues
 * @returns {Promise<void>} Promise that resolves when Firebase update is successfully completed
 */
async function performContactUpdate(contactId, contactData) {
  await updateContactInFirebaseByUser(contactId, contactData);
}

/**
 * Completes the contact update process with UI cleanup and user feedback
 * Closes edit overlay, displays success message, and triggers comprehensive UI refresh
 * Ensures user sees immediate feedback and updated contact information
 * @async
 * @function finalizeContactUpdate
 * @param {string} contactId - Unique identifier of the updated contact for UI refresh
 * @throws {Error} When UI refresh operations fail
 * @returns {Promise<void>} Promise that resolves when all finalization steps are complete
 */
async function finalizeContactUpdate(contactId) {
  closeEditContactOverlay();
  showSuccessMessage("Contact successfully updated");
  await refreshContactsAfterUpdate(contactId);
}

/**
 * Refreshes contacts list and displays the updated contact in floating overlay
 * Fetches fresh contact data from Firebase, updates local cache, and shows updated contact
 * Ensures user immediately sees the changes they made to the contact
 * @async
 * @function refreshContactsAfterUpdate
 * @param {string} contactId - Unique identifier of the updated contact to display
 * @throws {Error} When Firebase fetch or contact display operations fail
 * @returns {Promise<void>} Promise that resolves when contacts are refreshed and contact is displayed
 */
async function refreshContactsAfterUpdate(contactId) {
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
  await showFloatingContact(contactId);
}

/**
 * Performs complete contact deletion including associated tasks and UI cleanup
 * Deletes contact from Firebase, removes all assigned tasks, and updates interface
 * Provides comprehensive cleanup to maintain data integrity across the application
 * @async
 * @function deleteContact
 * @param {string} contactId - Unique identifier of the contact to delete permanently
 * @throws {Error} When Firebase deletion operations or UI updates fail
 * @returns {Promise<void>} Promise that resolves when contact and tasks are deleted and UI updated
 */
async function deleteContact(contactId) {
  await deleteContactFromFirebase(contactId);
  await deleteAssignedTasks(contactId);
  await updateContactsUI();
  showSuccessMessage("Contact successfully deleted");
}

/**
 * Deletes all tasks that are assigned to a specific contact being removed
 * Iterates through all user tasks and removes those assigned to the deleted contact
 * Maintains data integrity by preventing orphaned task assignments
 * @async
 * @function deleteAssignedTasks
 * @param {string} contactId - Unique identifier of the contact whose tasks should be deleted
 * @throws {Error} When Firebase task fetch or deletion operations fail
 * @returns {Promise<void>} Promise that resolves when all assigned tasks are successfully deleted
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
}

/**
 * Closes the floating contact detail overlay and cleans up responsive state
 * Removes responsive overlay tracking classes and hides overlay with content cleanup
 * Ensures proper cleanup of overlay state for responsive behavior management
 * @function closeFloatingContactOverlay
 * @returns {void} No return value, hides overlay and removes tracking classes from document body
 */
function closeFloatingContactOverlay() {
  document.body.classList.remove("was-mobile-overlay", "was-desktop-overlay");
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.style.display = "none";
    floatingContactContainer.innerHTML = "";
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
