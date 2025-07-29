/**
 * @fileoverview HTML templates for the Contacts page
 * Contains template functions for rendering contact items, overlays, and forms
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates contact template with optional alphabetical separator
 * @param {Object} contact - The contact object to render
 * @param {boolean} showSeparator - Whether to show alphabetical separator
 * @returns {string} HTML string for contact with optional separator
 */
function getContactWithSeparator(contact, showSeparator = false) {
  let separatorHTML = "";
  if (showSeparator) {
    const letter = contact.name.charAt(0).toUpperCase();
    separatorHTML = `
    <div class="alphabetSeparator">
      <div class="alphabetLetter">${letter}</div>
    </div>`;
  }

  return separatorHTML + getContactTemplate(contact);
}

/**
 * Generates HTML template for a single contact item
 * @param {Object} contact - The contact object to render
 * @returns {string} HTML string for the contact item
 */
function getContactTemplate(contact) {
  const initials = getInitials(contact.name);
  const color = getAvatarColor(contact.name);
  return `<div class="contactItem" onclick="handleContactClick('${contact.id}'); selectContactItem('${contact.id}');" id="${contact.id}" data-id="${contact.id}">
    <div class="contactAvatar" style="background-color: ${color};">${initials}</div>
    <div class="contactInfo">
      <div class="contactName">${contact.name}</div>
      <div class="contactEmail">${contact.email}</div>
    </div>
  </div>`;
}

/**
 * Generates HTML template for the Add Contact overlay modal
 * @returns {string} HTML string for the Add Contact overlay
 */
function getAddContactOverlay() {
  return `
         <div class="addContactModal">
                        <div class="addContactModalLeft">
                            <img class="addContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                            <h2 class="addContactTitle">Add contact</h2>
                            <p class="addContactSubtitle">Tasks are better with a team!</p>
                            <div class="addContactUnderline"></div>
                            <button class="addContactClose" onclick="closeAddContactOverlay()">
                                <img src="../assets/icons/shared/close.svg" alt="closeIcon">
                            </button>
                        </div>
                        <div class="addContactModalRight">
                            <div class="addContactFormAvatarPosition">
                                <div class="addContactAvatar">
                                    <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                                </div>
                                <form class="addContactForm" onsubmit="createContact(event)">
                                    <div class="addContactInputWrapper">
                                        <input type="text" name="name" placeholder="Name">
                                        <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="personIcon">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input name="email" placeholder="Email">
                                        <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="mailIcon">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input name="phone" placeholder="Phone">
                                        <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="phoneIcon">
                                    </div>
                                    <div class="errorMessage hide"></div>
                                    <div class="addContactBtnRow">
                                        <button type="button" class="addContactCancelBtn" onclick="closeAddContactOverlay()">Cancel
                                            <img src="../assets/icons/shared/close.svg" alt="cancelIcon"></button>
                                        <button type="submit" class="addContactCreateBtn">Create contact
                                            <img src="../assets/icons/add task/check.svg" alt="checkIcon"></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`;
}

/**
 * Generates HTML for the Edit Contact overlay modal
 * @param {Object} contact - The contact object to render in the edit form
 * @returns {string} HTML string for the edit contact overlay
 */
function getEditContactOverlay(contact) {
  return `<div class="editContactModal">
                    <div class="editContactModalLeft">
                        <img class="editContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                        <h2 class="editContactTitle">Edit contact</h2>
                        <div class="editContactUnderline"></div>
                    </div>
                    <div class="editContactModalRight">
                    <div class="addContactFormAvatarPosition">
                        <button class="editContactClose" onclick="closeEditContactOverlay()">
                            <img src="../assets/icons/shared/close.svg" alt="closeIcon">
                        </button>
                            <div class="editContactAvatar">
                                <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                            </div>
                            <form class="editContactForm" onsubmit="updateContact(event, '${contact.id}')">
                                <div class="editContactInputWrapper">
                                    <input type="text" name="name" placeholder="Name" value="${contact.name}">
                                    <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="personIcon">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input name="email" placeholder="Email" value="${contact.email}">
                                    <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="mailIcon">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input name="phone" placeholder="Phone" value="${contact.phone}">
                                    <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="phoneIcon">
                                </div>
                                <div class="editContactBtnRow">
                                    <button type="button" class="editContactDeleteBtn" onclick="closeEditContactOverlay()">Cancel
                                        <img src="../assets/icons/shared/close.svg" alt="cancelIcon"></button>
                                    <button type="submit" class="editContactSaveBtn">Save
                                        <img src="../assets/icons/add task/check.svg" alt="saveIcon"></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;
}

/**
 * Generates HTML for the floating contact detail overlay
 * @param {Object} contact - The contact object with details to display
 * @returns {string} HTML string for the floating contact content
 */
function getFloatingContact(contact) {
  const initials = getInitials(contact.name);
  const color = getAvatarColor(contact.name);

  return `<div class="floatingContactMainContent">
    <button class="floatingContactCloseBtn" onclick="closeFloatingContactOverlayResponsive()">
      <img src="../assets/icons/shared/backarrow.svg" alt="closeIcon">
    </button>
    <div class="floatingContactCard">
      <div class="floatingContactHeader">
        <div class="floatingContactAvatar" style="background-color: ${color};">${initials}</div>
        <div class="floatingContactName">
          <span>${contact.name}</span>
          <div class="floatingContactActions">
            <button onclick="showEditContactOverlay('${
              contact.id
            }')" class="editBtn">
              <img src="../assets/icons/shared/edit.svg" alt="editIcon">
              Edit
            </button>
            <button onclick="deleteContact('${contact.id}')" class="deleteBtn">
              <img src="../assets/icons/shared/delete.svg" alt="deleteIcon">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="floatingContactInfo">
        <div class="floatingContactInfoLabel">
          <p>Contact Information</p>
        </div>
        <div class="floatingContactInfoDetails">
          <span>Email</span><br>
          <a href="mailto:${contact.email}">${contact.email}</a><br><br>
          <span>Phone</span><br>
          <p>${contact.phone}</p>
        </div>
      </div>
    </div>
    ${getMobileMenuButton(contact.id)}
  </div>`;
}

/**
 * Generates HTML for mobile menu button if in mobile view
 * @param {string} contactId - The contact ID for the menu actions
 * @returns {string} HTML string for mobile menu button or empty string
 */
function getMobileMenuButton(contactId) {
  const isMobile = window.innerWidth <= 428;
  return isMobile
    ? `<button class="floating-menu-button" ontouchstart="showContactMenu('${contactId}')" onclick="showContactMenu('${contactId}')">⋮</button>`
    : "";
}

/**
 * Generates HTML for contact menu dropdown overlay
 * @param {string} contactId - The contact ID for the menu actions
 * @returns {string} HTML string for the dropdown overlay
 */
function getContactMenuOverlay(contactId) {
  return `
    <div class="contact-menu-overlay" ontouchstart="handleOverlayTouch(event)" onclick="handleOverlayClick(event)">
      <div class="contact-menu-content" ontouchstart="event.stopPropagation()" onclick="event.stopPropagation()">
        <button class="floatingEditBtn" ontouchstart="showEditContactOverlay('${contactId}'); closeContactMenu()" onclick="showEditContactOverlay('${contactId}'); closeContactMenu()">
          <img src="../assets/icons/shared/edit.svg" alt="edit">
          <span>Edit</span>
        </button>
        <button class="floatingDeleteBtn" ontouchstart="deleteContact('${contactId}'); closeContactMenu()" onclick="deleteContact('${contactId}'); closeContactMenu()">
          <img src="../assets/icons/shared/delete.svg" alt="delete">
          <span>Delete</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Generates HTML template for a temporary success notification
 * @param {Object} params - Parameters object for the message
 * @param {string} params.message - The success message to display
 * @returns {string} HTML string for the success notification element
 */
function getSuccessContactMessageTemplate(params = {}) {
  const message = params.message || "Contact successfully created";
  return `
<div id="addContactSuccess" class="ntfcenter ntfmask">${message}</div>`;
}
