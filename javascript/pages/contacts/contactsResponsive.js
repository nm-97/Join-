/**
 * @fileoverview Responsive overlay management for contacts page
 * Handles mobile/desktop overlay positioning, resize events, configuration, and responsive behavior
 * @author Join Project Team
 * @version 1.0.0
 * @requires contactsResponsiveEvents.js for event handling functionality
 * @requires contactsUIHelpers.js for contact data enhancement and mobile configuration
 * @requires contactsTemplates.js for HTML template generation
 */

/**
 * Handles window resize events to properly manage floating contact overlay positioning with responsive behavior
 * Detects overlay presence, determines if auto-close is needed, and handles overlay resize operations
 * Provides comprehensive window resize handling for responsive overlay management and positioning
 * @function resize event listener
 * @returns {void} No return value, performs window resize event handling and overlay management
 */
window.addEventListener("resize", () => {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );

  if (floatingContactContainer && floatingContactContainer.innerHTML) {
    if (shouldAutoCloseOverlayOnResize()) {
      closeFloatingContactOverlayResponsive();
      return;
    }

    handleFloatingOverlayResize();
  }
});

/**
 * Determines if the floating overlay should be automatically closed on resize with mode detection
 * Checks current width, previous overlay mode, and determines if mode change requires overlay closure
 * Provides overlay auto-close logic for responsive mode transitions with state cleanup
 * @function shouldAutoCloseOverlayOnResize
 * @returns {boolean} True if overlay should be closed due to responsive mode change, false otherwise
 */
function shouldAutoCloseOverlayOnResize() {
  const currentWidth = window.innerWidth;
  const wasMobile = document.body.classList.contains("was-mobile-overlay");
  const wasDesktop = document.body.classList.contains("was-desktop-overlay");
  const isNowMobile = currentWidth <= 1024;
  const isNowDesktop = currentWidth > 1024;
  if ((wasMobile && isNowDesktop) || (wasDesktop && isNowMobile)) {
    document.body.classList.remove("was-mobile-overlay", "was-desktop-overlay");
    return true;
  }
  return false;
}

/**
 * Tracks the current overlay mode for resize detection with CSS class management
 * Removes existing mode classes, determines current device type, and adds appropriate tracking class
 * Provides overlay mode tracking functionality for responsive state management and resize detection
 * @function trackOverlayMode
 * @returns {void} No return value, performs overlay mode tracking with CSS class updates
 */
function trackOverlayMode() {
  const isMobile = window.innerWidth <= 1024;
  document.body.classList.remove("was-mobile-overlay", "was-desktop-overlay");
  if (isMobile) {
    document.body.classList.add("was-mobile-overlay");
  } else {
    document.body.classList.add("was-desktop-overlay");
  }
}

/**
 * Handles floating overlay resize with element gathering and responsive configuration
 * Validates overlay container, gathers DOM elements, and configures overlay for current device type
 * Provides comprehensive overlay resize handling with mobile header management and device-specific setup
 * @function handleFloatingOverlayResize
 * @returns {void} No return value, performs overlay resize handling and responsive configuration
 */
function handleFloatingOverlayResize() {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (!floatingContactContainer || !floatingContactContainer.innerHTML) return;

  const overlayElements = gatherOverlayElements();
  configureOverlayForDevice(floatingContactContainer, overlayElements);
}

/**
 * Gathers all necessary DOM elements for overlay configuration
 * @function gatherOverlayElements
 * @returns {Object} Object containing all overlay-related DOM elements
 */
function gatherOverlayElements() {
  return {
    isMobile: isMobileDevice(),
    contactsList: document.getElementById("contactsList"),
    addContactButton: document.getElementById("addContactButton"),
    contactsMainContent: document.getElementById("contactsMainContent"),
    contactsRightPanel: document.getElementById("contactsRightPanel"),
  };
}

/**
 * Configures overlay for current device type with proper element setup
 * @function configureOverlayForDevice
 * @param {HTMLElement} floatingContactContainer - The floating contact container
 * @param {Object} elements - Object containing overlay elements
 * @returns {void} No return value, performs device-specific overlay configuration
 */
function configureOverlayForDevice(floatingContactContainer, elements) {
  handleMobileHeaderVisibility(floatingContactContainer);
  if (elements.isMobile) {
    configureMobileFloatingContact(
      floatingContactContainer,
      elements.contactsList,
      elements.addContactButton,
      elements.contactsMainContent
    );
  } else {
    configureDesktopFloatingContact(
      floatingContactContainer,
      elements.contactsList,
      elements.addContactButton,
      elements.contactsRightPanel
    );
  }
}

/**
 * Adds mobile header to the floating contact container with close button and styling
 * Creates header HTML with title, subtitle, and close button, then inserts at container beginning
 * Provides mobile header functionality with proper close button integration and responsive design
 * @function addMobileHeader
 * @param {HTMLElement} floatingContactContainer - The floating contact container to add header to
 * @returns {void} No return value, performs mobile header insertion with HTML content
 */
function addMobileHeader(floatingContactContainer) {
  const headerHTML = `
    <div class="mobileContactHeader">
      <h1>Contacts</h1>
      <span class="mobileContactSubtitle">Better with a team</span>
      <button class="floatingContactCloseBtn" onclick="closeFloatingContactOverlayResponsive()">
        <img src="../assets/icons/shared/close.svg" alt="Close">
      </button>
    </div>
  `;
  floatingContactContainer.insertAdjacentHTML("afterbegin", headerHTML);
}

/**
 * Removes mobile header from the floating contact container with element cleanup
 * Searches for existing mobile header element and removes it from container if found
 * Provides mobile header removal functionality for responsive state management and cleanup
 * @function removeMobileHeader
 * @param {HTMLElement} floatingContactContainer - The floating contact container to remove header from
 * @returns {void} No return value, performs mobile header element removal
 */
function removeMobileHeader(floatingContactContainer) {
  const existingHeader = floatingContactContainer.querySelector(
    ".mobileContactHeader"
  );
  if (existingHeader) {
    existingHeader.remove();
  }
}

/**
 * Handles mobile header visibility based on screen size with conditional add/remove logic
 * Checks screen width, detects existing header, and adds or removes header based on mobile state
 * Provides dynamic mobile header management for responsive overlay behavior and proper UI state
 * @function handleMobileHeaderVisibility
 * @param {HTMLElement} floatingContactContainer - The floating contact container to manage header for
 * @returns {void} No return value, performs conditional mobile header visibility management
 */
function handleMobileHeaderVisibility(floatingContactContainer) {
  const shouldShowHeader = window.innerWidth <= 1024;
  const existingHeader = floatingContactContainer.querySelector(
    ".mobileContactHeader"
  );
  if (shouldShowHeader && !existingHeader) {
    addMobileHeader(floatingContactContainer);
  } else if (!shouldShowHeader && existingHeader) {
    removeMobileHeader(floatingContactContainer);
  }
}

/**
 * Configures the floating contact overlay for mobile view with fullscreen setup and element hiding
 * Hides contacts list and add button, adds overlay classes, moves container to body, and configures mobile styling
 * Provides mobile-specific overlay configuration with proper element management and CSS class application
 * @function configureMobileFloatingContact
 * @param {HTMLElement} floatingContactContainer - The floating overlay container to configure for mobile
 * @param {HTMLElement} contactsList - The contacts list element to hide during mobile overlay
 * @param {HTMLElement} addContactButton - The add contact button to hide during mobile overlay
 * @param {HTMLElement} contactsMainContent - The main content container (unused, can be null)
 * @returns {void} No return value, performs mobile overlay configuration with element visibility management
 */
function configureMobileFloatingContact(
  floatingContactContainer,
  contactsList,
  addContactButton,
  contactsMainContent
) {
  if (contactsList) contactsList.style.display = "none";
  if (addContactButton) {
    addContactButton.style.display = "none";
    addContactButton.classList.add("floating-hidden");
  }
  document.body.classList.add("floating-overlay-open");
  document.body.appendChild(floatingContactContainer);
  floatingContactContainer.classList.add("mobile-fullscreen");
  floatingContactContainer.classList.remove("desktop-mode");
}

/**
 * Configures the floating contact overlay for desktop view with proper positioning and element management
 * Sets desktop mode classes, hides add button, adds overlay classes, and positions container in right panel
 * Provides desktop-specific overlay configuration with proper panel positioning and visibility control
 * @function configureDesktopFloatingContact
 * @param {HTMLElement} floatingContactContainer - The floating overlay container to configure for desktop
 * @param {HTMLElement} contactsList - The contacts list element to keep visible during desktop overlay
 * @param {HTMLElement} addContactButton - The add contact button to hide during desktop overlay
 * @param {HTMLElement} contactsRightPanel - The right panel container to receive the overlay
 * @returns {void} No return value, performs desktop overlay configuration with panel positioning
 */
function configureDesktopFloatingContact(
  floatingContactContainer,
  contactsList,
  addContactButton,
  contactsRightPanel
) {
  floatingContactContainer.classList.add("desktop-mode");
  floatingContactContainer.classList.remove("mobile-fullscreen");
  if (addContactButton) {
    addContactButton.style.display = "none";
    addContactButton.classList.add("floating-hidden");
  }
  document.body.classList.add("floating-overlay-open");
  if (contactsRightPanel) {
    contactsRightPanel.appendChild(floatingContactContainer);
  }
  if (contactsList) contactsList.style.display = "block";
}

/**
 * Shows floating contact overlay for responsive design with device-specific configuration
 * Gathers elements, sets content, tracks mode, configures for device type, and sets up content
 * Provides complete responsive contact overlay display with proper device-specific setup
 * @function showFloatingContactForResponsive
 * @param {Object} contact - The contact object to display in the floating overlay
 * @returns {void} No return value, performs responsive contact overlay display and configuration
 */
function showFloatingContactForResponsive(contact) {
  const overlaySetup = prepareResponsiveOverlaySetup(contact);
  configureResponsiveOverlay(overlaySetup);
  setupFloatingContactContent(overlaySetup.floatingContactContainer, contact);
}

/**
 * Prepares all elements and data needed for responsive overlay setup
 * @function prepareResponsiveOverlaySetup
 * @param {Object} contact - The contact object to display
 * @returns {Object} Object containing all setup data and elements
 */
function prepareResponsiveOverlaySetup(contact) {
  const isMobile = isMobileDevice();
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );

  const enhancedContact = getContactRenderData(contact);
  const mobileConfig = getMobileHeaderConfig();

  floatingContactContainer.innerHTML = getFloatingContact(
    enhancedContact,
    mobileConfig.shouldShow,
    mobileConfig.isTabletOrMobile
  );
  trackOverlayMode();

  return {
    isMobile,
    floatingContactContainer,
    contactsList: document.getElementById("contactsList"),
    addContactButton: document.getElementById("addContactButton"),
    contactsMainContent: document.getElementById("contactsMainContent"),
    contactsRightPanel: document.getElementById("contactsRightPanel"),
  };
}

/**
 * Configures the responsive overlay based on device type
 * @function configureResponsiveOverlay
 * @param {Object} setup - The overlay setup object containing elements and device info
 * @returns {void} No return value, performs device-specific overlay configuration
 */
function configureResponsiveOverlay(setup) {
  if (setup.isMobile) {
    configureMobileFloatingContact(
      setup.floatingContactContainer,
      setup.contactsList,
      setup.addContactButton,
      setup.contactsMainContent
    );
  } else {
    configureDesktopFloatingContact(
      setup.floatingContactContainer,
      setup.contactsList,
      setup.addContactButton,
      setup.contactsRightPanel
    );
  }
}

/**
 * Closes the floating contact overlay with responsive cleanup and state restoration
 * Removes mode classes, gathers elements, resets overlay display, and restores UI elements
 * Provides complete cleanup for responsive contact overlay closure with proper state management
 * @function closeFloatingContactOverlayResponsive
 * @returns {void} No return value, performs floating contact overlay closure and cleanup
 */
function closeFloatingContactOverlayResponsive() {
  resetOverlayModeClasses();
  const overlayElements = gatherFloatingOverlayElements();
  resetOverlayDisplay(overlayElements.floatingContactContainer);
  restoreUIElements(
    overlayElements.contactsList,
    overlayElements.addContactButton
  );
  document.body.classList.remove("floating-overlay-open");
}

/**
 * Removes overlay mode classes from document body
 * @function resetOverlayModeClasses
 * @returns {void} No return value, removes CSS classes from body
 */
function resetOverlayModeClasses() {
  document.body.classList.remove("was-mobile-overlay", "was-desktop-overlay");
}

/**
 * Gathers all elements needed for floating overlay cleanup
 * @function gatherFloatingOverlayElements
 * @returns {Object} Object containing DOM elements for overlay cleanup
 */
function gatherFloatingOverlayElements() {
  return {
    floatingContactContainer: document.getElementById("floatingContactOverlay"),
    contactsList: document.getElementById("contactsList"),
    addContactButton: document.querySelector(".addContactButton"),
  };
}

/**
 * Resets the overlay display and clears its content
 * @function resetOverlayDisplay
 * @param {HTMLElement} floatingContactContainer - The floating contact container element
 * @returns {void} No return value, resets overlay display and content
 */
function resetOverlayDisplay(floatingContactContainer) {
  if (floatingContactContainer) {
    floatingContactContainer.style.display = "none";
    floatingContactContainer.innerHTML = "";
  }
}

/**
 * Restores UI elements to their normal state after overlay closure
 * @function restoreUIElements
 * @param {HTMLElement} contactsList - The contacts list element
 * @param {HTMLElement} addContactButton - The add contact button element
 * @returns {void} No return value, restores UI element visibility and classes
 */
function restoreUIElements(contactsList, addContactButton) {
  if (contactsList) {
    contactsList.style.display = "block";
  }

  if (addContactButton) {
    addContactButton.style.display = "flex";
    addContactButton.classList.remove("floating-hidden");
  }
}
