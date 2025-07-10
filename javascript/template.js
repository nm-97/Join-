function getAddContactOverlay(params) {
  return `
         <div class="addContactModal">
                        <div class="addContactModalLeft">
                            <img class="addContactLogo" src="../assets/img/Capa 1.png" alt="Join Logo">
                            <h2 class="addContactTitle">Add contact</h2>
                            <p class="addContactSubtitle">Tasks are better with a team!</p>
                            <div class="addContactUnderline"></div>
                        </div>
                        <div class="addContactModalRight">
                            <button class="addContactClose" onclick="closeOverlay()">
                                <img src="../assets/contacts/Close.svg" alt="">
                            </button>
                            <div class="addContactFormAvatarPosition">
                                <div class="addContactAvatar">
                                    <img src="../assets/contacts/person.svg" alt="Avatar">
                                </div>
                                <form class="addContactForm">
                                    <div class="addContactInputWrapper">
                                        <input type="text" placeholder="Name" required>
                                        <img src="../assets/contacts/person.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="email" placeholder="Email" required>
                                        <img src="../assets/contacts/mail.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="tel" placeholder="Phone" required>
                                        <img src="../assets/contacts/call.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactBtnRow">
                                        <button type="button" class="addContactCancelBtn" onclick="closeAddContactOverlay()">Cancel
                                            <img src="../assets/contacts/Close.svg" alt=""></button>
                                        <button type="submit" class="addContactCreateBtn">Create contact
                                            <img src="../assets/priority/check.svg" alt=""></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`;
}

function getEditContactOverlay(params) {
  return `
    <div id="editContactOverlay" class="editContactOverlay">
                <div class="editContactModal">
                    <div class="editContactModalLeft">
                        <img class="editContactLogo" src="../assets/img/Capa 1.png" alt="Join Logo">
                        <h2 class="editContactTitle">Edit contact</h2>
                        <div class="editContactUnderline"></div>
                    </div>
                    <div class="editContactModalRight">
                        <button class="editContactClose"
                            onclick="document.getElementById('editContactOverlay').style.display='none'">
                            <img src="../assets/contacts/Close.svg" alt="">
                        </button>
                        <div class="addContactFormAvatarPosition">
                            <div class="editContactAvatar">
                                <img src="../assets/contacts/person.svg" alt="Avatar">
                            </div>
                            <form class="editContactForm">
                                <div class="editContactInputWrapper">
                                    <input type="text" placeholder="Name" required>
                                    <img src="../assets/contacts/person.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="email" placeholder="Email" required>
                                    <img src="../assets/contacts/mail.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="tel" placeholder="Phone" required>
                                    <img src="../assets/contacts/call.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactBtnRow">
                                    <button type="button" class="editContactDeleteBtn">Cancel
                                        <img src="../assets/contacts/Close.svg" alt=""></button>
                                    <button type="submit" class="editContactSaveBtn">Save
                                        <img src="../assets/priority/check.svg" alt=""></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;
}
