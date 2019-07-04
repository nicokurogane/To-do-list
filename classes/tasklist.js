class TaskList {
    constructor(storageHandler = new Storage()) {
      this.tasks = [];
      this.storageHandler = storageHandler;
      this.filtersToApply = {
        task: "",
        status: "",
        oldestToNewest: true
      };
    }

    getTaskList(){
      return this.storageHandler.getTasksFromLocalStorage();
    }
  
    createNewTask(newTask) {
      this.tasks.push(newTask);
    }
  
    deleteTask(idTaskToDelete) {
      this.tasks = this.tasks.filter(task => task.id != idTaskToDelete);
    }
  
    getTaskById(taskIdToFind) {
      return this.tasks.find(task => task.id == taskIdToFind);
    }
  
    putEditedTask(editedTaskToEnter) {
      let taskToReplace = this.getTaskById(editedTaskToEnter.id);
      let index = this.tasks.indexOf(taskToReplace);
  
      if (index !== -1) {
        this.tasks[index] = editedTaskToEnter;
      }
    }
  
    searchTasksByName() {
      if (this.filtersToApply.task !== "")
        this.tasks = this.tasks.filter(currentTask =>
          currentTask.name.includes(this.filtersToApply.task)
        );
    }
  
    filterTasksByStatus() {
      if (this.filtersToApply.status !== "")
        this.tasks = this.tasks.filter(currentTask =>
          currentTask.status.includes(this.filtersToApply.status)
        );
    }
  
    sortTasksByDate() {
      this.tasks.sort((taskA, taskB) => {
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