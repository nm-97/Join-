"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("summaryUser.html")) {
    rendersummaryMainContent();
    loadAllDataSimultaneously();
  }
});

function rendersummaryMainContent() {
  let summaryMainContent = getsummaryTemplate();
  const summaryElement = document.getElementById("summaryMainContent");
  if (summaryElement) {
    summaryElement.innerHTML = summaryMainContent;
  } else {
    console.error("summaryMainContent Element nicht gefunden!");
  }
}

async function loadAllDataSimultaneously() {
  try {
    const allTasks = await fetchTaskByUser();
    const taskCounts = countEveryTaskLength(allTasks);
    const nextDeadline = calculateNextDeadline(allTasks);
    updateAllCounters(taskCounts, nextDeadline);
    loadUserInfo();
  } catch (error) {
    console.error("Fehler beim Laden der Summary-Daten:", error);
  }
}

function countEveryTaskLength(allTasks) {
  return {
    todoCount: allTasks.filter((task) => task.Status === "toDo").length,
    doneCount: allTasks.filter((task) => task.Status === "done").length,
    inProgressCount: allTasks.filter((task) => task.Status === "inProgress")
      .length,
    awaitFeedbackCount: allTasks.filter(
      (task) => task.Status === "awaitFeedback"
    ).length,
    boardCount: allTasks.filter(
      (task) =>
        task.Status === "toDo" ||
        task.Status === "done" ||
        task.Status === "inProgress" ||
        task.Status === "awaitFeedback"
    ).length,
    urgentCount: allTasks.filter((task) => task.taskPriority === "Urgent")
      .length,
  };
}

function updateAllCounters(taskCounts, nextDeadline) {
  updateCounter("todoCounter", taskCounts.todoCount);
  updateCounter("doneCounter", taskCounts.doneCount);
  updateCounter("inProgressCounter", taskCounts.inProgressCount);
  updateCounter("awaitFeedbackCounter", taskCounts.awaitFeedbackCount);
  updateCounter("boardCounter", taskCounts.boardCount);
  updateCounter("highPriorityCounter", taskCounts.urgentCount);
  updateCounter("dueDateCounter", nextDeadline);
}

function loadUserInfo() {
  showLocalTimeFormUser();
  getUserName();
}
