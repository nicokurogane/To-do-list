//TODO: HACER LOS IMPORT DE LAS CLASES

//-----------------------------------------------------------------------------------
let taskList = new TaskList();
let uiHandler = new UI();
let storageHandler = new Storage();

//inicializamos la pagina con los datos ya cargados
window.addEventListener("load", function(event) {
  let arrayFromLocalStorage = storageHandler.getTasksFromLocalStorage();
  taskList.tasks = arrayFromLocalStorage;
  uiHandler.initForm(arrayFromLocalStorage);
});

document.getElementById("task-form").addEventListener("submit", handleSubmit);

//interceptamos el el submit para extraer la data
function handleSubmit(e) {
  e.preventDefault();
  if (validateForm(["task-invalid", "status-invalid"], "task", "status")) {
    addTask();
  }
}

document
  .getElementById("edit-task-form")
  .addEventListener("submit", handleEditSubmit);

function handleEditSubmit(e) {
  e.preventDefault();
  if (
    validateForm(
      ["edit-task-invalid", "edit-status-invalid"],
      "edit-task",
      "edit-status"
    )
  ) {
    editTask();
  }
}

document.getElementById("delete-task-button").addEventListener("click", e => {
  let idToDelete = document.getElementById("delete-task-id").innerText;
  deleteTask(idToDelete);
  $("#confirm-delete-modal").modal("hide");
});

function validateForm(messageLabels, taskNameInputId, statusInputId) {
  uiHandler.hideInvalidMessages(messageLabels);
  let numberOfInvalids = 0;
  let inputTaskValue = document.getElementById(taskNameInputId).value;

  if (Validator.isStringAboveLengthLimit(100, inputTaskValue)) {
    uiHandler.showInvalidMessage(messageLabels[0]);
    numberOfInvalids++;
  }

  if (Validator.isStringEmpty(inputTaskValue)) {
    uiHandler.showInvalidMessage(messageLabels[0]);
    numberOfInvalids++;
  }

  if ( Validator.isOnlyOneCheckBoxSelected(document.getElementsByName(statusInputId))) {
    uiHandler.showInvalidMessage(messageLabels[1]);
    numberOfInvalids++;
  }
  return numberOfInvalids === 0;
}

function addTask() {
  let taskId = document.getElementById("id").value;
  let taskName = document.getElementById("task").value;
  let taskAsignee = document.getElementById("asignee").value;
  let taskStatus = document.querySelector('input[name="status"]:checked').value;

  let newTask = new Task(taskId, taskName, taskAsignee, taskStatus);
  taskList.createNewTask(newTask);
  uiHandler.addTaskToTable(newTask);
  storageHandler.saveTasksToLocalStorage(taskList.tasks);
  uiHandler.updateTasksId();
}

function deleteTask(idToDelete) {
  taskList.deleteTask(idToDelete);
  uiHandler.deleteTaskFromTable(idToDelete);
  storageHandler.deleteTaskFromLocalStore(idToDelete);
}

function confirmDeleteTask(idToDelete) {
  $("#confirm-delete-modal").modal("show");
  document.getElementById("delete-task-id").innerText = idToDelete;
}

function setTaskToEdit(taskIdToEdit) {
  $("#modal-edit-task").modal("show");
  taskToEdit = taskList.getTaskById(taskIdToEdit);
  uiHandler.showTaskDataOnEditForm(taskToEdit);
}

function editTask() {
  let editedTask = uiHandler.getEditedTask();
  taskList.putEditedTask(editedTask);
  storageHandler.saveTasksToLocalStorage(taskList.tasks);
  uiHandler.rerenderTaskOnTable(taskList.tasks);
  $("#modal-edit-task").modal("hide");
}

//'''''''''''''''''''''''''''''''''Filters'''''''''''''''''''''''''''''''''''''
document.getElementById("filter-text").addEventListener("keyup", function(e) {
  taskList.filtersToApply.task = e.target.value;
  rerenderFilteredTasks();
});

document
  .getElementById("filter-status")
  .addEventListener("change", function(e) {
    taskList.filtersToApply.status = e.target.value;
    rerenderFilteredTasks();
  });

document.getElementById("sort-date").addEventListener("click", function(e) {
  taskList.filtersToApply.oldestToNewest = !taskList.filtersToApply
    .oldestToNewest;
  uiHandler.changeSortByDateText(taskList.filtersToApply.oldestToNewest);
  rerenderFilteredTasks();
});

function rerenderFilteredTasks() {
  taskList.tasks = [];
  taskList.tasks = storageHandler.getTasksFromLocalStorage();
  taskList.searchTasksByName();
  taskList.filterTasksByStatus();
  taskList.sortTasksByDate();
  uiHandler.rerenderTaskOnTable(taskList.tasks);
}
