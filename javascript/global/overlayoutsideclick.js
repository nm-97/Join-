/**
 * Universal Overlay Handler
 * Provides a generic overlay management system for modals and popups
 * Handles outside clicks, Escape key events, and closing logic automatically
 * Works with any element matching defined overlay selectors
 * @class UniversalOverlayHandler
 */
class UniversalOverlayHandler {
  constructor() {
    /**
     * Tracks whether event listeners are currently active
     * Prevents duplicate bindings for click and keydown events
     * @type {boolean}
     */
    this.isListening = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.init();
  }

  /**
   * Initializes the overlay handler by starting event listeners
   * Ensures overlay management is active after instantiation
   * @function init
   * @returns {void}
   */
  init() {
    this.startListening();
    console.log("Universal Overlay Handler initialized");
  }

  /**
   * Starts listening for global click and keyboard events
   * Required for detecting outside clicks and Escape key presses
   * @function startListening
   * @returns {void}
   */
  startListening() {
    if (!this.isListening) {
      document.addEventListener("click", this.handleClick);
      document.addEventListener("keydown", this.handleEscape);
      this.isListening = true;
    }
  }

  /**
   * Stops listening for global events
   * Useful when overlays should not react to outside interactions
   * @function stopListening
   * @returns {void}
   */
  stopListening() {
    if (this.isListening) {
      document.removeEventListener("click", this.handleClick);
      document.removeEventListener("keydown", this.handleEscape);
      this.isListening = false;
    }
  }

  /**
   * Handles global click events and closes overlays if clicked outside content
   * Prevents accidental closure when clicking inside the modal
   * @function handleClick
   * @param {MouseEvent} event - The click event object
   * @returns {void}
   */
  handleClick(event) {
    const visibleOverlays = this.getVisibleOverlays();
    if (visibleOverlays.length === 0) return;

    visibleOverlays.forEach((overlay) => {
      const overlayContent = this.getOverlayContent(overlay);
      if (!overlayContent) return;

      const clickedOnOverlay = overlay.contains(event.target);
      const clickedOnContent = overlayContent.contains(event.target);

      if (clickedOnOverlay && !clickedOnContent) {
        this.closeOverlay(overlay);
      }
    });
  }

  /**
   * Handles Escape key presses to close the most recent overlay
   * Provides intuitive keyboard accessibility for modal dismissal
   * @function handleEscape
   * @param {KeyboardEvent} event - The keyboard event object
   * @returns {void}
   */
  handleEscape(event) {
    if (event.key === "Escape") {
      const visibleOverlays = this.getVisibleOverlays();
      if (visibleOverlays.length > 0) {
        const lastOverlay = visibleOverlays[visibleOverlays.length - 1];
        this.closeOverlay(lastOverlay);
      }
    }
  }

  /**
   * Retrieves all currently visible overlays on the page
   * Filters out hidden or display:none elements
   * @function getVisibleOverlays
   * @returns {HTMLElement[]} Array of visible overlay elements
   */
  getVisibleOverlays() {
    const allOverlays = document.querySelectorAll(
      ".overlay, .overlayAddTask, .addContactOverlay, .editContactOverlay"
    );
    return Array.from(allOverlays).filter((overlay) => {
      const style = window.getComputedStyle(overlay);
      const isVisible =
        style.display !== "none" &&
        !overlay.classList.contains("hidden") &&
        style.visibility !== "hidden";
      return isVisible;
    });
  }

  /**
   * Locates the main content container within an overlay
   * Used to differentiate between inside vs. outside clicks
   * @function getOverlayContent
   * @param {HTMLElement} overlay - The overlay element
   * @returns {HTMLElement|null} The content element if found, otherwise null
   */
  getOverlayContent(overlay) {
    const contentSelectors = [
      ".taskDetailModal",
      ".overlayContent",
      ".addContactModal",
      ".editContactModal",
      ".floatingContactCard",
    ];

    for (const selector of contentSelectors) {
      const content = overlay.querySelector(selector);
      if (content) return content;
    }
    return null;
  }

  /**
   * Attempts to close a given overlay using predefined close functions
   * Falls back to generic closing if no matching function is available
   * @function closeOverlay
   * @param {HTMLElement} overlay - The overlay element to close
   * @returns {void}
   */
  closeOverlay(overlay) {
    const overlayId = overlay.id;
    const closeFunctions = {
      taskOverlay: "closeTaskOverlay",
      addTaskOverlay: "closeAddTaskOverlay",
      editTaskOverlay: "closeEditTaskOverlay",
      addContactOverlay: "closeAddContactOverlay",
      editContactOverlay: "closeEditContactOverlay",
      floatingContactOverlay: "closeFloatingContactOverlayResponsive",
    };

    const functionName = closeFunctions[overlayId];

    if (functionName && typeof window[functionName] === "function") {
      console.log(`Closing overlay: ${overlayId} via ${functionName}`);
      window[functionName]();
    } else {
      console.log(
        `No specific close function found for ${overlayId}, trying generic close`
      );
      this.genericCloseOverlay(overlay);
    }
  }

  /**
   * Generic fallback to close an overlay when no specific function exists
   * Looks for close buttons or hides the overlay directly if none found
   * @function genericCloseOverlay
   * @param {HTMLElement} overlay - The overlay element to close
   * @returns {void}
   */
  genericCloseOverlay(overlay) {
    const closeButton = overlay.querySelector(
      ".closeButton, .closeBtn, .addContactClose, .editContactClose, .floatingContactCloseBtn"
    );

    if (closeButton && closeButton.onclick) {
      closeButton.click();
    } else {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
    }
  }

  /**
   * Utility method to check if a specific overlay is currently visible
   * Helps conditional UI logic that depends on modal state
   * @function isOverlayVisible
   * @param {string} overlayId - The ID of the overlay element
   * @returns {boolean} True if overlay is visible, otherwise false
   */
  isOverlayVisible(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return false;

    const style = window.getComputedStyle(overlay);
    return (
      style.display !== "none" &&
      !overlay.classList.contains("hidden") &&
      style.visibility !== "hidden"
    );
  }
}

/**
 * Global instance of the UniversalOverlayHandler
 * Used across the application to manage overlay behavior
 * @type {UniversalOverlayHandler}
 */
const universalOverlayHandler = new UniversalOverlayHandler();

/**
 * Enables overlay outside click handling by starting listeners
 * Can be called manually to ensure overlays are interactive
 * @function enableOverlayOutsideClickHandling
 * @returns {void}
 */
function enableOverlayOutsideClickHandling() {
  universalOverlayHandler.startListening();
}

/**
 * Disables overlay outside click handling by removing listeners
 * Useful for contexts where overlays should not close automatically
 * @function disableOverlayOutsideClickHandling
 * @returns {void}
 */
function disableOverlayOutsideClickHandling() {
  universalOverlayHandler.stopListening();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Universal Overlay Handler ready!");
  });
} else {
  console.log("Universal Overlay Handler ready!");
}
