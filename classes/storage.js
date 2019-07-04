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
      else return [];
    }
  }