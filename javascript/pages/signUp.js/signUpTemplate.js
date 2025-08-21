/**
 * @fileoverview HTML templates for the Sign Up functionality
 * Contains template functions for rendering sign up success messages and notifications
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for the sign up success message notification with customizable message content
 * Accepts parameters object, extracts message text with fallback, and returns formatted HTML string
 * Provides HTML template generation for sign up success notifications with icon and styling classes
 * @function getSuccessSignUpMessageTemplate
 * @param {Object} params - Parameters object containing configuration for the success message template
 * @param {string} [params.message] - The message text to display in the notification (defaults to "Sign Up successfull")
 * @returns {string} Complete HTML string for the success notification with message, icon, and styling classes
 */
function getSuccessSignUpMessageTemplate(params) {
  const message = params.message || "Sign Up successfull";
  return `
  <div class="ntfcenterS ntfmask" id="signUpToastMessage">${message}
   <img src="../assets/icons/board/checked button hover.svg" alt="checkIcon"></img>
    </div>`;
}

/**
 * Renders the sign up success message by inserting it into the DOM with template generation
 * Generates success message template with predefined message and inserts HTML into document body
 * Provides complete sign up success message rendering with DOM insertion and template integration
 * @function renderSignUpSuccessMessage
 * @returns {Promise<void>} Promise that resolves when the success message has been rendered to the DOM
 */
async function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate({ message: "Sign Up successful!" })
  );
}
