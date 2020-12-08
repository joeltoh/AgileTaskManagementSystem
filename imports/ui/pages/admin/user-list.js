import { Template } from 'meteor/templating'
import { Tasks } from '../../../api/tasks/tasks'

import './user-list.html'
import '../../components/table/entry'
import '../../components/table/header'

Template.userList.onCreated(() => {
  Meteor.subscribe('tasks')
  Meteor.subscribe('users')
})

Template.userList.helpers({
  displayUsers() {
    let ListOfUsers = Meteor.users.find({});
    return ListOfUsers;
  }
})
