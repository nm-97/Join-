/**
 * @fileoverview Loading screen functionality for the JOIN application
 * Handles the display and hiding of loading animations and login elements
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Hides login elements before animation and shows them after 2 seconds
 * Removes 'hide' class from logo, main container, and footer elements
 */
function hideLogInbeforeAnimation() {
  setTimeout(() => {
    document.querySelector(".logoPageHeader")?.classList.remove("hide");
    document.querySelector(".LogInMainContainer")?.classList.remove("hide");
    document.querySelector("footer")?.classList.remove("hide");
  }, 2000);
}

/**
 * Initializes the loading screen animation when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  hideLogInbeforeAnimation();
});
