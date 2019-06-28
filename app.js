var arrayTask = [];
var currentTaskId = 1;
var isSortOrderOldestToNewest = true;
const form = document.getElementById("task-form");
const taskTable = document.getElementById("task-table");
const TASK_ARRAY_KEY = "task";


//inicializamos la pagina con los datos ya cargados
window.addEventListener('load', function (event) {
    console.log('Aqui vamos a cargar el ID');

    document.getElementById('id').value = currentTaskId;

    if (localStorage.getItem(TASK_ARRAY_KEY) !== null) {
        //revisamos
        arrayTask = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
        let lastHighestId = 0;
        arrayTask.forEach(task => {
            addTaskToTable(task);
            if (lastHighestId < task.id) lastHighestId = task.id;
        });
        console.log('inicilizando IDS: ' + lastHighestId);
        currentTaskId = Number(lastHighestId) + 1;

        document.getElementById('id').value = currentTaskId;
    }
});


form.addEventListener('submit', handleSubmit);

//interceptamos el el submit para extraer la data
function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
        addTask();
    }
}

//devuelve false si el formulario no esta validado
function validateForm() {
    let inputTaskValue = String(document.getElementById('task').value);
    if (inputTaskValue.length > 100 || inputTaskValue === '') {
        alert('task is not correct.');
        return false;
    }

    let statusInputsArray = Array.from(document.getElementsByName('status'));
    let numberOfChecked = 0;
    statusInputsArray.forEach(checkbox => {
        numberOfChecked += checkbox.checked ? 1 : 0;
    });

    if (numberOfChecked !== 1) {
        alert('you must select 1 status condition.');
        return false;
    }

    return true;
}

function addTask() {
    let formChildren = Array.from(form.elements);
    var taskObject = {};

    formChildren.forEach(element => {
        if (element.type !== 'submit') {
            if (element.type !== 'checkbox' || (element.type === 'checkbox' && element.checked))
                taskObject[element.name] = element.value;
        }
    });
    taskObject.creationDate = new Date();
    arrayTask.push(taskObject);
    addTaskToLocalStore();
    addTaskToTable(taskObject);

    //hijo agregado, pasamos actualizaremos el ID
    currentTaskId++;
    document.getElementById('id').value = currentTaskId;
}

function addTaskToTable(taskToAdd) {
    let newRow = `  <th scope="row">${taskToAdd.id}</th>
                    <td>${taskToAdd.task}</td>
                    <td>${taskToAdd.asignee}</td>
                    <td>${taskToAdd.status}</td>
                    <td>${new Date(taskToAdd.creationDate).toLocaleString('es-SV')} </td>
                    <td>
                      <button type="button" class="btn btn-danger" onclick="deleteTask(${taskToAdd.id})"> X </button>
                    </td>`;
    const tr = document.createElement('tr');
    tr.id = `task${taskToAdd.id}`;
    tr.innerHTML = newRow;
    taskTable.appendChild(tr);
}

function addTaskToLocalStore() {
    localStorage.setItem(TASK_ARRAY_KEY, JSON.stringify(arrayTask));
}

function deleteTaskFromLocalStore(idTaskToDelete) {
    console.log(idTaskToDelete);
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

//FILTROS
document.getElementById('filter-text').addEventListener('keyup', function (e) {
    executeFilter('task', e.target.value);
});


document.getElementById('filter-status').addEventListener('keyup', function (e) {
    executeFilter('status', e.target.value);
});

document.getElementById('sort-date').addEventListener('click', function (e) {

    if (isSortOrderOldestToNewest) {
        document.getElementById('sort-date').value = "Sort by Date (Oldest First)";
    } else {
        document.getElementById('sort-date').value = "Sort by Date (Newest First)";
        
    }

    arrayTask.sort(function (a, b) {
        let dateA = new Date(a.creationDate)
        let dateB = new Date(b.creationDate);
        if (isSortOrderOldestToNewest) {
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
        } else {
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
        }
        return 0;
    });
    while (taskTable.firstChild) {
        taskTable.removeChild(taskTable.firstChild);
    }
    arrayTask.forEach(task => {
        addTaskToTable(task);
    });
    isSortOrderOldestToNewest = !isSortOrderOldestToNewest;
});

function executeFilter(propertyToUse, filter) {
    if (filter === '') {
        resetTaskTableFromLocalStorage();
        return;
    }

    arrayTask = arrayTask.filter(element => element[propertyToUse].includes(filter));
    while (taskTable.firstChild) {
        taskTable.removeChild(taskTable.firstChild);
    }
    arrayTask.forEach(task => {
        addTaskToTable(task);
    });
}

function resetTaskTableFromLocalStorage() {
    arrayTask = [];
    arrayTask = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
    while (taskTable.firstChild) {
        taskTable.removeChild(taskTable.firstChild);
    }
    arrayTask.forEach(task => {
        addTaskToTable(task);
    });
}