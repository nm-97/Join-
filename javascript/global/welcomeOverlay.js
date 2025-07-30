"use strict";

/**
 * Generates welcome overlay template using existing user greeting system
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
 * Hides the summary content children (but keeps container visible)
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
 * Inserts welcome overlay template into DOM
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
 * Sets up auto-close timer for welcome overlay
 */
function setupAutoCloseTimer() {
  setTimeout(() => {
    if (document.getElementById("welcomeOverlay")) {
      closeWelcomeOverlay();
    }
  }, 1000);
}

/**
 * Shows welcome overlay after successful login
 * Displays for 1 second then fades out to show main content
 * Only shows on mobile devices (responsive design)
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
 * Shows the summary content children that were hidden
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
 * Closes welcome overlay with smooth animation and shows main content
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
 * Initializes welcome overlay if user just logged in
 * Call this on pages where welcome should be shown
 */
function initializeWelcomeOverlay() {
  const justLoggedIn = sessionStorage.getItem("justLoggedIn");
  if (justLoggedIn === "true") {
    sessionStorage.removeItem("justLoggedIn");
    showWelcomeOverlay();
  }
}
