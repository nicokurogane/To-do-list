const arrayTask = [];
const form = document.getElementById("task-form")

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
            // console.log('-------------');
            // console.log('id:' + element.id);
            // console.log('name:' + element.name);
            // console.log('type:' + element.type);

            if (element.type !== 'checkbox' || (element.type === 'checkbox' && element.checked))
                taskObject[element.name] = element.value;

        }
    });
    // console.log(taskObject);
    arrayTask.push(taskObject);
    // console.log(arrayTask);
}


