/**
 * Contact selection management and event handling
 * Handles checkbox interactions, selection state, and contact management
 */

/** @type {Array} Array to store currently selected contacts */
let selectedContacts = [];

/**
 * Handles checkbox change events and updates selection state
 * Unified event handler for checkbox state changes
 * @function handleCheckboxChange
 * @returns {void}
 */
function handleCheckboxChange() {
  updateSelectedContacts();
  updateDropdownInput();
}

/**
 * Sets up change event listeners for all contact checkboxes
 * Attaches change event handlers to checkbox elements for selection tracking
 * @function setupCheckboxChangeListeners
 * @returns {void}
 */
function setupCheckboxChangeListeners() {
  const checkboxes = document.querySelectorAll(".contactItem .customCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
}

/**
 * Handles contact item click events for checkbox toggling
 * Manages click events on contact items to toggle checkbox state
 * @function handleContactItemClick
 * @param {Event} e - The click event object
 * @returns {void}
 */
function handleContactItemClick(e) {
  const checkbox = this.querySelector(".customCheckbox");
  if (checkbox && e.target !== checkbox) {
    e.preventDefault();
    checkbox.checked = !checkbox.checked;
    handleCheckboxChange();
  }
}

/**
 * Sets up click event listeners for contact items
 * Attaches click handlers to contact items for checkbox interaction
 * @function setupContactItemClickListeners
 * @returns {void}
 */
function setupContactItemClickListeners() {
  const contactItems = document.querySelectorAll(".contactItem");
  contactItems.forEach(function (contactItem) {
    contactItem.addEventListener("click", handleContactItemClick);
  });
}

/**
 * Sets up event listeners for contact checkboxes to handle selection changes
 * Orchestrates setup of both checkbox and contact item event listeners
 * @function setupContactCheckboxes
 * @returns {void}
 */
function setupContactCheckboxes() {
  setupCheckboxChangeListeners();
  setupContactItemClickListeners();
}

/**
 * Updates the selectedContacts array based on currently checked checkboxes
 * Scans all checked contact checkboxes and rebuilds selection array accordingly
 * @function updateSelectedContacts
 * @returns {void}
 */
function updateSelectedContacts() {
  const checkedBoxes = document.querySelectorAll(
    ".contactItem .customCheckbox:checked"
  );
  selectedContacts = [];
  checkedBoxes.forEach(function (checkbox) {
    const contactId = checkbox.value;
    const contact = allContacts.find((c) => c.id === contactId);
    if (contact) {
      selectedContacts.push(contact);
    }
  });
}

/**
 * Updates the dropdown input field and refreshes the selected contacts display
 * Clears input field content and resets placeholder text for user guidance
 * @function updateDropdownInput
 * @returns {void}
 */
function updateDropdownInput() {
  const dropdownInput = document.getElementById("dropdownInput");
  if (!dropdownInput) return;
  dropdownInput.value = "";
  dropdownInput.placeholder = "Select contacts to assign";
  updateSelectedContactsDisplay();
}

/**
 * Removes a contact from the selection by unchecking its checkbox and updating state
 * Locates contact checkbox element and programmatically unchecks it for deselection
 * @function removeContactSelection
 * @param {string} contactId - The ID of the contact to remove from selection
 * @returns {void}
 */
function removeContactSelection(contactId) {
  const checkbox = document.getElementById(`contact-${contactId}`);
  if (checkbox) {
    checkbox.checked = false;
  }
  updateSelectedContacts();
  updateDropdownInput();
}

/**
 * Returns an array of IDs of currently selected contacts for data processing
 * Extracts contact IDs from selectedContacts array for form submission or API calls
 * @function getSelectedContactIds
 * @returns {string[]} Array of contact IDs currently selected in the dropdown
 */
function getSelectedContactIds() {
  return selectedContacts.map((contact) => contact.id);
}

/**
 * Clears all contact selections by unchecking all checkboxes and resetting arrays
 * Resets both visual checkbox states and internal selectedContacts data structure
 * @function clearContactSelections
 * @returns {void}
 */
function clearContactSelections() {
  selectedContacts = [];
  const checkboxes = document.querySelectorAll(".contactItem .customCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
  updateDropdownInput();
}
