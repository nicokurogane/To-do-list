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
    constructor(){
       this.TASK_ARRAY_KEY = "task";
    }

    saveTaskToLocalStorage(arrayTaskToAdd){
        localStorage.setItem(this.TASK_ARRAY_KEY, JSON.stringify(arrayTaskToAdd));
    }
}

class UI {
  constructor() {
    this.taskListTable = document.getElementById("task-table");
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
}

//-------------------------------------------------------
let taskList = new TaskList();
let uiHandler = new UI();
let storageHandler = new Storage();

var arrayTask = [];
const filtersToApply = {
  task: "",
  status: "",
  oldestToNewest: true
};
var currentTaskId = 1;
const taskTable = document.getElementById("task-table");
const TASK_ARRAY_KEY = "task";

//inicializamos la pagina con los datos ya cargados
window.addEventListener("load", function(event) {
  console.log("Aqui vamos a cargar el ID");

  document.getElementById("id").value = currentTaskId;

  if (localStorage.getItem(TASK_ARRAY_KEY) !== null) {
    arrayTask = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
    let lastHighestId = 0;
    arrayTask.forEach(task => {
      addTaskToTable(task);
      if (lastHighestId < task.id) lastHighestId = task.id;
    });
    currentTaskId = Number(lastHighestId) + 1;

    document.getElementById("id").value = currentTaskId;
  }
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

//TODO REFACTORIZAR ESTE METODO CON TASK Y TASKLIST
function addTask() {
  let taskId = document.getElementById("id").value;
  let taskName = document.getElementById("task").value;
  let taskAsignee = document.getElementById("asignee").value;
  let taskStatus = document.getElementById("status").value;

  let newTask = new Task(taskId, taskName, taskAsignee, taskStatus);
  taskList.createNewTask(newTask);
  uiHandler.addTaskToTable(newTask);
  storageHandler.addTaskToLocalStore(taskList.tasks);

  //Now that the task is added, we must update the currentId for new Tasks
  currentTaskId++;
  document.getElementById("id").value = currentTaskId;
}

function addTaskToTable(taskToAdd) {
  let newRow = `  <th scope="row">${taskToAdd.id}</th>
                    <td>${taskToAdd.task}</td>
                    <td>${taskToAdd.asignee}</td>
                    <td>${taskToAdd.status}</td>
                    <td>${new Date(taskToAdd.creationDate).toLocaleString(
                      "es-SV"
                    )}</td>
                    <td>
                      <button type="button" class="btn btn-danger" onclick="deleteTask(${
                        taskToAdd.id
                      })"> X </button>
                    </td>`;
  const tr = document.createElement("tr");
  tr.id = `task${taskToAdd.id}`;
  tr.innerHTML = newRow;
  taskTable.appendChild(tr);
}

function addTaskToLocalStore() {
  localStorage.setItem(TASK_ARRAY_KEY, JSON.stringify(arrayTask));
}

function deleteTaskFromLocalStore(idTaskToDelete) {
  let tempArray = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
  tempArray = tempArray.filter(task => task.id != idTaskToDelete);
  localStorage.setItem(TASK_ARRAY_KEY, JSON.stringify(tempArray));
}

function deleteTask(idToDelete) {
  arrayTask = arrayTask.filter(task => task.id != idToDelete);
  let rowToDelete = document.getElementById(`task${idToDelete}`);
  taskTable.removeChild(rowToDelete);
  deleteTaskFromLocalStore(idToDelete);
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
