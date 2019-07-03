class UI {
  constructor() {
    this.taskListTable = document.getElementById("task-table");
    this.formTaskId = document.getElementById("id");
    this.sortByDateButton = document.getElementById("sort-date");
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

    this.setFormCheckBoxesBehavoir(
      document.querySelectorAll("input[name=status]")
    );
    this.setFormCheckBoxesBehavoir(
      document.querySelectorAll("input[name=edit-status]")
    );
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
            <button type="button" class="btn btn-success" onclick="setTaskToEdit(${
              taskToAdd.id
            })"> Edit </button>
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

  changeSortByDateText(isOrderFromOldestToNewest) {
    if (!isOrderFromOldestToNewest) {
      this.sortByDateButton.value = "Sort by Date (Oldest First)";
    } else {
      this.sortByDateButton.value = "Sort by Date (Newest First)";
    }
  }

  showTaskDataOnEditForm(taskToEdit) {
    document.getElementById("edit-id").value = taskToEdit.id;
    document.getElementById("edit-task").value = taskToEdit.name;
    document.getElementById("edit-asignee").value = taskToEdit.asignee;
    document.getElementById("edit-creation-date").value =
      taskToEdit.creationDate;
    //seteamos el elemento que esta elejido
    let editStatusCheckBox = document.querySelectorAll(
      'input[name="edit-status"]'
    );
    editStatusCheckBox.forEach(element => (element.checked = false));
    editStatusCheckBox.forEach(element => {
      if (element.value === taskToEdit.status) {
        element.checked = true;
        return;
      }
    });
  }

  getEditedTask() {
    let id = document.getElementById("edit-id").value;
    let name = document.getElementById("edit-task").value;
    let asignee = document.getElementById("edit-asignee").value;
    let status = document.querySelector('input[name="edit-status"]:checked').value;
    let creationDate = document.getElementById("edit-creation-date").value;
    return new Task(id, name, asignee, status, new Date(creationDate));
  }

  /* receives an array of checkboxes and set each of of them
     to have a radio-button like behavoir.
  */
  setFormCheckBoxesBehavoir(checkboxes) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", e => {
        if (e.target.checked === true) {
          checkboxes.forEach(c => (c.checked = false));
          e.target.checked = true;
        }
      });
    });
  }
}
