"use strict";

const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";

function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateNextDeadline(allTasks) {
  const today = new Date();
  const futureTasks = allTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today;
  });
  if (futureTasks.length === 0) {
    return "No upcoming deadlines";
  }
  const nextTask = futureTasks.reduce((earliest, task) => {
    const taskDate = new Date(task.dueDate);
    const earliestDate = new Date(earliest.dueDate);
    return taskDate < earliestDate ? task : earliest;
  });
  return formatDate(nextTask.dueDate);
}

const groupContactsByLetter = (contacts) => {
  return contacts.reduce((grouped, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    grouped[firstLetter] = grouped[firstLetter] || [];
    grouped[firstLetter].push(contact);
    return grouped;
  }, {});
};

function mapCategoryToFirebase(category) {
  const categoryMap = {
    userStory: "User Story",
    technicalTask: "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
}

const getContactFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  phone: new FormData(event.target).get("phone"),
});

function updateCounter(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}
