import { Template } from 'meteor/templating'
import { Tasks } from '../../../../api/tasks/tasks'

import './todo-item'
import './todo-nav.html'

Template.todoNav.onCreated(() => {
  Meteor.subscribe('tasks', () => {
    console.log(Tasks.find().fetch())
  })
})

Template.todoNav.helpers({
  todoCount() {
    const query = {
      assignee: Meteor.userId()
    }
    return Tasks.find(query).count()
  },
  todos() {
    const query = {
      assignee: Meteor.userId()
    }
    return Tasks.find(query)
  }
})