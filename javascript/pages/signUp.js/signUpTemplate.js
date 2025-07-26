/**
 * @fileoverview HTML templates for the Sign Up functionality
 * Contains template functions for rendering sign up success messages and notifications
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for the sign up success message notification
 * @param {Object} params - Parameters object containing message text
 * @returns {string} HTML string for the success notification
 */
function getSuccessSignUpMessageTemplate(params) {
  const message = params.message || "Sign Up successfull";
  return `
  <div class="ntfcenterS ntfmask" id="signUpToastMessage">${message}
   <img src="../assets/icons/board/checked button hover.svg" alt="checkIcon"></img>
    </div>`;
}

/**
 * Renders the sign up success message by inserting it into the DOM
 */
async function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate({ message: "Sign Up successful!" })
  );
}
