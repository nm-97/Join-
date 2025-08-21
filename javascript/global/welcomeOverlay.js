"use strict";

/**
 * Generates welcome overlay template using existing user greeting system with predefined HTML structure
 * Creates overlay template with greeting elements and user name display for welcome presentation
 * Provides reusable template generation for consistent welcome overlay appearance across application
 * @function getWelcomeOverlayTemplate
 * @returns {string} HTML string for welcome overlay
 */
function getWelcomeOverlayTemplate() {
  return `
    <div class="overlay welcome" id="welcomeOverlay">
      <div class="welcomeGreeting">
        <div class="welcomeText" id="welcomeText">Good afternoon</div>
        <div class="userName" id="userName">Guest</div>
      </div>
    </div>
  `;
}

/**
 * Hides the summary content children while keeping container visible for overlay presentation
 * Iterates through summary content child elements and sets display to none for each
 * Provides clean canvas for welcome overlay display without affecting page container structure
 * @function hideSummaryContent
 * @returns {void}
 */
function hideSummaryContent() {
  const summaryContent = document.getElementById("summaryMainContent");
  if (summaryContent) {
    const children = summaryContent.children;
    for (let child of children) {
      child.style.display = "none";
    }
  }
}

/**
 * Inserts welcome overlay template into DOM with fallback container selection
 * Targets summary main content container or falls back to body for template injection
 * Provides flexible overlay insertion ensuring welcome display regardless of page structure
 * @function insertWelcomeOverlay
 * @returns {void}
 */
function insertWelcomeOverlay() {
  const summaryMainContent = document.getElementById("summaryMainContent");
  if (summaryMainContent) {
    summaryMainContent.insertAdjacentHTML(
      "beforeend",
      getWelcomeOverlayTemplate()
    );
  } else {
    document.body.insertAdjacentHTML("beforeend", getWelcomeOverlayTemplate());
  }
}

/**
 * Sets up auto-close timer for welcome overlay with automatic dismissal functionality
 * Creates timed callback to close overlay after 1 second if still present in DOM
 * Provides automatic user experience flow ensuring overlay doesn't persist indefinitely
 * @function setupAutoCloseTimer
 * @returns {void}
 */
function setupAutoCloseTimer() {
  setTimeout(() => {
    if (document.getElementById("welcomeOverlay")) {
      closeWelcomeOverlay();
    }
  }, 1000);
}

/**
 * Shows welcome overlay after successful login with mobile device detection and timed display
 * Displays overlay for 1 second then fades out to show main content on mobile devices only
 * Provides personalized post-login experience with responsive design and automatic progression
 * @function showWelcomeOverlay
 * @returns {void}
 */
function showWelcomeOverlay() {
  if (!isMobileDevice()) {
    return;
  }
  hideSummaryContent();
  insertWelcomeOverlay();
  const overlay = document.getElementById("welcomeOverlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
  setupAutoCloseTimer();
}

/**
 * Shows the summary content children that were hidden during overlay presentation
 * Restores display properties of summary content elements while preserving overlay exclusion
 * Provides clean transition back to main content after welcome overlay dismissal
 * @function showSummaryContent
 * @returns {void}
 */
function showSummaryContent() {
  const summaryContent = document.getElementById("summaryMainContent");
  if (summaryContent) {
    const children = summaryContent.children;
    for (let child of children) {
      if (child.id !== "welcomeOverlay") {
        child.style.display = "";
      }
    }
  }
}

/**
 * Closes welcome overlay with smooth animation and shows main content with timed transitions
 * Adds closing CSS class for animation effects and removes overlay after animation completes
 * Provides polished user experience with smooth visual transitions and content restoration
 * @function closeWelcomeOverlay
 * @returns {void}
 */
function closeWelcomeOverlay() {
  const overlay = document.getElementById("welcomeOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.remove();
      showSummaryContent();
    }, 300);
  }
}

/**
 * Initializes welcome overlay if user just logged in with session state validation
 * Call this on pages where welcome should be shown by checking login session flags
 * Provides controlled welcome display ensuring overlay appears only for fresh login sessions
 * @function initializeWelcomeOverlay
 * @returns {void}
 */
function initializeWelcomeOverlay() {
  const justLoggedIn = sessionStorage.getItem("justLoggedIn");
  if (justLoggedIn === "true") {
    sessionStorage.removeItem("justLoggedIn");
    showWelcomeOverlay();
  }
}