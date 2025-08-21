/**
 * Core dropdown functionality and event management
 * Contains fundamental dropdown operations and state management
 */

/**
 * Gets DOM elements for dropdown event setup with validation
 * Retrieves and validates dropdown elements before event binding
 * @function getDropdownElements
 * @param {string} dropdownId - ID of the dropdown container element
 * @param {string} inputId - ID of the dropdown input field element
 * @param {string} arrowId - ID of the dropdown arrow button element
 * @returns {Object|null} Object with dropdown elements or null if invalid
 */
function getDropdownElements(dropdownId, inputId, arrowId) {
  const dropdown = document.getElementById(dropdownId);
  const dropdownInput = document.getElementById(inputId);
  const dropdownArrow = document.getElementById(arrowId);
  if (!dropdown || !dropdownInput || !dropdownArrow) {
    return null;
  }
  return { dropdown, dropdownInput, dropdownArrow };
}

/**
 * Sets up arrow click event listener for dropdown toggle functionality
 * Attaches click handler to arrow button with proper event handling
 * @function setupArrowClickListener
 * @param {HTMLElement} dropdownArrow - The dropdown arrow element
 * @param {string} dropdownId - ID of the dropdown to toggle
 * @returns {void}
 */
function setupArrowClickListener(dropdownArrow, dropdownId) {
  dropdownArrow.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(dropdownId);
  });
}

/**
 * Sets up input event listeners for dropdown opening functionality
 * Attaches focus and click handlers to input field for dropdown interaction
 * @function setupInputEventListeners
 * @param {HTMLElement} dropdownInput - The dropdown input element
 * @param {string} dropdownId - ID of the dropdown to open
 * @returns {void}
 */
function setupInputEventListeners(dropdownInput, dropdownId) {
  dropdownInput.addEventListener("focus", function () {
    openDropdown(dropdownId);
  });
  dropdownInput.addEventListener("click", function () {
    openDropdown(dropdownId);
  });
}

/**
 * Sets up document click listener for outside-click dropdown closing
 * Attaches global click handler to close dropdown when clicking outside
 * @function setupOutsideClickListener
 * @param {HTMLElement} dropdown - The dropdown container element
 * @param {string} dropdownId - ID of the dropdown to close
 * @returns {void}
 */
function setupOutsideClickListener(dropdown, dropdownId) {
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown(dropdownId);
    }
  });
}

/**
 * Sets up dropdown internal click prevention to avoid unwanted closing
 * Prevents event bubbling for clicks inside the dropdown
 * @function setupDropdownClickPrevention
 * @param {HTMLElement} dropdown - The dropdown container element
 * @returns {void}
 */
function setupDropdownClickPrevention(dropdown) {
  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

/**
 * Sets up event handlers for dropdown interactions and user interface controls
 * Orchestrates setup of all dropdown-related event listeners
 * @function setupDropdownEvents
 * @param {string} dropdownId - ID of the dropdown container element
 * @param {string} inputId - ID of the dropdown input field element
 * @param {string} arrowId - ID of the dropdown arrow button element
 * @returns {void}
 */
function setupDropdownEvents(dropdownId, inputId, arrowId) {
  const elements = getDropdownElements(dropdownId, inputId, arrowId);
  if (!elements) return;
  const { dropdown, dropdownInput, dropdownArrow } = elements;
  setupArrowClickListener(dropdownArrow, dropdownId);
  setupInputEventListeners(dropdownInput, dropdownId);
  setupOutsideClickListener(dropdown, dropdownId);
  setupDropdownClickPrevention(dropdown);
}

/**
 * Toggles dropdown open/close state based on current visibility status
 * Checks current dropdown state and switches between open and closed modes
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
