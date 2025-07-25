let allContacts = [];
let selectedContacts = [];

async function loadContacts() {
  try {
    let contacts = await fetchContactsByIdAndUser();
    const currentUser = getCurrentUser();

    if (currentUser.type === "registered") {
      const userAlreadyInContacts = contacts.some(
        (contact) => contact.id === currentUser.id
      );

      if (!userAlreadyInContacts) {
        const currentUserContact = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: "",
          address: "",
        };
        contacts.unshift(currentUserContact);
      }
    }

    allContacts = contacts;
    renderContactsDropdown(allContacts);
    setupDropdownEvents("customDropdown", "dropdownInput", "dropdownArrow");
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

function renderContactsDropdown(contacts) {
  const contactsList = document.getElementById("contactsDropdownList");
  if (!contactsList) return;

  let html = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials = getInitials(contact.name);
    const avatarColor = getAvatarColor(contact.name);
    const currentUser = getCurrentUser();
    const isCurrentUser =
      currentUser.type === "registered" && contact.id === currentUser.id;
    const displayName = isCurrentUser ? `${contact.name} (You)` : contact.name;

    html += `
     <div class="contactItem" data-contact-id="${contact.id}">
       <div class="contactAvatar" style="background-color: ${avatarColor};">${initials}</div>
       <span class="contactName">${displayName}</span>
       <input type="checkbox" class="customCheckbox" id="contact-${contact.id}" value="${contact.id}" />
       <label for="contact-${contact.id}"></label>
     </div>
   `;
  }

  contactsList.innerHTML = html;
  setupContactCheckboxes();
}

function setupDropdownEvents(dropdownId, inputId, arrowId) {
  const dropdown = document.getElementById(dropdownId);
  const dropdownInput = document.getElementById(inputId);
  const dropdownArrow = document.getElementById(arrowId);
  if (!dropdown || !dropdownInput || !dropdownArrow) return;
  dropdownArrow.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(dropdownId);
  });
  dropdownInput.addEventListener("focus", function () {
    openDropdown(dropdownId);
  });
  dropdownInput.addEventListener("click", function () {
    openDropdown(dropdownId);
  });
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown(dropdownId);
    }
  });
  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown.classList.contains("open")) {
    closeDropdown(dropdownId);
  } else {
    openDropdown(dropdownId);
  }
}

function openDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.add("open");
  }
}

function closeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.remove("open");
  }
}

function filterContacts(searchTerm) {
  const contactItems = document.querySelectorAll(".contactItem");
  contactItems.forEach(function (item) {
    const contactName = item
      .querySelector(".contactName")
      .textContent.toLowerCase();
    if (contactName.includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function setupContactCheckboxes() {
  const checkboxes = document.querySelectorAll(".contactItem .customCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      updateSelectedContacts();
      updateDropdownInput();
    });
  });
}

function updateSelectedContacts() {
  const checkedBoxes = document.querySelectorAll(
    ".contactItem .customCheckbox:checked"
  );
  selectedContacts = [];
  checkedBoxes.forEach(function (checkbox) {
    const contactId = checkbox.value;
    const contact = allContacts.find((c) => c.id === contactId);
    if (contact) {
      selectedContacts.push(contact);
    }
  });
}

function updateDropdownInput() {
  const dropdownInput = document.getElementById("dropdownInput");
  if (!dropdownInput) return;
  dropdownInput.value = "";
  dropdownInput.placeholder = "Select contacts to assign";
  updateSelectedContactsDisplay();
}

function updateSelectedContactsDisplay() {
  const displayContainer = document.getElementById("selectedContactsDisplay");
  if (!displayContainer) return;
  if (selectedContacts.length === 0) {
    displayContainer.innerHTML = "";
    return;
  }
  let html = "";
  const maxDisplay = 5;
  const contactsToShow = selectedContacts.slice(0, maxDisplay);
  for (let i = 0; i < contactsToShow.length; i++) {
    const contact = contactsToShow[i];
    const initials = getInitials(contact.name);
    const avatarColor = getAvatarColor(contact.name);
    html += `
     <div class="selectedContactAvatar" 
          style="background-color: ${avatarColor};" 
          data-contact-id="${contact.id}"
          title="${contact.name}"
          onclick="removeContactSelection('${contact.id}')">
       ${initials}
     </div>
   `;
  }
  if (selectedContacts.length > maxDisplay) {
    const remaining = selectedContacts.length - maxDisplay;
    html += `
     <div class="selectedContactAvatar" 
          style="background-color: #cccccc; color: #666666;"
          title="${remaining} more contacts selected">
       +${remaining}
     </div>
   `;
  }
  displayContainer.innerHTML = html;
}

function removeContactSelection(contactId) {
  const checkbox = document.getElementById(`contact-${contactId}`);
  if (checkbox) {
    checkbox.checked = false;
  }
  updateSelectedContacts();
  updateDropdownInput();
}

function getSelectedContactIds() {
  return selectedContacts.map((contact) => contact.id);
}

function clearContactSelections() {
  selectedContacts = [];
  const checkboxes = document.querySelectorAll(".contactItem .customCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
  updateDropdownInput();
}

let selectedDropdownCategory = "";
const categories = [
  { id: "technicalTask", name: "Technical Task" },
  { id: "userStory", name: "User Story" },
];

function loadCategories() {
  const categoriesDropdownList = document.getElementById(
    "categoriesDropdownList"
  );
  if (!categoriesDropdownList) return;

  renderCategoriesDropdown(categories);
  setupDropdownEvents(
    "customCategoryDropdown",
    "categoryDropdownInput",
    "categoryDropdownArrow"
  );
  setupCategorySelection();
}

function renderCategoriesDropdown(categories) {
  const categoriesList = document.getElementById("categoriesDropdownList");
  if (!categoriesList) {
    return;
  }

  let html = "";

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    html += `
     <div class="contactItem" data-category-id="${category.id}">
       <div class="contactInfo">
         <span class="contactName">${category.name}</span>
       </div>
     </div>
   `;
  }

  categoriesList.innerHTML = html;
}

function setupCategorySelection() {
  const categoryItems = document.querySelectorAll("[data-category-id]");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const categoryId = this.getAttribute("data-category-id");
      const categoryName = this.querySelector(".contactName").textContent;

      selectedDropdownCategory = categoryId;
      const categoryDropdownInput = document.getElementById(
        "categoryDropdownInput"
      );
      categoryDropdownInput.value = categoryName;
      closeDropdown("customCategoryDropdown");
    });
  });
}

function getSelectedCategoryId() {
  return selectedDropdownCategory;
}

function getSelectedCategoryName() {
  const categoryDropdownInput = document.getElementById(
    "categoryDropdownInput"
  );
  return categoryDropdownInput ? categoryDropdownInput.value : "";
}
