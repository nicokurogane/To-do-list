class Task {
    constructor(id, name, asignee, status, creationDate = new Date()) {
      this.id = id;
      this.name = name;
      this.asignee = asignee;
      this.status = status;
      this.creationDate = creationDate;
    }
  }
  