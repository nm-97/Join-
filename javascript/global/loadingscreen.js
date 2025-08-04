let animationStarted = false;

/**
 * Initializes the loading screen animation when DOM content is loaded with element hiding and reveal
 * Manages page element visibility states during loading sequence with CSS class manipulation
 * Provides smooth page transition experience with timed animation for header, main, and footer elements
 * @function
 * @returns {void}
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
