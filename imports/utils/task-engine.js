import { Tasks } from '../api/tasks/tasks'

export const TaskEngine = {
  columns: [{
    icon: 'tag',
    text: 'No'
  }, {
    icon: 'action-redo',
    field: 'text',
    text: 'Task'
  }, {
    icon: 'user',
    field: 'assignee',
    text: 'Assignee'
  }, {
    icon: 'hourglass',
    field: 'start_date',
    text: 'Start Date'
  }, {
    icon: 'hourglass',
    field: 'end_date',
    text: 'End Date'
  }, {
    icon: 'clock',
    field: 'duration',
    text: 'Duration'
  }, {
    icon: 'check',
    field: 'progress',
    text: 'Status'
  }],
  config: [{
    title: "In Progress",
    status: "red",
    icon: "puzzle",
    query: {
      progress: {
        $lt: 1
      }
    }
  }, {
    title: "Pending Review",
    status: "yellow-saffron",
    icon: "note",
    query: {
      progress: 1
    }
  }, {
    title: "Reviewed",
    status: "green-sharp",
    icon: "like",
    query: {
      progress: 2
    }
  }],
  taskRecords: (progress, isPersonal, opts) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    counter = 1;
    const query = {}
    if (isPersonal) {
      query.assignee = Meteor.userId()
    }
    if (typeof progress !== 'undefined') {
      query.progress = TaskEngine.config[progress].query.progress
    }
    const taskRecords = Tasks.find(query, opts).map((item) => {

      const progressInt = parseInt(item.progress)
      const progressCat = progressInt < 1 ? 0 : progressInt
      const task_progress = TaskEngine.config[progressCat].title
      const user = Meteor.users.findOne(item.assignee)
      const name = user.name ? user.name : user.emails[0].address
      return {
        task_text: item.text,
        task_priority: name,
        task_start_date: item.start_date.getDate() + ' ' + monthNames[item.start_date.getMonth()] + ' ' + item.start_date.getFullYear(),
        task_end_date: item.end_date.getDate() + ' ' + monthNames[item.end_date.getMonth()] + ' ' + item.end_date.getFullYear(),
        task_duration: item.duration,
        task_progress: task_progress,
        counter: counter++
      }
    })
    return taskRecords
  },
  tableName: (progress) => {
    let tableName
    if (typeof progress === 'undefined') {
      tableName = 'List of Tasks'
    } else {
      switch (progress) {
        case 0:
          tableName = 'Task In Progress'
          break
        case 1:
          tableName = 'Task Pending Review'
          break
        case 2:
          tableName = 'Reviewed Task'
          break
      }
    }
    return tableName
  },
}