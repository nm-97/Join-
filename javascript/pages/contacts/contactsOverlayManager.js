/**
 * @fileoverview Contacts overlay management functionality
 * Handles overlay creation, display, closing, and event listeners for all contact overlays
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Displays a specific contact in the floating overlay panel
 * First searches in loaded contacts cache, then fetches from Firebase if not found
 * Sets up overlay mode tracking for responsive behavior and displays contact details
 * @async
 * @function showFloatingContact
 * @param {string} contactId - Unique identifier of the contact to display
 * @throws {Error} When Firebase fetch operation fails
 * @returns {Promise<void>} Promise that resolves when contact is displayed in overlay
 */
async function showFloatingContact(contactId) {
  let contact = loadedContacts.find((c) => c.id === contactId);
  if (!contact) {
    contact = await fetchContactByIdAndUser(contactId);
  }
  if (!contact) return;

  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    const contactData = getContactRenderData(contact);
    const mobileConfig = getMobileHeaderConfig();

    floatingContactContainer.innerHTML = getFloatingContact(
      contactData,
      mobileConfig.shouldShow,
      mobileConfig.isTabletOrMobile
    );
    floatingContactContainer.style.display = "block";
    trackOverlayMode();
  }
}

/**
 * Displays the overlay modal for adding a new contact to the system
 * Populates overlay with add contact form template and initializes form validation
 * Sets up phone input filtering and outside-click event listeners for user experience
 * @function showAddContactOverlay
 * @returns {void} No return value, displays modal overlay and sets up form interactions
 */
function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.innerHTML = getAddContactOverlay();
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
    setupPhoneInputFilter();
    setupAddContactOverlayEventListeners();
  }
}

/**
 * Closes and clears the add contact overlay with smooth animation
 * Applies closing CSS class for animation, then hides overlay and clears content after delay
 * Ensures proper cleanup of form data and event listeners
 * @function closeAddContactOverlay
 * @returns {void} No return value, animates overlay closure and cleans up DOM
 */
function closeAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 200);
  }
}

/**
 * Sets up comprehensive event listeners for add contact overlay interaction
 * Handles both click and touch events for closing overlay when clicking outside form area
 * Prevents default touch behavior to avoid conflicts with overlay closing logic
 * @function setupAddContactOverlayEventListeners
 * @returns {void} No return value, attaches event listeners for overlay interaction
 */
function setupAddContactOverlayEventListeners() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeAddContactOverlay();
      }
    });
    overlay.addEventListener("touchstart", function (e) {
      if (e.target === overlay) {
        e.preventDefault();
        closeAddContactOverlay();
      }
    });
  }
}

/**
 * Displays the overlay modal for editing an existing contact's information
 * Fetches contact data from Firebase, populates edit form with current values
 * Handles error cases gracefully and sets up form validation and event listeners
 * @async
 * @function showEditContactOverlay
 * @param {string} contactId - Unique identifier of the contact to edit
 * @throws {Error} When Firebase fetch operation fails or contact not found
 * @returns {Promise<void>} Promise that resolves when edit overlay is displayed with contact data
 */
async function showEditContactOverlay(contactId) {
  try {
    const contact = await fetchContactByIdAndUser(contactId);
    if (!contact) {
      return;
    }
    const overlay = document.getElementById("editContactOverlay");
    if (overlay) {
      overlay.innerHTML = getEditContactOverlay(contact);
      overlay.style.display = "flex";
      document.body.classList.add("no-scroll");
      setupPhoneInputFilter();
      setupEditContactOverlayEventListeners();
    }
  } catch (error) {
    console.error("Error showing edit contact overlay:", error);
  }
}

/**
 * Closes and clears the edit contact overlay with smooth animation
 * Applies closing CSS class for transition effect, then hides and cleans up after delay
 * Ensures all form data is cleared and event listeners are properly removed
 * @function closeEditContactOverlay
 * @returns {void} No return value, animates overlay closure and performs cleanup
 */
function closeEditContactOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 200);
  }
}

/**
 * Sets up event listeners for edit contact overlay with responsive behavior
 * Only sets up listeners for screens wider than 428px to prevent mobile conflicts
 * Delegates to separate functions for click and touch event handling
 * @function setupEditContactOverlayEventListeners
 * @returns {void} No return value, conditionally sets up overlay event handling
 */
function setupEditContactOverlayEventListeners() {
  const overlay = document.getElementById("editContactOverlay");
  if (!shouldSetupEditOverlayListeners(overlay)) return;
  setupEditOverlayClickListener(overlay);
  setupEditOverlayTouchListener(overlay);
}

/**
 * Determines if edit overlay event listeners should be activated based on screen size
 * Checks overlay existence and ensures screen width is above mobile breakpoint (428px)
 * Prevents event listener conflicts on mobile devices where overlay behavior differs
 * @function shouldSetupEditOverlayListeners
 * @param {HTMLElement|null} overlay - The edit overlay DOM element to check
 * @returns {boolean} True if overlay exists and screen is wider than 428px, false otherwise
 */
function shouldSetupEditOverlayListeners(overlay) {
  return overlay && window.innerWidth > 428;
}

/**
 * Sets up click event listener for edit overlay outside-click detection
 * Closes overlay only when clicking directly on overlay background, not form content
 * Provides intuitive user experience for modal dismissal
 * @function setupEditOverlayClickListener
 * @param {HTMLElement} overlay - The edit overlay DOM element to attach listener to
 * @returns {void} No return value, attaches click event listener to overlay
 */
function setupEditOverlayClickListener(overlay) {
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeEditContactOverlay();
    }
  });
}

/**
 * Sets up touch event listener for edit overlay with default behavior prevention
 * Handles touch interactions on overlay background to close modal on mobile/tablet devices
 * Prevents default touch behavior to avoid scrolling or other conflicts
 * @function setupEditOverlayTouchListener
 * @param {HTMLElement} overlay - The edit overlay DOM element to attach touch listener to
 * @returns {void} No return value, attaches touchstart event listener with preventDefault
 */
function setupEditOverlayTouchListener(overlay) {
  overlay.addEventListener("touchstart", function (e) {
    if (e.target === overlay) {
      e.preventDefault();
      closeEditContactOverlay();
    }
  });
}

/**
 * Closes the floating contact detail overlay and cleans up responsive state
 * Removes responsive overlay tracking classes and hides overlay with content cleanup
 * Ensures proper cleanup of overlay state for responsive behavior management
 * @function closeFloatingContactOverlay
 * @returns {void} No return value, hides overlay and removes tracking classes from document body
 */
function closeFloatingContactOverlay() {
  document.body.classList.remove("was-mobile-overlay", "was-desktop-overlay");
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.style.display = "none";
    floatingContactContainer.innerHTML = "";
  }
}
