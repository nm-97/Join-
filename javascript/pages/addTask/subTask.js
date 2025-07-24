function initializeSubtask() {
  renderSubtasks([]);
  setupSubtaskEvents();
}

function setupSubtaskEvents() {
  setupSubtaskIconEvents();
  setupSubtaskInputEvents();
  setupSubtaskContainerEvents();
}

function setupSubtaskIconEvents() {
  const subtaskIcon = document.getElementById("createSubtaskButton");
  if (subtaskIcon) {
    subtaskIcon.onclick = function () {
      addSubtaskToTask();
    };
    subtaskIcon.style.cursor = "pointer";
  }
}

function setupSubtaskInputEvents() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) {
    subtaskInput.addEventListener("dblclick", function (e) {
      e.preventDefault();
      addSubtaskToTask();
    });
  }
}

function setupSubtaskContainerEvents() {
  const container = document.getElementById("editableDiv");
  if (container) {
    setupContainerDoubleClickEvents(container);
    setupContainerButtonClickEvents(container);
  }
}

function setupContainerDoubleClickEvents(container) {
  container.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("subtaskText")) {
      e.target.contentEditable = true;
      e.target.focus();
      hideSubtaskBtn();
    }
  });
}

function setupContainerButtonClickEvents(container) {
  container.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.closest(".deleteBtn")) {
      handleDeleteButtonClick(e);
    }
    if (e.target.closest(".checkBtn")) {
      handleCheckButtonClick(e);
    }
  });
}

function handleDeleteButtonClick(e) {
  const index = e.target.closest(".subtaskItem").dataset.index;
  deleteSubtask(parseInt(index));
}

function handleCheckButtonClick(e) {
  const subtaskItem = e.target.closest(".subtaskItem");
  const subtaskText = subtaskItem.querySelector(".subtaskText");
  const index = subtaskItem.dataset.index;
  editSubtaskText(parseInt(index), subtaskText.textContent.trim());
  subtaskText.contentEditable = false;
  hideSubtaskBtn();
}

function showSubTaskBtn(params) {
  const editableDiv = document.getElementById("editableDiv");
  if (!editableDiv) {
    subtaskBtn.classList.add = "";
    const subtaskBtn = document.getElementById("subtaskBtn");
    if (subtaskBtn) {
      subtaskBtn.style.display = params ? "block" : "none";
    }
  }
}

function addSubtaskToTask() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (!subtaskInput || !subtaskInput.value.trim()) {
    return;
  }
  const subtaskData = {
    id: Date.now().toString(),
    text: subtaskInput.value.trim(),
    completed: false,
  };
  if (typeof window.currentSubtasks === "undefined") {
    window.currentSubtasks = [];
  }
  window.currentSubtasks.push(subtaskData);
  subtaskInput.value = "";
  renderSubtasks(window.currentSubtasks);
}

function deleteSubtask(index) {
  if (typeof window.currentSubtasks !== "undefined") {
    window.currentSubtasks.splice(index, 1);
    renderSubtasks(window.currentSubtasks);
  }
}

function editSubtaskText(index, newText) {
  if (
    typeof window.currentSubtasks !== "undefined" &&
    window.currentSubtasks[index]
  ) {
    window.currentSubtasks[index].text = newText;
  }
}

function renderSubtasks(subtasks = []) {
  const subtaskData = selectSubtask(subtasks);
  const editableDiv = document.getElementById("editableDiv");
  if (editableDiv) {
    editableDiv.innerHTML = subtaskData;
  }
}

function hideSubtaskBtn() {
  const subtaskActionsContainers = document.querySelectorAll(".subtaskActions");
  const editableDiv = document.getElementById("editableDiv");
  const bulletPoints = document.querySelectorAll(".subtaskBullet");
  const isEditing =
    editableDiv && editableDiv.querySelector('[contenteditable="true"]');
  if (isEditing) {
    subtaskActionsContainers.forEach((container) =>
      container.classList.remove("hidden")
    );
    bulletPoints.forEach((bullet) => bullet.classList.add("hidden"));
  } else {
    subtaskActionsContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    bulletPoints.forEach((bullet) => bullet.classList.remove("hidden"));
  }
}
