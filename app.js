//TODO: pasa luego a un archivo
class Task {
  constructor(id, name, asignee, status, creationDate = new Date()) {
    this.id = id;
    this.name = name;
    this.asignee = asignee;
    this.status = status;
    this.creationDate = creationDate;
  }
}

class TaskList {
  constructor() {
    this.tasks = [];
  }

  createNewTask(newTask) {
    this.tasks.push(newTask);
  }
}

class Storage {
  constructor() {
    this.TASK_ARRAY_KEY = "task";
  }

  saveTasksToLocalStorage(arrayTaskToAdd) {
    localStorage.setItem(this.TASK_ARRAY_KEY, JSON.stringify(arrayTaskToAdd));
  }

  getTasksFromLocalStorage() {
    if (localStorage.getItem(this.TASK_ARRAY_KEY) !== null)
      return JSON.parse(localStorage.getItem(this.TASK_ARRAY_KEY));
    else return null;
  }
}

class UI {
  constructor() {
    this.taskListTable = document.getElementById("task-table");
    this.formTaskId = document.getElementById("id");
    this.currentTaskId = 1;
  }

  initForm(arrayTaskFromLocalStorage) {
    if (arrayTaskFromLocalStorage !== null) {
      let lastHighestId = 0;
      arrayTaskFromLocalStorage.forEach(task => {
        this.addTaskToTable(task);
        if (lastHighestId < task.id) lastHighestId = task.id;
      });
      this.currentTaskId = Number(lastHighestId) + 1;
    }
    this.formTaskId.value = this.currentTaskId;
  }

  addTaskToTable(taskToAdd) {
    let newRow = `  <th scope="row">${taskToAdd.id}</th>
        <td>${taskToAdd.name}</td>
        <td>${taskToAdd.asignee}</td>
        <td>${taskToAdd.status}</td>
        <td>${new Date(taskToAdd.creationDate).toLocaleString("es-SV")}</td>
        <td>
          <button type="button" class="btn btn-danger" onclick="deleteTask(${
            taskToAdd.id
          })"> X </button>
        </td>`;
    const tr = document.createElement("tr");
    tr.id = `task${taskToAdd.id}`;
    tr.innerHTML = newRow;
    this.taskListTable.appendChild(tr);
  }

  deleteTaskFromTable(taskIdToDelete) {
    let rowToDelete = document.getElementById(`task${taskIdToDelete}`);
    this.taskListTable.removeChild(rowToDelete);
  }

  updateTasksId() {
    this.currentTaskId++;
    this.formTaskId.value = this.currentTaskId;
  }
}

//-----------------------------------------------------------------------------------
let taskList = new TaskList();
let uiHandler = new UI();
let storageHandler = new Storage();

var arrayTask = [];
const filtersToApply = {
  task: "",
  status: "",
  oldestToNewest: true
};

const taskTable = document.getElementById("task-table");
const TASK_ARRAY_KEY = "task";

//inicializamos la pagina con los datos ya cargados
window.addEventListener("load", function(event) {
  let arrayFromLocalStorage = storageHandler.getTasksFromLocalStorage();
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

//devuelve false si el formulario no esta validado
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

function deleteTaskFromLocalStore(idTaskToDelete) {
  let tempArray = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
  tempArray = tempArray.filter(task => task.id != idTaskToDelete);
  localStorage.setItem(TASK_ARRAY_KEY, JSON.stringify(tempArray));
}

function deleteTask(idToDelete) {
//   arrayTask = arrayTask.filter(task => task.id != idToDelete);
//   let rowToDelete = document.getElementById(`task${idToDelete}`);
//   taskTable.removeChild(rowToDelete);
//   deleteTaskFromLocalStore(idToDelete);

    uiHandler.deleteTaskFromTable(idToDelete);
}

//Filters
document.getElementById("filter-text").addEventListener("keyup", function(e) {
  filtersToApply.task = e.target.value;
  rerenderFilteredTasks();
});

document
  .getElementById("filter-status")
  .addEventListener("change", function(e) {
    filtersToApply.status = e.target.value;
    rerenderFilteredTasks();
  });

document.getElementById("sort-date").addEventListener("click", function(e) {
  if (filtersToApply.oldestToNewest) {
    document.getElementById("sort-date").value = "Sort by Date (Oldest First)";
  } else {
    document.getElementById("sort-date").value = "Sort by Date (Newest First)";
  }

  arrayTask.sort(function(a, b) {
    let dateA = new Date(a.creationDate);
    let dateB = new Date(b.creationDate);
    if (filtersToApply.oldestToNewest) {
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
    } else {
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }
    return 0;
  });
  rerenderTaskOnTable(arrayTask);
  filtersToApply.oldestToNewest = !filtersToApply.oldestToNewest;
});

//REFACTOR THIS FUNCTION LATER
function resetTaskTableFromLocalStorage() {
  arrayTask = [];
  arrayTask = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
  rerenderTaskOnTable(arrayTask);
}

function rerenderTaskOnTable(arrayWithTasks) {
  while (taskTable.firstChild) {
    taskTable.removeChild(taskTable.firstChild);
  }
  arrayWithTasks.forEach(task => {
    addTaskToTable(task);
  });
}

function rerenderFilteredTasks() {
  resetTaskTableFromLocalStorage();
  if (filtersToApply.task !== "")
    arrayTask = arrayTask.filter(element =>
      element["task"].includes(filtersToApply.task)
    );
  if (filtersToApply.status !== "")
    arrayTask = arrayTask.filter(element =>
      element["status"].includes(filtersToApply.status)
    );
  arrayTask.sort(function(a, b) {
    let dateA = new Date(a.creationDate);
    let dateB = new Date(b.creationDate);
    if (!filtersToApply.oldestToNewest) {
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
    } else {
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }
    return 0;
  });
  rerenderTaskOnTable(arrayTask);
}
