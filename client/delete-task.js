
tasks.forEach((element) => {
  element.deleted = false;
});

/**The following function is being called in the "app.js" file by adding the following event at time of
  creating the delete button: "<button onclick="deleteTask(this)"> "
*/
function deleteTask(deleteBtn) {
  let getTaskId = deleteBtn.parentNode.parentNode.getAttribute("data-task-id");
  let section = findSection(getTaskId);
  let taskElement = section.querySelector(`[data-task-id="${getTaskId}"]`);

  let userConfirmation = confirm("Are you sure you want to delete this task?");
  if (!userConfirmation) {
    return;
  }

  section.removeChild(taskElement);
  tasks[getTaskId].deleted = true;
  removeDeletedTasks();
  //Call the "displayTasks" function in order to re-organize our "data-task-id's" for the remaining tasks
  displayTasks();
}

//Check whether the task the user wants to delete is in "to-do" section or in the "done" section
function findSection(TaskId) {
  if (tasks[TaskId].done) {
    let doneSection = document.getElementById("done-list");
    return doneSection;
  } else {
    let todoSection = document.getElementById("todo-list");
    return todoSection;
  }
}

//Remove deleted tasks from the "tasks" array by the forEach method
function removeDeletedTasks() {
  tasks.forEach((element) => {
    if (element.deleted === true) {
      tasks.splice(element, 1);
    }
  });
}
