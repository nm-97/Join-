/**
 * @fileoverview Event handling and user interactions for responsive contacts page
 * Handles touch events, click events, close button interactions, and overlay event listeners
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Handles contact click events with device-specific overlay display logic
 * Checks device type and shows appropriate contact overlay for mobile or desktop
 * Provides contact click handling with responsive overlay display and contact loading
 * @function handleContactClick
 * @param {string} contactId - The unique identifier of the contact to display
 * @returns {void} No return value, performs contact click handling and overlay display
 */
function handleContactClick(contactId) {
  if (isMobileDevice()) {
    const contact = loadedContacts.find((c) => c.id === contactId);
    if (contact) {
      showFloatingContactForResponsive(contact);
    }
  } else {
    showFloatingContact(contactId);
  }
}

/**
 * Sets up the floating contact overlay content and event listeners with timing control
 * Makes overlay visible and sets up close listeners and overlay listeners after delay
 * Provides overlay content setup with proper event listener initialization and display management
 * @function setupFloatingContactContent
 * @param {HTMLElement} floatingContactContainer - The floating overlay container to set up
 * @param {Object} contact - The contact object to display in the overlay
 * @returns {void} No return value, performs overlay content setup with event listener initialization
 */
function setupFloatingContactContent(floatingContactContainer, contact) {
  floatingContactContainer.style.display = "block";
  setTimeout(() => {
    setupFloatingContactCloseListeners();
    setupFloatingContactOverlayListener();
  }, 100);
}

/**
 * Sets up touch start event listener for the close button with event prevention
 * Adds touchstart listener to prevent default behavior and stop event propagation
 * Provides touch interaction setup for close button with proper event handling
 * @function setupCloseBtnTouchStart
 * @param {HTMLElement} closeBtn - The close button element to add touch start listener to
 * @returns {void} No return value, performs touch start event listener setup
 */
function setupCloseBtnTouchStart(closeBtn) {
  closeBtn.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    { passive: false }
  );
}

/**
 * Sets up touch end event listener for the close button with overlay closure functionality
 * Adds touchend listener to prevent default behavior, stop propagation, and close overlay
 * Provides touch interaction completion for close button with overlay closure integration
 * @function setupCloseBtnTouchEnd
 * @param {HTMLElement} closeBtn - The close button element to add touch end listener to
 * @returns {void} No return value, performs touch end event listener setup with overlay closure
 */
function setupCloseBtnTouchEnd(closeBtn) {
  closeBtn.addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeFloatingContactOverlayResponsive();
    },
    { passive: false }
  );
}

/**
 * Sets up click event listener for the close button with overlay closure functionality
 * Adds click listener to prevent default behavior, stop propagation, and close overlay
 * Provides click interaction setup for close button with proper event handling and closure
 * @function setupCloseBtnClick
 * @param {HTMLElement} closeBtn - The close button element to add click listener to
 * @returns {void} No return value, performs click event listener setup with overlay closure
 */
function setupCloseBtnClick(closeBtn) {
  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeFloatingContactOverlayResponsive();
  });
}

/**
 * Sets up event listeners for the floating contact close button with comprehensive interaction handling
 * Finds close button element and sets up touch start, touch end, and click event listeners
 * Provides complete close button event listener setup with multi-touch and click interaction support
 * @function setupFloatingContactCloseListeners
 * @returns {void} No return value, performs close button event listener setup and configuration
 */
function setupFloatingContactCloseListeners() {
  const closeBtn = document.querySelector(".floatingContactCloseBtn");

  if (closeBtn) {
    setupCloseBtnTouchStart(closeBtn);
    setupCloseBtnTouchEnd(closeBtn);
    setupCloseBtnClick(closeBtn);
  }
}

/**
 * Checks if the click/touch target should close the overlay with target validation
 * Compares event target with overlay element and main content class to determine closure
 * Provides overlay closure validation logic for click and touch event handling
 * @function shouldCloseOverlay
 * @param {HTMLElement} target - The event target element to check for closure criteria
 * @param {HTMLElement} overlay - The overlay element to compare against for closure decision
 * @returns {boolean} True if overlay should be closed based on target validation, false otherwise
 */
function shouldCloseOverlay(target, overlay) {
  return (
    target === overlay ||
    target.classList.contains("floatingContactMainContent")
  );
}

/**
 * Sets up click event listener for the overlay with conditional closure logic
 * Adds click listener to overlay that checks target and closes overlay if criteria met
 * Provides overlay click interaction handling with target validation and conditional closure
 * @function setupOverlayClickListener
 * @param {HTMLElement} overlay - The overlay element to add click listener to
 * @returns {void} No return value, performs overlay click event listener setup
 */
function setupOverlayClickListener(overlay) {
  overlay.addEventListener("click", function (e) {
    if (shouldCloseOverlay(e.target, overlay)) {
      closeFloatingContactOverlayResponsive();
    }
  });
}

/**
 * Sets up touch event listener for the overlay with conditional closure and event prevention
 * Adds touchstart listener to overlay that checks target, prevents default, and closes overlay
 * Provides overlay touch interaction handling with target validation and event management
 * @function setupOverlayTouchListener
 * @param {HTMLElement} overlay - The overlay element to add touch listener to
 * @returns {void} No return value, performs overlay touch event listener setup with prevention
 */
function setupOverlayTouchListener(overlay) {
  overlay.addEventListener(
    "touchstart",
    function (e) {
      if (shouldCloseOverlay(e.target, overlay)) {
        e.preventDefault();
        closeFloatingContactOverlayResponsive();
      }
    },
    { passive: false }
  );
}

/**
 * Sets up event listener for closing floating contact overlay when tapping on it with comprehensive interaction handling
 * Finds overlay element and sets up both click and touch event listeners for overlay closure
 * Provides complete overlay interaction setup with multi-input support and conditional closure logic
 * @function setupFloatingContactOverlayListener
 * @returns {void} No return value, performs overlay event listener setup for click and touch interactions
 */
function setupFloatingContactOverlayListener() {
  const overlay = document.getElementById("floatingContactOverlay");

  if (overlay) {
    setupOverlayClickListener(overlay);
    setupOverlayTouchListener(overlay);
  }
}
