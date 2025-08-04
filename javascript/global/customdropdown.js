/** @type {Array} Array to store all loaded contacts */
let allContacts = [];
/** @type {Array} Array to store currently selected contacts */
let selectedContacts = [];

/**
 * Loads contacts from the database and sets up the contacts dropdown component
 * Fetches all contacts using Firebase, includes current user if not already present
 * Renders dropdown HTML and configures event handlers for user interaction
 * @async
 * @function loadContacts
 * @returns {Promise<void>} Promise that resolves when contacts are loaded and dropdown is ready
 */
async function loadContacts() {
  try {
    let contacts = await fetchContactsByIdAndUser();
    const currentUser = getCurrentUser();
    if (currentUser.type === "registered") {
      const userAlreadyInContacts = contacts.some(
        (contact) => contact.id === currentUser.id
      );
      if (!userAlreadyInContacts) {
        const currentUserContact = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: "",
          address: "",
        };
        contacts.unshift(currentUserContact);
      }
    }
    allContacts = contacts;
    renderContactsDropdown(allContacts);
    setupDropdownEvents("customDropdown", "dropdownInput", "dropdownArrow");
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

/**
 * Renders contacts dropdown HTML with avatars and checkboxes for selection
 * Creates interactive contact list items with visual avatars and checkbox controls
 * Generates contact display elements and sets up checkbox event handlers
 * @function renderContactsDropdown
 * @param {Array} contacts - Array of contact objects to render
 * @returns {void}
 */
function renderContactsDropdown(contacts) {
  const contactsList = document.getElementById("contactsDropdownList");
  if (!contactsList) return;
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials = getInitials(contact.name);
    const avatarColor = getAvatarColor(contact.name);
    const currentUser = getCurrentUser();
    const isCurrentUser =
      currentUser.type === "registered" && contact.id === currentUser.id;
    const displayName = isCurrentUser ? `${contact.name} (You)` : contact.name;
    html += `
     <div class="contactItem" data-contact-id="${contact.id}">
       <div class="contactAvatar" style="background-color: ${avatarColor};">${initials}</div>
       <span class="contactName">${displayName}</span>
       <input type="checkbox" class="customCheckbox" id="contact-${contact.id}" value="${contact.id}" />
       <label for="contact-${contact.id}"></label>
     </div>
   `;
  }

  contactsList.innerHTML = html;
  setupContactCheckboxes();
}

/**
 * Sets up event handlers for dropdown interactions and user interface controls
 * Configures click, focus, and document click events for dropdown functionality
 * Manages dropdown opening, closing, and outside-click behavior for better UX
 * @function setupDropdownEvents
 * @param {string} dropdownId - ID of the dropdown container element
 * @param {string} inputId - ID of the dropdown input field element
 * @param {string} arrowId - ID of the dropdown arrow button element
 * @returns {void}
 */
function setupDropdownEvents(dropdownId, inputId, arrowId) {
  const dropdown = document.getElementById(dropdownId);
  const dropdownInput = document.getElementById(inputId);
  const dropdownArrow = document.getElementById(arrowId);
  if (!dropdown || !dropdownInput || !dropdownArrow) return;

  dropdownArrow.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(dropdownId);
  });

  dropdownInput.addEventListener("focus", function () {
    openDropdown(dropdownId);
  });

  dropdownInput.addEventListener("click", function () {
    openDropdown(dropdownId);
  });

  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown(dropdownId);
    }
  });

  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

/**
 * Toggles dropdown open/close state based on current visibility status
 * Checks current dropdown state and switches between open and closed modes
 * Provides unified interface for dropdown state management across the application
 * @function toggleDropdown
 * @param {string} dropdownId - ID of the dropdown element to toggle
 * @returns {void}
 */
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown.classList.contains("open")) {
    closeDropdown(dropdownId);
  } else {
    openDropdown(dropdownId);
  }
}

/**
 * Opens the dropdown and shows content by adding CSS class for visibility
 * Makes dropdown content visible to user by applying 'open' class styling
 * Enables user interaction with dropdown items and selection functionality
 * @function openDropdown
 * @param {string} dropdownId - ID of the dropdown element to open
 * @returns {void}
 */
function openDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.add("open");
  }
}

/**
 * Closes a specific dropdown by removing the 'open' class for hidden state
 * Hides dropdown content from user view by removing CSS visibility class
 * Completes dropdown interaction cycle and returns interface to closed state
 * @function closeDropdown
 * @param {string} dropdownId - The ID of the dropdown element to close
 * @returns {void}
 */
function closeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.remove("open");
  }
}

/**
 * Filters contact items based on search term by showing/hiding matching elements
 * Performs case-insensitive search through contact names and adjusts visibility
 * Provides real-time search functionality for improved user experience in contact selection
 * @function filterContacts
 * @param {string} searchTerm - The term to filter contacts by (case insensitive)
 * @returns {void}
 */
function filterContacts(searchTerm) {
  const contactItems = document.querySelectorAll(".contactItem");
  contactItems.forEach(function (item) {
    const contactName = item
      .querySelector(".contactName")
      .textContent.toLowerCase();
    if (contactName.includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

/**
 * Sets up event listeners for contact checkboxes to handle selection changes
 * Attaches change event handlers to all contact checkbox elements in dropdown
 * Manages contact selection state updates and visual feedback for user interactions
 * @function setupContactCheckboxes
 * @returns {void}
 */
function setupContactCheckboxes() {
  const checkboxes = document.querySelectorAll(".contactItem .customCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      updateSelectedContacts();
      updateDropdownInput();
    });
  });
}

/**
 * Updates the selectedContacts array based on currently checked checkboxes
 * Scans all checked contact checkboxes and rebuilds selection array accordingly
 * Maintains synchronization between UI state and internal data structures
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
 * Triggers visual update of selected contacts avatars and badges
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
 * Updates the visual display of selected contacts as avatar badges with overflow handling
 * Shows up to 5 contacts with avatars and displays "+X more" indicator for additional selections
 * Provides interactive contact removal functionality through clickable avatar elements
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
  let html = "";
  const maxDisplay = 5;
  const contactsToShow = selectedContacts.slice(0, maxDisplay);
  for (let i = 0; i < contactsToShow.length; i++) {
    const contact = contactsToShow[i];
    const initials = getInitials(contact.name);
    const avatarColor = getAvatarColor(contact.name);
    html += `
     <div class="selectedContactAvatar" 
          style="background-color: ${avatarColor};" 
          data-contact-id="${contact.id}"
          title="${contact.name}"
          onclick="removeContactSelection('${contact.id}')">
       ${initials}
     </div>
   `;
  }
  if (selectedContacts.length > maxDisplay) {
    const remaining = selectedContacts.length - maxDisplay;
    html += `
     <div class="selectedContactAvatar" 
          style="background-color: #cccccc; color: #666666;"
          title="${remaining} more contacts selected">
       +${remaining}
     </div>
   `;
  }
  displayContainer.innerHTML = html;
}

/**
 * Removes a contact from the selection by unchecking its checkbox and updating state
 * Locates contact checkbox element and programmatically unchecks it for deselection
 * Updates internal selection arrays and refreshes visual display components
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
 * Provides clean data interface for downstream contact assignment operations
 * @function getSelectedContactIds
 * @returns {string[]} Array of contact IDs currently selected in the dropdown
 */
function getSelectedContactIds() {
  return selectedContacts.map((contact) => contact.id);
}

/**
 * Clears all contact selections by unchecking all checkboxes and resetting arrays
 * Resets both visual checkbox states and internal selectedContacts data structure
 * Provides complete form reset functionality for contact selection component
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

let selectedDropdownCategory = "";
const categories = [
  { id: "technicalTask", name: "Technical Task" },
  { id: "userStory", name: "User Story" },
];

/**
 * Initializes and loads the categories dropdown with predefined categories
 * Sets up category dropdown with DOM ready checks and event handler configuration
 * Provides delayed initialization to ensure proper DOM element availability
 * @function loadCategories
 * @returns {void}
 */
function loadCategories() {
  // Wait for DOM to be ready
  setTimeout(() => {
    const categoriesDropdownList = document.getElementById(
      "categoriesDropdownList"
    );
    if (!categoriesDropdownList) {
      console.warn("categoriesDropdownList element not found, retrying...");
      return;
    }

    renderCategoriesDropdown(categories);
    setupDropdownEvents(
      "customCategoryDropdown",
      "categoryDropdownInput",
      "categoryDropdownArrow"
    );
    setupCategorySelection();
  }, 100);
}

/**
 * Renders the categories dropdown list with provided category data for user selection
 * Creates HTML structure for category dropdown items with proper data attributes
 * Generates interactive category list elements for task categorization functionality
 * @function renderCategoriesDropdown
 * @param {Array} categories - Array of category objects with id and name properties
 * @returns {void}
 */
function renderCategoriesDropdown(categories) {
  const categoriesList = document.getElementById("categoriesDropdownList");
  if (!categoriesList) {
    return;
  }
  let html = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    html += `
     <div class="contactItem" data-category-id="${category.id}">
       <div class="contactInfo">
         <span class="contactName">${category.name}</span>
       </div>
     </div>
   `;
  }
  categoriesList.innerHTML = html;
}

/**
 * Sets up click event listeners for category selection in the dropdown interface
 * Attaches event handlers to category items with proper event delegation
 * Manages category selection behavior and prevents duplicate event listeners
 * @function setupCategorySelection
 * @returns {void}
 */
function setupCategorySelection() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    const categoryItems = document.querySelectorAll("[data-category-id]");

    categoryItems.forEach((item) => {
      // Remove any existing event listeners
      item.removeEventListener("click", handleCategoryClick);
      item.addEventListener("click", handleCategoryClick);
    });
  }, 150);
}

/**
 * Handles category selection click events and updates dropdown state accordingly
 * Processes user category selection by updating input field and closing dropdown
 * Manages category selection workflow and maintains consistent UI state
 * @function handleCategoryClick
 * @param {Event} e - The click event object from user interaction
 * @returns {void}
 */
function handleCategoryClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const categoryId = this.getAttribute("data-category-id");
  const categoryName = this.querySelector(".contactName").textContent;
  selectedDropdownCategory = categoryId;

  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  if (categoryDropdownInput) {
    categoryDropdownInput.value = categoryName;
  }

  closeDropdown("customCategoryDropdown");
}

/**
 * Returns the ID of the currently selected category for form processing and validation
 * Provides access to selected category identifier for downstream operations
 * Maintains consistent data interface for category-related functionality across application
 * @function getSelectedCategoryId
 * @returns {string} The selected category ID or empty string if none selected
 */
function getSelectedCategoryId() {
  return selectedDropdownCategory;
}

/**
 * Returns the name of the currently selected category from input field or internal state
 * Retrieves category display name with fallback logic for robust data access
 * Provides user-friendly category name for display and form submission purposes
 * @function getSelectedCategoryName
 * @returns {string} The selected category name or empty string if not found
 */
function getSelectedCategoryName() {
  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  const inputValue = categoryDropdownInput ? categoryDropdownInput.value : "";

  // If we have an input value, return it
  if (inputValue) {
    return inputValue;
  }

  // If no input value but we have a selected ID, map it to name
  if (selectedDropdownCategory) {
    const category = categories.find(
      (cat) => cat.id === selectedDropdownCategory
    );
    const categoryName = category ? category.name : "";
    return categoryName;
  }

  return "";
}
