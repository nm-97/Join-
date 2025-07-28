/**
 * @fileoverview Loading screen functionality for the JOIN application
 * Handles the display and hiding of loading animations and login elements
 * @author Join Project Team
 * @version 1.0.0
 */

let animationStarted = false;

/**
 * Initializes the loading screen animation when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  if (animationStarted) return;
  animationStarted = true;
  
  const header = document.querySelector(".logoPageHeader");
  const main = document.querySelector(".LogInMainContainer");
  const footer = document.querySelector("footer");
  
  if (header) header.classList.add("hide");
  if (main) main.classList.add("hide");
  if (footer) footer.classList.add("hide");
  
  setTimeout(() => {
    if (header) {
      header.classList.remove("hide");
      header.classList.add("content-appear");
    }
    if (main) {
      main.classList.remove("hide");
      main.classList.add("content-appear");
    }
    if (footer) {
      footer.classList.remove("hide");
      footer.classList.add("content-appear");
    }
  }, 1100);
});