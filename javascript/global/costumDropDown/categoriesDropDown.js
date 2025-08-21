/**
 * Categories dropdown management and selection
 * Handles category loading, rendering, and selection functionality
 */

let selectedDropdownCategory = "";
const categories = [
  { id: "technicalTask", name: "Technical Task" },
  { id: "userStory", name: "User Story" },
];

/**
 * Initializes and loads the categories dropdown with predefined categories
 * Sets up category dropdown with DOM ready checks and event handler configuration
 * @function loadCategories
 * @returns {void}
 */
function loadCategories() {
  const categoriesDropdownList = document.getElementById(
    "categoriesDropdownList"
  );
  if (!categoriesDropdownList) {
    // Element nicht gefunden - wird wahrscheinlich später dynamisch geladen
    return;
  }
  renderCategoriesDropdown(categories);
  setupDropdownEvents(
    "customCategoryDropdown",
    "categoryDropdownInput",
    "categoryDropdownArrow"
  );
  setupCategorySelection();
}

/**
 * Renders the categories dropdown list with provided category data for user selection
 * Creates HTML structure for category dropdown items using template functions
 * @function renderCategoriesDropdown
 * @param {Array} categories - Array of category objects with id and name properties
 * @returns {void}
 */
function renderCategoriesDropdown(categories) {
  const categoriesList = document.getElementById("categoriesDropdownList");
  if (!categoriesList) {
    return;
  }
  let html = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    html += generateCategoryItemTemplate(category);
  }
  categoriesList.innerHTML = html;
}

/**
 * Sets up click event listeners for category selection in the dropdown interface
 * Attaches event handlers to category items with proper event delegation
 * @function setupCategorySelection
 * @returns {void}
 */
function setupCategorySelection() {
  setTimeout(() => {
    const categoryItems = document.querySelectorAll("[data-category-id]");
    categoryItems.forEach((item) => {
      item.removeEventListener("click", handleCategoryClick);
      item.addEventListener("click", handleCategoryClick);
    });
  }, 150);
}

/**
 * Handles category selection click events and updates dropdown state accordingly
 * Processes user category selection by updating input field and closing dropdown
 * @function handleCategoryClick
 * @param {Event} e - The click event object from user interaction
 * @returns {void}
 */
function handleCategoryClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const categoryId = this.getAttribute("data-category-id");
  const categoryName = this.querySelector(".contactName").textContent;
  selectedDropdownCategory = categoryId;
  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  if (categoryDropdownInput) {
    categoryDropdownInput.value = categoryName;
  }
  closeDropdown("customCategoryDropdown");
}

/**
 * Returns the ID of the currently selected category for form processing and validation
 * Provides access to selected category identifier for downstream operations
 * @function getSelectedCategoryId
 * @returns {string} The selected category ID or empty string if none selected
 */
function getSelectedCategoryId() {
  return selectedDropdownCategory;
}

/**
 * Returns the name of the currently selected category from input field or internal state
 * Retrieves category display name with fallback logic for robust data access
 * @function getSelectedCategoryName
 * @returns {string} The selected category name or empty string if not found
 */
function getSelectedCategoryName() {
  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  const inputValue = categoryDropdownInput ? categoryDropdownInput.value : "";
  if (inputValue) {
    return inputValue;
  }
  if (selectedDropdownCategory) {
    const category = categories.find(
      (cat) => cat.id === selectedDropdownCategory
    );
    const categoryName = category ? category.name : "";
    return categoryName;
  }
  return "";
}
