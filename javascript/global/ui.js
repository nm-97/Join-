function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function closeUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = "none";
}

function showSuccessAddTaskMessage(params) {
  const notificationHTML = getSuccessAddTaskMessageTemplate(params);
  document.body.insertAdjacentHTML('beforeend', notificationHTML);
  setTimeout(() => {
    const notification = document.getElementById('taskNotification');
    if (notification) {
      notification.remove();
    }
  }, 2000);
}

async function createTask() {
  const taskData = getFormData();
  if (!validateTaskData(taskData)) {
    return;
  }
  await addTaskToFirebase(taskData);
  showSuccessAddTaskMessage({ message: 'Task successfully created!' });
  clearForm();
}