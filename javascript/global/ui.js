/**
 * @fileoverview User interface utilities for the JOIN application
 * Handles user menu interactions, avatar display, and UI initialization
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Toggles the visibility of the user dropdown menu
 */
function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

/**
 * Closes the user dropdown menu by hiding it
 */
function closeUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = "none";
}

/**
 * Initializes the user avatar with appropriate initials and color
 * Handles both guest and registered user display
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
 * Initializes UI components when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeUserAvatar();
});
