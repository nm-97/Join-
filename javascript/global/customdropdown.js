/**
 * @fileoverview Custom dropdown component functionality
 * @author Join Project Team
 * @version 1.0.0
 */

/** @type {Array} Array to store all loaded contacts */
let allContacts = [];
/** @type {Array} Array to store currently selected contacts */
let selectedContacts = [];

/**
 * Loads contacts from database and sets up dropdown
 */
/**
 * Loads contacts from the database and sets up the contacts dropdown
 * Includes the current user if they are not already in the contacts list
 * @async
 * @function loadContacts
 * @returns {Promise<void>}
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
 * Renders contacts dropdown HTML with avatars and checkboxes
 * @param {Array} contacts - Array of contact objects to render
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
 * Sets up event handlers for dropdown interactions
 * @param {string} dropdownId - ID of the dropdown container
 * @param {string} inputId - ID of the dropdown input field
 * @param {string} arrowId - ID of the dropdown arrow button
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
 * Toggles dropdown open/close state
 * @param {string} dropdownId - ID of the dropdown to toggle
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
 * Opens the dropdown and shows content
 * @param {string} dropdownId - ID of the dropdown to open
 */
function openDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.add("open");
  }
}

/**
 * Closes a specific dropdown by removing the 'open' class
 * @param {string} dropdownId - The ID of the dropdown element to close
 */
function closeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.remove("open");
  }
}

/**
 * Filters contact items based on search term by showing/hiding them
 * @param {string} searchTerm - The term to filter contacts by (case insensitive)
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
 */
function updateDropdownInput() {
  const dropdownInput = document.getElementById("dropdownInput");
  if (!dropdownInput) return;
  dropdownInput.value = "";
  dropdownInput.placeholder = "Select contacts to assign";
  updateSelectedContactsDisplay();
}

/**
 * Updates the visual display of selected contacts as avatar badges
 * Shows up to 5 contacts with a "+X more" indicator if needed
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
 * Removes a contact from the selection by unchecking its checkbox
 * @param {string} contactId - The ID of the contact to remove from selection
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
 * Returns an array of IDs of currently selected contacts
 * @returns {string[]} Array of contact IDs
 */
function getSelectedContactIds() {
  return selectedContacts.map((contact) => contact.id);
}

/**
 * Clears all contact selections by unchecking all checkboxes and resetting arrays
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
 */
function loadCategories() {
  const categoriesDropdownList = document.getElementById(
    "categoriesDropdownList"
  );
  if (!categoriesDropdownList) return;

  renderCategoriesDropdown(categories);
  setupDropdownEvents(
    "customCategoryDropdown",
    "categoryDropdownInput",
    "categoryDropdownArrow"
  );
  setupCategorySelection();
}

/**
 * Renders the categories dropdown list with provided category data
 * @param {Array} categories - Array of category objects with id and name properties
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
 * Sets up click event listeners for category selection in the dropdown
 */
function setupCategorySelection() {
  const categoryItems = document.querySelectorAll("[data-category-id]");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const categoryId = this.getAttribute("data-category-id");
      const categoryName = this.querySelector(".contactName").textContent;

      selectedDropdownCategory = categoryId;
      const categoryDropdownInput = document.getElementById(
        "categoryDropdownInput"
      );
      categoryDropdownInput.value = categoryName;
      closeDropdown("customCategoryDropdown");
    });
  });
}

/**
 * Returns the ID of the currently selected category
 * @returns {string} The selected category ID
 */
function getSelectedCategoryId() {
  return selectedDropdownCategory;
}

/**
 * Returns the name of the currently selected category from the input field
 * @returns {string} The selected category name or empty string if not found
 */
function getSelectedCategoryName() {
  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  return categoryDropdownInput ? categoryDropdownInput.value : "";
}
