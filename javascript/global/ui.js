function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function closeUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = "none";
}

function showSuccessAddTaskMessage() {
  const notification = document.getElementById('taskNotification');
  if (!notification) return;

  notification.classList.remove('hide');
  setTimeout(() => {
    notification.classList.add('hide');
  }, 2000);
}