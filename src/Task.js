class Task {
  constructor(content, {
                project_id = null,
                section_id = null,
                parent = null,
                order = 1,
                label_ids = [],
                priority = 1
              }
  ) {
    console.log(typeof label_ids);
    this.content = content;
    this.project_id = project_id;
    this.section_id = section_id;
    this.parent = parent;
    this.order = order;
    this.label_ids = (typeof label_ids == 'string') ? label_ids.split(',').map(val => Number(val)) : [];
    this.priority = priority;
  }

}

module.exports = Task;