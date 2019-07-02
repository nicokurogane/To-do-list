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
    this.filtersToApply = {
      task: "",
      status: "",
      oldestToNewest: true
    };
  }

  createNewTask(newTask) {
    this.tasks.push(newTask);
  }

  deleteTask(idTaskToDelete) {
    this.tasks = this.tasks.filter(task => task.id != idTaskToDelete);
  }

  searchTasksByName() {
    if (this.filtersToApply.task !== '')
      this.tasks = this.tasks.filter(currentTask => currentTask.name.includes(this.filtersToApply.task));
  }

  filterTasksByStatus() {
    if (this.filtersToApply.status !== '')
      this.tasks = this.tasks.filter(currentTask => currentTask.status.includes(this.filtersToApply.status));
  }

  sortTasksByDate(){
    this.tasks.sort( (taskA, taskB) => {
      let dateA = new Date(taskA.creationDate);
      let dateB = new Date(taskB.creationDate);
      if (!this.filtersToApply.oldestToNewest) {
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
      } else {
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
      }
      return 0;
    });
  }
}

class Storage {
  constructor() {
    this.TASK_ARRAY_KEY = "task";
  }

  saveTasksToLocalStorage(arrayTaskToAdd) {
    localStorage.setItem(this.TASK_ARRAY_KEY, JSON.stringify(arrayTaskToAdd));
  }

  deleteTaskFromLocalStore(idTaskToDelete) {
    let tempArray = this.getTasksFromLocalStorage();
    if (tempArray === null) return;
    tempArray = tempArray.filter(task => task.id != idTaskToDelete);
    this.saveTasksToLocalStorage(tempArray);
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

  rerenderTaskOnTable(arrayWithTasks) {
    while (this.taskListTable.firstChild) {
      this.taskListTable.removeChild(this.taskListTable.firstChild);
    }
    arrayWithTasks.forEach(task => {
      this.addTaskToTable(task);
    });
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


//inicializamos la pagina con los datos ya cargados
window.addEventListener("load", function (event) {
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

//DONE
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

//DONE
function deleteTask(idToDelete) {
  taskList.deleteTask(idToDelete);
  uiHandler.deleteTaskFromTable(idToDelete);
  storageHandler.deleteTaskFromLocalStore(idToDelete);
}

//Filters - DONE
document.getElementById("filter-text").addEventListener("keyup", function (e) {
  taskList.filtersToApply.task = e.target.value;
  rerenderFilteredTasks();
});

//DONE
document.getElementById("filter-status").addEventListener("change", function (e) {
  taskList.filtersToApply.status = e.target.value;
  rerenderFilteredTasks();
});

//TO-DO: PUT DOM MANIPULATION LOGIC ON OBJECT
document.getElementById("sort-date").addEventListener("click", function (e) {
  taskList.filtersToApply.oldestToNewest =  !taskList.filtersToApply.oldestToNewest;
  if (!taskList.filtersToApply.oldestToNewest) {
    document.getElementById("sort-date").value = "Sort by Date (Oldest First)";
  } else {
    document.getElementById("sort-date").value = "Sort by Date (Newest First)";
  }
  rerenderFilteredTasks();
});


//DONE
function rerenderFilteredTasks() {
  taskList.tasks = [];
  taskList.tasks = storageHandler.getTasksFromLocalStorage();
  taskList.searchTasksByName();
  taskList.filterTasksByStatus();
  taskList.sortTasksByDate();
  uiHandler.rerenderTaskOnTable(taskList.tasks);
}
