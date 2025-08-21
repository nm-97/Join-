/**
 * @fileoverview Contacts menu management functionality
 * Handles contact menu overlay creation, event listeners, and interaction management
 * @author Join Project Team
 * @version 1.0.0
 */

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
  editBtn.addEventListener("click", function (e) {
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
  deleteBtn.addEventListener("click", function (e) {
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
