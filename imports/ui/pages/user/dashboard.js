import { Template } from 'meteor/templating'
import { Tasks } from '../../../api/tasks/tasks'
import { TaskEngine } from '../../../utils/task-engine'

import './dashboard.html'
import '../../components/dashboard/stat-card'
import '../../components/table/task-table'
import '../../stylesheets/dashboard.css'

Meteor.startup(() => {
  Meteor.subscribe('tasks', () => {
    console.log(Tasks.find().fetch())
  })
})

Template.dashboard.helpers({
  dashboardStat() {
    const totalTask = Tasks.find().count()
    const config = TaskEngine.config
    return config.map((card) => {
      const count = Tasks.find(card.query).count()
      const progress = parseFloat(count * 100 / totalTask).toFixed(1)
      card.count = count
      card.total = totalTask
      card.progress = progress
      return card
    })
  },
})