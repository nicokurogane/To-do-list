var arrayTask = [];
var currentTaskId = 1;
const form = document.getElementById("task-form");
const taskTable = document.getElementById("task-table");
const TASK_ARRAY_KEY = "task";


//inicializamos la pagina con los datos ya cargados
window.addEventListener('load', function (event) {
    console.log('Aqui vamos a cargar el ID');
    //TODO: que este ID sea asignado dinamicamente
    document.getElementById('id').value = currentTaskId;

    if (localStorage.getItem(TASK_ARRAY_KEY) !== null) {
        arrayTask = JSON.parse(localStorage.getItem(TASK_ARRAY_KEY));
        arrayTask.forEach(task => {
            addTaskToTable(task);
        });
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
    taskObject.creationDate = Date.now();
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
                    <td>${taskToAdd.creationDate} </td>
                    <td>
                      <button type="button" onclick="deleteTask(${taskToAdd.id})"> X </button>
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

document.getElementById('filter-date').addEventListener('keyup', function (e) {
    executeFilter('creationDate', e.target.value);
});



function executeFilter(propertyToUse, filter) {
    if (filter === '') {
        resetTaskTableFromLocalStorage();
        return;
    }

    arrayTask = arrayTask.filter(element => String(element[propertyToUse]).includes(filter));
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


