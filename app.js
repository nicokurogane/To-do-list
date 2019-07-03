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
  if (validateForm()) {
    addTask();
  }
}

document
  .getElementById("edit-task-form")
  .addEventListener("submit", handleEditSubmit);

function handleEditSubmit(e) {
  e.preventDefault();
  //TODO: PONER VALIDACION TO EDIT
  editTask();
}

//TO-DO: SEPARATE THE VALIDATIONS TO A FILE CONTAINING EACH VALIDATION
function validateForm() {
  let inputTaskValue = String(document.getElementById("task").value);
  if (inputTaskValue.length > 100 || inputTaskValue === "") {
    alert(`Task musn't be longer than 100 characters and can't be null.`);
    return false;
  }

  let statusInputsArray = Array.from(document.getElementsByName("status"));
  let numberOfChecked = 0;
  statusInputsArray.forEach(checkbox => {
    numberOfChecked += checkbox.checked ? 1 : 0;
  });

  if (numberOfChecked !== 1) {
    alert("you must select 1 status condition.");
    return false;
  }
  return true;
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

function setTaskToEdit(taskIdToEdit) {
  $("#modal-edit-task").modal("show"); //VALIDAR ESTO CON GERARDO
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

//'''''''''''''''''''''''''''''''''Filters'''''''''''''''''''''''''''''''''''''  DONE
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
