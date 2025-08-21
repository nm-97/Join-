"use strict";

/**
 * Formats a date string into a readable format with proper locale-specific formatting
 * Converts input date string to Date object and applies US English locale formatting
 * Provides consistent date display format across application interface for user clarity
 * @function formatDate
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date in "Month Day, Year" format
 */
function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a name to proper case with first letter of each word capitalized
 * Splits name into words, capitalizes first letter, and lowercases remaining characters
 * Provides consistent name display formatting for professional presentation across application
 * @function formatName
 * @param {string} name - The name to format
 * @returns {string} Properly formatted name
 */
function formatName(name) {
  if (!name || typeof name !== "string") return name;
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Calculates the next upcoming deadline from a list of tasks with date comparison logic
 * Filters future tasks from current date and finds earliest deadline using date reduction
 * Provides critical deadline management functionality for task prioritization and planning
 * @function calculateNextDeadline
 * @param {Array} allTasks - Array of task objects with dueDate properties
 * @returns {string} Formatted date of next deadline or message if none found
 */
function calculateNextDeadline(allTasks) {
  const today = new Date();
  const futureTasks = allTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today;
  });
  if (futureTasks.length === 0) {
    return "No upcoming deadlines";
  }
  const nextTask = futureTasks.reduce((earliest, task) => {
    const taskDate = new Date(task.dueDate);
    const earliestDate = new Date(earliest.dueDate);
    return taskDate < earliestDate ? task : earliest;
  });
  return formatDate(nextTask.dueDate);
}

/**
 * Groups contacts by the first letter of their name for alphabetical organization
 * Creates grouped object structure using reduce function with first letter as key
 * Provides organized contact display functionality for improved user navigation and search
 * @function groupContactsByLetter
 * @param {Array} contacts - Array of contact objects with name properties
 * @returns {Object} Object where keys are letters and values are arrays of contacts
 */
const groupContactsByLetter = (contacts) => {
  return contacts.reduce((grouped, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    grouped[firstLetter] = grouped[firstLetter] || [];
    grouped[firstLetter].push(contact);
    return grouped;
  }, {});
};

/**
 * Maps category IDs to their Firebase display names with predefined category mapping
 * Translates internal category identifiers to user-friendly display names for Firebase storage
 * Provides consistent category naming convention between application logic and database storage
 * @function mapCategoryToFirebase
 * @param {string} category - The category ID to map
 * @returns {string} The display name for Firebase or default "Technical Task"
 */
function mapCategoryToFirebase(category) {
  const categoryMap = {
    userStory: "User Story",
    technicalTask: "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
}

/**
 * Extracts contact form data from a form submission event using FormData API
 * Retrieves name, email, and phone fields from submitted contact form elements
 * Provides standardized contact data extraction for form processing and validation workflows
 * @function getContactFormData
 * @param {Event} event - The form submission event
 * @returns {Object} Object containing name, email, and phone from form
 */
const getContactFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  phone: new FormData(event.target).get("phone"),
});

/**
 * Updates the text content of an element with the given value for dynamic content display
 * Locates DOM element by ID and safely updates its text content with provided value
 * Provides reliable counter and content update functionality with null-safe element handling
 * @function updateCounter
 * @param {string} elementId - The ID of the element to update
 * @param {string|number} value - The value to set as text content
 * @returns {void}
 */
function updateCounter(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

/**
 * Handles assignedTo array and returns all contact objects with Firebase data fetching
 * Processes assigned contact IDs by fetching complete contact data from Firebase database
 * Provides comprehensive contact resolution for task assignment display and management
 * @function getAllContactsFromAssigned
 * @param {Array|string|null} assignedTo - The assignedTo field (array, string, or null)
 * @returns {Promise<Array>} Promise resolving to array of contact objects
 */
async function getAllContactsFromAssigned(assignedTo) {
  if (!assignedTo) return [];
  const contactIds = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
  const contacts = [];
  for (const contactId of contactIds) {
    try {
      const contact = await fetchContactByIdAndUser(contactId);
      if (contact) {
        contacts.push(contact);
      }
    } catch (error) {
      console.warn(`Contact with ID ${contactId} not found:`, error);
    }
  }
  return contacts;
}

/**
 * Gets all contact names from assignedTo array by extracting name properties from contacts
 * Retrieves contact objects and maps them to their name properties for display purposes
 * Provides simplified name extraction for task assignment lists and user interface elements
 * @function getAllContactNamesFromAssigned
 * @param {Array|string|null} assignedTo - The assignedTo field
 * @returns {Array} Array of contact names
 */
function getAllContactNamesFromAssigned(assignedTo) {
  const contacts = getAllContactsFromAssigned(assignedTo);
  return contacts.map((contact) => contact.name);
}

/**
 * Toggles the visibility of the user dropdown menu with animation and scroll management
 * Adds or removes CSS classes to animate showing/hiding the menu with timed transitions
 * Disables body scroll while menu is visible and restores it after hiding for better UX
 * @function toggleUserMenu
 * @returns {void}
 */
function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");
  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
    dropdown.classList.add("hide");

    setTimeout(() => {
      dropdown.style.display = "none";
      dropdown.classList.remove("hide");
      document.body.classList.remove("noScroll");
    }, 300);
  } else {
    dropdown.style.display = "block";
    dropdown.classList.add("show");
    document.body.classList.add("noScroll");
  }
}

/**
 * Initializes the user avatar with appropriate initials and color based on user type
 * Handles both guest and registered user display by generating initials and background colors
 * Provides consistent visual user identification across application interface elements
 * @function initializeUserAvatar
 * @returns {void}
 */
function initializeUserAvatar() {
  const user = getCurrentUser();
  let displayName = "User";
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  const userAvatarElement = document.getElementById("userAvatar");
  if (userAvatarElement) {
    const initials = getInitials(displayName);
    const color = getAvatarColor(displayName);
    userAvatarElement.textContent = initials;
    userAvatarElement.style.backgroundColor = color;
  }
}

/**
 * Initializes the correct logo based on screen size with responsive image selection
 * Should be called when page loads to set appropriate logo for current viewport dimensions
 * Provides responsive design support ensuring optimal logo display across device types
 * @function initializeLogo
 * @returns {void}
 */
function initializeLogo() {
  const logoImg = document.querySelector("img#loadingScreen");
  if (logoImg) {
    const isMobile = window.innerWidth <= 428;
    if (isMobile) {
      logoImg.src = "../assets/icons/login/Capa 1.png";
    } else {
      logoImg.src = "../assets/icons/joinlogo_black.png";
    }
  }
}

/**
 * Handles logo animation with smooth opacity transition and responsive image switching
 * Sets appropriate start logo based on screen size and manages animated logo sequence
 * Provides engaging visual loading experience with device-specific logo presentation
 * @function startLogoAnimation
 * @returns {void}
 */
function startLogoAnimation() {
  const logoImg = document.querySelector("img#loadingScreen");
  if (logoImg) {
    const isMobile = window.innerWidth <= 428;
    if (isMobile) {
      logoImg.src = "../assets/icons/login/Capa 1.png";
      setTimeout(() => {
        logoImg.style.opacity = "0.95";
        setTimeout(() => {
          logoImg.src = "../assets/icons/login/Capa 2.png";
          logoImg.style.opacity = "1";
        }, 300);
      }, 200);
    } else {
      logoImg.src = "../assets/icons/joinlogo_black.png";
    }
  }
}

/**
 * Shows greeting overlay before redirecting to summary page with session state management
 * Called after successful login with mobile responsive design and login state tracking
 * Provides seamless post-authentication user experience with greeting display and navigation
 * @function showGreetingOverlay
 * @returns {void}
 */
function showGreetingOverlay() {
  sessionStorage.setItem("justLoggedIn", "true");
  window.location.href = "../html/summaryUser.html";
}

/**
 * Checks if device is in mobile/responsive mode based on viewport width threshold
 * Determines device type using window width comparison against mobile breakpoint
 * Provides consistent device detection for responsive behavior and mobile-specific features
 * @function isMobileDevice
 * @returns {boolean} True if mobile device (≤1024px)
 */
function isMobileDevice() {
  return window.innerWidth <= 1024;
}

/**
 * Updates navigation button selection state for mobile devices with CSS class management
 * Removes selection from all navigation buttons and applies to clicked element
 * Provides visual feedback for mobile navigation ensuring clear current page indication
 * @function updateNavigationSelection
 * @param {HTMLElement} clickedElement - The clicked navigation element
 * @returns {void}
 */
function updateNavigationSelection(clickedElement) {
  if (!isMobileDevice()) return;

  document.querySelectorAll(".navBtn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  if (clickedElement) {
    clickedElement.classList.add("selected");
  }
}

/**
 * Gets the URL for a given page using predefined page mapping configuration
 * Maps page identifiers to their corresponding HTML file URLs for navigation purposes
 * Provides centralized URL management ensuring consistent navigation across application
 * @function getPageUrl
 * @param {string} page - The page identifier
 * @returns {string|null} The URL for the page or null if not found
 */
function getPageUrl(page) {
  const pageMap = {
    summary: "../html/summaryUser.html",
    addTask: "../html/addTask.html",
    board: "../html/board.html",
    contacts: "../html/contacts.html",
  };
  return pageMap[page] || null;
}

/**
 * Performs the actual navigation to a URL by updating browser location
 * Executes page navigation using window.location.href for complete page transitions
 * Provides reliable navigation functionality ensuring proper page loading and history management
 * @function performNavigation
 * @param {string} url - The URL to navigate to
 * @returns {void}
 */
function performNavigation(url) {
  window.location.href = url;
}

/**
 * Navigates to the specified page for mobile responsive devices with selection state management
 * Updates navigation selection and performs page transition using URL mapping
 * Provides mobile-specific navigation workflow with visual feedback and error handling
 * @function navigateTo
 * @param {string} page - The page to navigate to (summary, addTask, board, contacts)
 * @returns {void}
 */
function navigateTo(page) {
  if (!isMobileDevice()) return;
  updateNavigationSelection(event.target);
  const url = getPageUrl(page);
  if (url) {
    performNavigation(url);
  } else {
    console.error(`Page '${page}' not found in navigation map`);
  }
}

/**
 * Sets the selected navigation button based on current page with automatic detection
 * Call this on each page load to maintain selection state using URL pathname analysis
 * Provides consistent navigation state management ensuring proper visual feedback across pages
 * @function setCurrentPageSelection
 * @returns {void}
 */
function setCurrentPageSelection() {
  if (!isMobileDevice()) return;
  const currentPage = window.location.pathname;
  let pageKey = null;
  if (currentPage.includes("summaryUser.html")) {
    pageKey = "summary";
  } else if (currentPage.includes("addTask.html")) {
    pageKey = "addTask";
  } else if (currentPage.includes("board.html")) {
    pageKey = "board";
  } else if (currentPage.includes("contacts.html")) {
    pageKey = "contacts";
  }
  if (pageKey) {
    document.querySelectorAll(".navBtn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    const currentButton = document.querySelector(
      `[onclick*="navigateTo('${pageKey}')"]`
    );
    if (currentButton) {
      currentButton.classList.add("selected");
    }
  }
}

/**
 * Redirects to the appropriate privacy policy page based on screen size with responsive routing
 * Determines optimal privacy policy version using viewport width for mobile or desktop display
 * Provides device-appropriate legal document presentation ensuring proper formatting and readability
 * @function redirectToPrivacyPolicy
 * @returns {void}
 */
function redirectToPrivacyPolicy() {
  if (window.innerWidth <= 1024) {
    window.location.href = "../html/privacyPoliceResponisve.html";
  } else {
    window.location.href = "../html/privacyPoliceResponisve.html";
  }
}

/**
 * Redirects to the appropriate legal notice page based on screen size with responsive routing
 * Determines optimal legal notice version using viewport width for mobile or desktop display
 * Provides device-appropriate legal document presentation ensuring proper formatting and accessibility
 * @function redirectToLegalNotice
 * @returns {void}
 */
function redirectToLegalNotice() {
  if (window.innerWidth <= 1024) {
    window.location.href = "../html/legalNoticeResponsive.html";
  } else {
    window.location.href = "../html/legalNoticeResponsive.html";
  }
}

/**
 * Initializes UI components when DOM content is loaded with comprehensive setup workflow
 * Calls logo, avatar, animation, and navigation initialization functions for complete page setup
 * Provides centralized application initialization ensuring all UI components are properly configured
 * @function
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeLogo();
  initializeUserAvatar();
  startLogoAnimation();
  setCurrentPageSelection();
});
