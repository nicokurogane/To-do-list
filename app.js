var arrayTask = [];
var currentTaskId = 1;
const form = document.getElementById("task-form");
const taskTable = document.getElementById("task-table");


//inicializamos la pagina con los datos ya cargados
window.addEventListener('load', function (event) {
    console.log('Aqui vamos a cargar el ID');
    //TODO: que este ID sea asignado dinamicamente
    document.getElementById('id').value = currentTaskId;
    //TODO CARGAR EL ARRAY DEL LOCASTORE CUANDO SE CARGUE LA PAGINA
});


form.addEventListener('submit', handleSubmit);

//interceptamos el el submit para extraer la data
function handleSubmit(e) {
    e.preventDefault();
    if(validateForm()) addTask();
}

//devuelve false si el formulario no esta validado
function validateForm() {

    let inputTaskValue = String(document.getElementById('task').value);
    if( inputTaskValue.length > 100 || inputTaskValue === '' ){
        alert('task is not correct.');
        return false;
    }

    let statusInputsArray = Array.from(document.getElementsByName('status'));
    let numberOfChecked = 0;
    statusInputsArray.forEach( checkbox => {
        numberOfChecked += checkbox.checked ?  1:0;
    });

    if(numberOfChecked === 0){
        alert('you must select Status condition.');
        return false;
    } else if(numberOfChecked > 1){
        alert('only 1 Status condition is allowed.');
        return false;
    }

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
    addTaskToTable(taskObject);
}

function addTaskToTable(taskToAdd) {
    console.log(taskTable);    
    let newRow = `  <th scope="row">${taskToAdd.id}</th>
                    <td>${taskToAdd.task}</td>
                    <td>${taskToAdd.asignee}</td>
                    <td>${taskToAdd.status}</td>
                    <td>${taskToAdd.creationDate} </td>
                    <td>
                      <button type="button" onclick="deleteTask(${taskToAdd.id})"> X </button>
                    </td>`;
    const tr = document.createElement('tr');
    tr.id =`task${taskToAdd.id}`;
    tr.innerHTML = newRow;
    taskTable.appendChild(tr);

    //hijo agregado, pasamos actualizaremos el ID
    currentTaskId++;
    document.getElementById('id').value = currentTaskId;
}

function deleteTask(idToDelete){ 
    arrayTask = arrayTask.filter(task => task.id != idToDelete);
    let rowToDelete = document.getElementById(`task${idToDelete}`);
    taskTable.removeChild(rowToDelete);
}


