/**
 * @fileoverview Contacts data handling functionality
 * Handles contact CRUD operations, Firebase interactions, and data management
 * @author Join Project Team
 * @version 1.0.0
 */

let loadedContacts = [];

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
  if (!validateContactForm()) return;
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
    if (Array.isArray(task.assignedTo) && task.assignedTo.includes(contactId)) {
      if (task.assignedTo.length === 1) {
        await deleteTaskFromFirebaseByUser(task.id);
      } else {
        const updatedAssignedTo = task.assignedTo.filter(
          (id) => id !== contactId
        );
        await updateTaskInFirebaseByUser(task.id, {
          ...task,
          assignedTo: updatedAssignedTo,
        });
      }
    }
  }
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
