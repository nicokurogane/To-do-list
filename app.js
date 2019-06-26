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
    validateForm();
    getFormData();
}


function validateForm() {

}

function getFormData() {
    let formChildren = Array.from(form.elements);
    var taskObject = {};

    formChildren.forEach(element => {
        if (element.type !== 'submit') {
            if (element.type !== 'checkbox' || (element.type === 'checkbox' && element.checked))
                taskObject[element.name] = element.value;
        }
    });
    taskObject.creationDate = Date.now();
    console.log(taskObject);
    arrayTask.push(taskObject);
     console.log(arrayTask);
    addTaskToTable(taskObject);
}

function addTaskToTable(taskToAdd) {
    console.log(taskTable);    
    let newRow = `<tr>
                    <th scope="row">${taskToAdd.id}</th>
                    <td>${taskToAdd.task}</td>
                    <td>${taskToAdd.asignee}</td>
                    <td>${taskToAdd.status}</td>
                    <td>${taskToAdd.creationDate} </td>
                    <td>
                      <button type="button" onclick="deleteTask(${taskToAdd.id})"> X </button>
                    </td>
                </tr>`;
    const tr = document.createElement('tr');
    tr.innerHTML = newRow;
    taskTable.appendChild(tr);
    currentTaskId++;
    document.getElementById('id').value = currentTaskId;
}

function deleteTask(idToDelete){
    // console.log(idToDelete);  
    arrayTask = arrayTask.filter(task => task.id != idToDelete);
    // console.log(arrayTask);
}


