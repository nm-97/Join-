"use strict";

/**
 * Gets and displays the current user's name with type-based fallback handling
 * Retrieves user data from session storage and updates DOM element with display name
 * Provides consistent user identification across application interface with guest support
 * @function getUserName
 * @returns {Promise<string>} The display name of the current user
 */
async function getUserName() {
  const user = getCurrentUser();
  let displayName = "User";
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = displayName;
  }
  return displayName;
}

/**
 * Sets up guest login by storing guest user data in session storage and showing greeting overlay
 * Creates guest user session without authentication requirements and triggers welcome sequence
 * Provides immediate application access for users who prefer not to register or login
 * @function setGuestLogin
 * @returns {void}
 */
function setGuestLogin() {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "guest",
    })
  );
  showGreetingOverlay();
}

/**
 * Sets up registered user login by storing user data in session storage with optional redirection
 * Creates authenticated user session with complete profile information and login state management
 * Provides secure user authentication workflow with customizable post-login behavior control
 * @function setUserLogin
 * @param {Object} params - User parameters (id, name, email, etc.)
 * @param {boolean} redirect - Whether to redirect after login (default: true)
 * @returns {void}
 */
function setUserLogin(params, redirect = true) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "registered",
      ...params,
    })
  );
  if (redirect) {
    showGreetingOverlay();
  }
}

/**
 * Logs out the current user and redirects to login page with session cleanup
 * Removes user data from session storage and navigates back to authentication interface
 * Provides secure logout functionality ensuring complete session termination and user privacy
 * @function logoutUserDirectly
 * @returns {void}
 */
function logoutUserDirectly() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "../html/index.html";
}

/**
 * Shows time-appropriate greeting based on current hour with DOM element update
 * Determines greeting message using time-of-day logic and updates welcome text display
 * Provides personalized user experience with contextual time-based messaging
 * @function showLocalTimeFormUser
 * @returns {string} The greeting message
 */
function showLocalTimeFormUser() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 8) greeting = "Good evening,";
  else if (hour < 12) greeting = "Good morning,";
  else if (hour < 18) greeting = "Good afternoon,";
  else greeting = "Good evening,";
  const welcomeElement = document.getElementById("welcomeText");
  if (welcomeElement) {
    welcomeElement.textContent = greeting;
  }
  return greeting;
}

/**
 * Fetches all registered users from Firebase database with ID mapping and data transformation
 * Retrieves complete user collection from Firebase and converts to application-ready format
 * Provides centralized user data access for authentication and user management operations
 * @function fetchAllRegisteredUsers
 * @returns {Promise<Array>} Array of user objects with IDs
 */
async function fetchAllRegisteredUsers() {
  const data = await fetchData(USERS_PATH);
  if (!data) return [];
  return Object.entries(data).map(([id, userData]) => ({ id, ...userData }));
}

/**
 * Displays a success message after user sign up with automatic toast notification and cleanup
 * Injects success message template into DOM and manages timed removal for user feedback
 * Provides positive user experience confirmation for successful registration completion
 * @function renderSignUpSuccessMessage
 * @returns {void}
 */
function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate()
  );
  setTimeout(() => {
    const toast = document.getElementById("signUpSuccess");
    if (toast) toast.remove();
  }, 2000);
}

/**
 * Initializes user-related data and UI components for application startup
 * Sets up contact sidebar and other user interface elements during page load
 * Provides foundational user experience setup ensuring proper application state initialization
 * @function initializeUserData
 * @returns {Promise<void>}
 */
async function initializeUserData() {
  await showContactSideBar();
}

/**
 * Checks user credentials against registered users in Firebase with secure validation
 * Compares provided email and password against stored user data for authentication
 * Provides secure login verification with comprehensive error handling and user data return
 * @function checkUserCredentials
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Object with success status and user data if successful
 */
async function checkUserCredentials(email, password) {
  try {
    const users = await fetchAllRegisteredUsers();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.email === email && user.password === password) {
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: "registered",
          },
        };
      }
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error("Login Fehler:", error);
    return {
      success: false,
    };
  }
}

/**
 * Generates initials from a person's name with intelligent parsing and fallback handling
 * Extracts first letters from name components or uses single name character pairs
 * Provides consistent avatar text generation for user interface display elements
 * @function getInitials
 * @param {string} name - The full name to generate initials from
 * @returns {string} Two-character initials or "?" if invalid input
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[1].charAt(0).toUpperCase()
    );
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || "").toUpperCase();
}

/**
 * Generates a color for user avatar based on name with deterministic algorithm
 * Calculates unique color from name characteristics using character codes and length
 * Provides consistent visual identity for users with diverse color palette selection
 * @function getAvatarColor
 * @param {string} name - The name to generate color for
 * @returns {string} Hexadecimal color code
 */
function getAvatarColor(name) {
  if (!name || typeof name !== "string") return "#6B7280";
  const colors = [
    "#FF5EB3",
    "#6E52FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
    "#8B5CF6",
    "#10B981",
    "#F97316",
    "#EF4444",
    "#3B82F6",
    "#84CC16",
    "#F59E0B",
  ];
  const firstChar = name.charCodeAt(0);
  const lastChar = name.charCodeAt(name.length - 1);
  const nameLength = name.length;
  const colorIndex = (firstChar + lastChar + nameLength) % colors.length;
  return colors[colorIndex];
}
