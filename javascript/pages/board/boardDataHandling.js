/**
 * @fileoverview Board data handling functionality
 * Handles task fetching, enrichment, and contact data processing
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Fetches tasks and enriches them with assigned contact information
 * @function fetchAndEnrichTasks
 * @returns {Promise<Array>} Array of tasks with assigned contact data
 */
async function fetchAndEnrichTasks() {
  const tasks = await fetchTaskByUser();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].assignedTo) {
      tasks[i].assignedContacts = await getAllContactsFromAssigned(
        tasks[i].assignedTo
      );
    }
  }
  return tasks;
}

/**
 * Gets the contact name by ID for task assignment display with error handling and fallback
 * Fetches contact data by ID and returns name, providing fallback messages for missing data
 * Provides robust contact name resolution with comprehensive error handling and user-friendly fallbacks
 * @function getContactNameById
 * @param {string} contactId - The unique identifier of the contact to retrieve name for
 * @returns {Promise<string>} Promise resolving to contact name, "Not assigned", or "Unknown Contact"
 */
async function getContactNameById(contactId) {
  if (!contactId) return "Not assigned";
  try {
    const contact = await fetchContactByIdAndUser(contactId);
    return contact ? contact.name : "Unknown Contact";
  } catch (error) {
    console.error("Error getting contact name:", error);
    return "Unknown Contact";
  }
}

/**
 * Opens contact details when clicking on a contact name in task detail with session storage and redirection
 * Fetches contact data, saves contact ID to session storage, and redirects to contacts page
 * Provides contact detail navigation from task detail with proper data persistence and error handling
 * @function openContactOverlayFromTaskDetail
 * @param {string} contactId - Unique identifier of the contact to show detail view for
 * @returns {Promise<void>} Promise that resolves when contact data is stored and redirection is initiated
 */
async function openContactOverlayFromTaskDetail(contactId) {
  try {
    await handleContactRedirectSuccess(contactId);
  } catch (error) {
    handleContactRedirectError(contactId);
  }
}

/**
 * Handles successful contact fetch and redirection setup
 * @function handleContactRedirectSuccess
 * @param {string} contactId - The contact ID to fetch and redirect for
 * @returns {Promise<void>} Promise that resolves when contact is fetched and redirect is set up
 */
async function handleContactRedirectSuccess(contactId) {
  const contact = await fetchContactByIdAndUser(contactId);
  const finalContactId = contact ? contact.id : contactId;
  sessionStorage.setItem("contactIdForOverlay", finalContactId);
  window.location.href = `contacts.html?contactId=${finalContactId}`;
}

/**
 * Handles contact fetch error and fallback redirection
 * @function handleContactRedirectError
 * @param {string} contactId - The contact ID to use for fallback redirection
 * @returns {void} No return value, sets up fallback session storage and redirection
 */
function handleContactRedirectError(contactId) {
  sessionStorage.setItem("contactIdForOverlay", contactId);
  window.location.href = `contacts.html?contactId=${contactId}`;
}

/**
 * Loads task data for editing with contact enrichment and validation
 * Fetches task by user context, finds specific task, and enriches with contact data for editing
 * Provides complete task data preparation for edit mode with assigned contacts resolution
 * @function loadTaskForEdit
 * @param {string} taskId - The unique identifier of the task to load for editing
 * @returns {Promise<Object|null>} The task object with enriched contact data or null if task not found
 */
async function loadTaskForEdit(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.assignedContacts = await getAllContactsFromAssigned(task.assignedTo);
  }
  return task;
}

/**
 * Refreshes the board by re-fetching tasks, enriching with contact data, and re-rendering display
 * Performs complete board data refresh including task fetching, contact loading, and template rendering
 * Provides comprehensive board refresh functionality for data synchronization and visual updates
 * @function refreshBoard
 * @returns {Promise<void>} Promise that resolves when board refresh and re-rendering are complete
 */
async function refreshBoard() {
  const tasks = await fetchAndEnrichTasks();
  renderBoard(tasks);
}
