/**
 * @fileoverview Pure HTML templates for the Contacts page
 * Contains only template functions for rendering - NO LOGIC
 * @author Join Project Team
 * @v  return `
${mobileHeader}
<button class="floatingContactCloseBtn" onclick="closeFloatingContactOverlayResponsive()">
  <img src="../assets/icons/shared/backarrow.svg" alt="closeIcon">
</button>
${mobileMenuButton}
<div class="floatingContactCard">` 1.0.0
 */

/**
 * Generates contact template with optional alphabetical separator
 * @param {Object} contact - The contact object with enhanced render data
 * @param {boolean} showSeparator - Whether to show alphabetical separator
 * @param {string} letter - The alphabetical letter for separator
 * @returns {string} HTML string for contact with optional separator
 */
function getContactWithSeparator(contact, showSeparator = false, letter = "") {
  let separatorHTML = "";
  if (showSeparator && letter) {
    separatorHTML = `
    <div class="alphabetSeparator">
      <div class="alphabetLetter">${letter}</div>
    </div>`;
  }

  return separatorHTML + getContactTemplate(contact);
}

/**
 * Generates HTML template for a single contact item
 * @param {Object} contact - The contact object with initials and color
 * @returns {string} HTML string for the contact item
 */
function getContactTemplate(contact) {
  return `<div class="contactItem" onclick="handleContactClick('${contact.id}'); selectContactItem('${contact.id}');" id="${contact.id}" data-id="${contact.id}">
    <div class="contactAvatar" style="background-color: ${contact.color};">${contact.initials}</div>
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
                                  <div class="errorMessage hide"></div>
                                <div class="editContactBtnRow">
                                    <button type="button" class="editContactDeleteBtn" onclick="closeEditContactOverlay()">Delete
                                       </button>
                                    <button type="submit" class="editContactSaveBtn">Save
                                        <img src="../assets/icons/add task/check.svg" alt="saveIcon"></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;
}

/**
 * Generates HTML for the floating contact display
 * @param {Object} contact - The contact object with initials and color
 * @param {boolean} showMobileHeader - Whether to show mobile header
 * @param {boolean} showMobileMenuButton - Whether to show mobile menu button
 * @returns {string} HTML string for the floating contact
 */
function getFloatingContact(
  contact,
  showMobileHeader = false,
  showMobileMenuButton = false
) {
  const mobileHeader = showMobileHeader
    ? `
    <div class="mobileContactHeader">
      <h1>Contacts</h1>
      <span class="mobileContactSubtitle">Better with a team</span>
      <button class="floatingContactCloseBtn" onclick="closeFloatingContactOverlayResponsive()">
        <img src="../assets/icons/shared/close.svg" alt="Close">
      </button>
    </div>
  `
    : "";

  const mobileMenuButton = showMobileMenuButton
    ? `<button class="floating-menu-button" onclick="showContactMenu('${contact.id}')">⋮</button>`
    : "";

  return `
${mobileHeader}
<button class="floatingContactCloseBtn" onclick="closeFloatingContactOverlayResponsive()">
  <img src="../assets/icons/shared/backarrow.svg" alt="closeIcon">
</button>
<div class="floatingContactCard">
  <div class="floatingContactHeader">
    <div class="floatingContactAvatar" style="background-color: ${contact.color};">${contact.initials}</div>
    <div class="floatingContactName">
      <span>${contact.name}</span>
      <div class="floatingContactActions">
        <button onclick="showEditContactOverlay('${contact.id}')" class="editBtn">
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
${mobileMenuButton}
  `;
}

/**
 * Generates HTML for contact menu dropdown overlay
 * @param {string} contactId - The contact ID for the menu actions
 * @returns {string} HTML string for the dropdown overlay
 */
function getContactMenuOverlay(contactId) {
  return `
    <div class="contact-menu-overlay">
      <div class="contact-menu-content">
        <button class="floatingEditBtn" data-contact-id="${contactId}">
          <img src="../assets/icons/shared/edit.svg" alt="edit">
          <span>Edit</span>
        </button>
        <button class="floatingDeleteBtn" data-contact-id="${contactId}">
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
