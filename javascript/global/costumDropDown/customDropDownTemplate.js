/**
 * Template functions for custom dropdown HTML generation
 * Contains all HTML template generation logic for dropdown components
 */

/**
 * Generates HTML template for a single contact item in the dropdown
 * Creates interactive contact element with avatar, name, and checkbox
 * @function generateContactItemTemplate
 * @param {Object} contact - Contact object with id, name properties
 * @param {string} initials - Contact initials for avatar display
 * @param {string} avatarColor - Background color for contact avatar
 * @param {string} displayName - Name to display (may include "(You)" suffix)
 * @returns {string} HTML string for contact item
 */
function generateContactItemTemplate(
  contact,
  initials,
  avatarColor,
  displayName
) {
  return `
    <div class="contactItem" data-contact-id="${contact.id}">
      <div class="contactAvatar" style="background-color: ${avatarColor};">${initials}</div>
      <span class="contactName">${displayName}</span>
      <input type="checkbox" class="customCheckbox" id="contact-${contact.id}" value="${contact.id}" />
      <label for="contact-${contact.id}"></label>
    </div>
  `;
}

/**
 * Generates HTML template for selected contact avatar display
 * Creates clickable avatar element with remove functionality
 * @function generateSelectedContactAvatarTemplate
 * @param {Object} contact - Contact object with id, name properties
 * @param {string} initials - Contact initials for avatar display
 * @param {string} avatarColor - Background color for contact avatar
 * @returns {string} HTML string for selected contact avatar
 */
function generateSelectedContactAvatarTemplate(contact, initials, avatarColor) {
  return `
    <div class="selectedContactAvatar" 
         style="background-color: ${avatarColor};" 
         data-contact-id="${contact.id}"
         title="${contact.name}"
         onclick="removeContactSelection('${contact.id}')">
      ${initials}
    </div>
  `;
}

/**
 * Generates HTML template for overflow indicator when too many contacts selected
 * Shows "+X more" indicator for additional selected contacts beyond display limit
 * @function generateOverflowIndicatorTemplate
 * @param {number} remainingCount - Number of additional contacts not displayed
 * @returns {string} HTML string for overflow indicator
 */
function generateOverflowIndicatorTemplate(remainingCount) {
  return `
    <div class="selectedContactAvatar" 
         style="background-color: #cccccc; color: #666666;"
         title="${remainingCount} more contacts selected">
      +${remainingCount}
    </div>
  `;
}

/**
 * Generates HTML template for category dropdown item
 * Creates selectable category element for task categorization
 * @function generateCategoryItemTemplate
 * @param {Object} category - Category object with id, name properties
 * @returns {string} HTML string for category item
 */
function generateCategoryItemTemplate(category) {
  return `
    <div class="contactItem" data-category-id="${category.id}">
      <div class="contactInfo">
        <span class="contactName">${category.name}</span>
      </div>
    </div>
  `;
}
