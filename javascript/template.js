function getAddContactOverlay(params) {
  return `
         <div class="addContactModal">
                        <div class="addContactModalLeft">
                            <img class="addContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                            <h2 class="addContactTitle">Add contact</h2>
                            <p class="addContactSubtitle">Tasks are better with a team!</p>
                            <div class="addContactUnderline"></div>
                        </div>
                        <div class="addContactModalRight">
                            <button class="addContactClose" onclick="closeOverlay()">
                                <img src="../assets/icons/shared/close.svg" alt="">
                            </button>
                            <div class="addContactFormAvatarPosition">
                                <div class="addContactAvatar">
                                    <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                                </div>
                                <form class="addContactForm">
                                    <div class="addContactInputWrapper">
                                        <input type="text" placeholder="Name" required>
                                        <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="email" placeholder="Email" required>
                                        <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="tel" placeholder="Phone" required>
                                        <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactBtnRow">
                                        <button type="button" class="addContactCancelBtn" onclick="closeAddContactOverlay()">Cancel
                                            <img src="../assets/icons/shared/close.svg" alt=""></button>
                                        <button type="submit" class="addContactCreateBtn">Create contact
                                            <img src="../assets/icons/add task/check.svg" alt=""></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`;
}

function getEditContactOverlay(params) {
  return `<div class="editContactModal">
                    <div class="editContactModalLeft">
                        <img class="editContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                        <h2 class="editContactTitle">Edit contact</h2>
                        <div class="editContactUnderline"></div>
                    </div>
                    <div class="editContactModalRight">
                        <button class="editContactClose" onclick="closeEditContactOverlay()">
                            <img src="../assets/contacts/Close.svg" alt="">
                        </button>
                        <div class="addContactFormAvatarPosition">
                            <div class="editContactAvatar">
                                <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                            </div>
                            <form class="editContactForm">
                                <div class="editContactInputWrapper">
                                    <input type="text" placeholder="Name" required>
                                    <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="email" placeholder="Email" required>
                                    <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="tel" placeholder="Phone" required>
                                    <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactBtnRow">
                                    <button type="button" class="editContactDeleteBtn">Cancel
                                        <img src="../assets/contacts/Close.svg" alt=""></button>
                                    <button type="submit" class="editContactSaveBtn">Save
                                        <img src="../assets/icons/add task/check.svg" alt=""></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;
}

function getFloatingContact(contact) {
  const initials = contact.name.charAt(0).toUpperCase();
  const color = getAvatarColor(contact.name);

  return `<div class="floatingContactMainContent">
    <div class="floatingContactCard">
      <div class="floatingContactHeader">
        <div class="floatingContactAvatar" style="background-color: ${color};">${initials}</div>
        <div class="floatingContactName">
          <span>${contact.name}</span>
          <div class="floatingContactActions">
            <button onclick="showEditContactOverlay('${contact.id}')" class="editBtn">
              <img src="../assets/icons/shared/edit.svg" alt="">
              Edit
            </button>
            <button class="deleteBtn">
              <img src="../assets/icons/shared/delete.svg" alt="">
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
  </div>`;
}

function getContactTemplate(contact) {
  const initials = contact.name.charAt(0).toUpperCase();
  const color = getAvatarColor(contact.name);

  return `<div class="contactItem" onclick="showFloatingContact()">
    <div class="contactAvatar" style="background-color: ${color};">${initials}</div>
    <div class="contactInfo">
      <div class="contactName">${contact.name}</div>
      <div class="contactEmail">${contact.email}</div>
    </div>
  </div>`;
}

function getAvatarColor(name) {
  const colors = ["#FF8A00", "#9327FF", "#29ABE2", "#FF5EB3", "#6E52FF"];
  return colors[name.charCodeAt(0) % colors.length];
}
