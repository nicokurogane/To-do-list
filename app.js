const arrayTask = [];
const form = document.getElementById("task-form")

form.addEventListener('submit', handleSubmit);


//interceptamos el el submit para extraer la data
function handleSubmit(e) {
    e.preventDefault();
    validateForm();
    getFormData();
}


function validateForm(){
    
}

const getFormData = () => {
    let arrayToTest = form.elements;
    let formChildren = Array.from(arrayToTest);
    var taskObject = {};

    formChildren.forEach(element => {
        if (element.type !== 'submit') {            

            console.log('----------------');
            console.log('tipo:' + element.type);
            console.log('id:' + element.id);
            console.log('name:' + element.name);
            console.log('value:' + element.value);
            taskObject[element.name] = element.value;
        }
    });

    console.log(taskObject);
}


