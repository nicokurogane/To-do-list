const arrayTask = [];
const form = document.getElementById("task-form");
const taskTable = document.getElementById("task-table");
const currentTaskId = 1;

//inicializamos la pagina con los datos ya cargados
window.addEventListener('load', function (event) {
    console.log('Aqui vamos a cargar el ID');
    //TODO: que este ID sea asignado dinamicamente
    document.getElementById('id').value = currentTaskId;
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

function addTaskToTable(taskObject) {
    console.log(taskTable);    
    let newRow = `<tr>
                    <th scope="row">${taskObject.id}</th>
                    <td>${taskObject.task}</td>
                    <td>${taskObject.asignee}</td>
                    <td>${taskObject.status}</td>
                    <td>${taskObject.creationDate} </td>
                    <td>80/06/2019</td>
                </tr>`;
    const tr = document.createElement('tr');
    tr.innerHTML = newRow;
    taskTable.appendChild(tr);
}


