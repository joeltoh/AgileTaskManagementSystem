import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Random } from 'meteor/random'
import { Courses } from '../../../api/courses/courses'
import { Groups } from '../../../api/groups/groups'
import { Teams } from '../../../api/teams/teams'

import { InputValidator } from '../../../utils/input-validator'

import './edit-user.html'

Template.edituserList.onCreated(function () {
  this.state = new ReactiveDict()
  Meteor.subscribe('courses')
  Meteor.subscribe('groups')
  Meteor.subscribe('teams.all')
})

const Registrar = {
  admin: (email, role) => {
    console.log("Calling maingun to add admin")
    Meteor.call('mailgun.sendRegisterEmail', email, role)
  },
  coordinator: (email, role, courseId) => {
    console.log("Calling maingun to add coordinator")
    Meteor.call('mailgun.sendRegisterEmail', email, role, courseId)
  },
  student: (email, role, teamId) => {
    console.log("Calling maingun to add student")
    Meteor.call('mailgun.sendRegisterEmail', email, role, teamId)
  },
}

Template.edituserList.helpers({
  isAdmin() {
    const instance = Template.instance()
    console.log("Is it admin?")
    console.log(instance.state.get('role') === "admin")
    return instance.state.get('role') === "admin"
  },
  isCoordinator() {
    const instance = Template.instance()
    console.log("Is it coordinator?")
    console.log(instance.state.get('role') === "coordinator")
    return instance.state.get('role') === "coordinator"
  },
  isTeamLeaderMember() {
    const instance = Template.instance()
    console.log("Is it teamLeader or teamMember?")
    console.log(instance.state.get('role') === "teamLeader" || instance.state.get('role') === "teamMember")
    return (instance.state.get('role') === "teamLeader" || instance.state.get('role') === "teamMember")
  },
  emailError() {
    const instance = Template.instance()
    console.log(instance.state.get('email-error'))
    return instance.state.get('email-error')
  },
  userCreated() {
    const instance = Template.instance()
    console.log("Inside userCreated")
    return instance.state.get('create-success')
  },
  userCreatedModal() {
    swal("Done!", "User has been created!", "success");
  },
  displayCourses() {
    return Courses.find({}).map(function(course) {
      course_value = course.name ? course.name : '';
      return {
        course_name: course.name,
        course_value: course_value
      }
    });
  },
  displayGroups() {
    const instance = Template.instance()
    courseId = instance.state.get('courseId')
    console.log("Displaying Groups of Course Id " + courseId)
    return Groups.find({'course':courseId}).map(function(group) {
      group_value = group.name ? group.name : '';
      return {
        group_name: group.name,
        group_value: group_value
      }
    });
  },
  displayTeams() {
    const instance = Template.instance()
    groupId = instance.state.get('groupId')
    console.log("Displaying Teams of Group Id " + groupId)
    return Teams.find({'group':groupId}).map(function(team) {
      team_value = team.number ? team.number : '';
      return {
        team_name: team.number,
        team_value: team_value
      }
    });
  }
})

Template.edituserList.events({
  'change #email'(e) {
    e.preventDefault()
    console.log("calling change email")
    const email = $('#email').val()
    let message
    if (!InputValidator.isValidEmail(email)) {
      message = 'Invalid Email'
    }
    const instance = Template.instance()
    instance.state.set('email-error', message)
  },
  'change #role'(e) {
    e.preventDefault()
    const role = $('#role').val()
    console.log("The user role is " + role)
    const instance = Template.instance()
    instance.state.set('role', role)
    console.log("The user role in 'role' reactiveDict is " + instance.state.get('role', role))
  },
  'change .courses'(e) {
    e.preventDefault()
    const courses = $('.courses').val()
    console.log("The selected course is now " + courses)
    const queryCourseSelected = {
      'name': courses
    }
    let courseOfUser = Courses.find(queryCourseSelected).fetch()
    const courseId = courseOfUser[0]._id
    console.log("courseId is " + courseId)
    const instance = Template.instance()
    instance.state.set('courseId', courseId)
  },
  'change #group'(e) {
    e.preventDefault()
    const group = $('#group').val()
    console.log("The selected group is now " + group)
    const queryGroupSelected = {
      'name': group
    }
    let groupOfUser = Groups.find(queryGroupSelected).fetch()
    const groupId = groupOfUser[0]._id
    console.log("groupId is " + groupId)
    const instance = Template.instance()
    instance.state.set('groupId', groupId)
  },
  'click #cu-submit, submit #cu-form'(e) {
    e.preventDefault()
    console.log("hello world!")
    const name = $('#name').val()
    const email = $('#email').val()
    const role = $('#role').val()
    const courses = $('.courses').val()
    const group = $('#group').val()
    const team = $('#team').val()
    console.log("Name submitted " + name)
    console.log("Email submitted " + email)
    console.log("Role submitted " + role)
    console.log("Courses submitted " + courses)
    console.log("Group submitted " + group)
    console.log("Team submitted " + team)

    const queryCoordinator = {
      'name': courses
    }

    const queryStudent = {
      'number': Number(team)
    }
    switch (role) {
      case 'admin':
        console.log("admin case")
        Registrar.admin(email, role)
        break
      case 'coordinator':
        console.log("coordinator case")
        let courseOfUser = Courses.find(queryCoordinator).fetch()
        const courseId = courseOfUser[0]._id
        console.log("courseId is " + courseId)
        Registrar.coordinator(email, role, courseId)
        break
      case 'teamLeader':
      case 'teamMember':
        console.log("teamLeader or teamMember case")
        let teamOfUser = Teams.find(queryStudent).fetch()
        const teamId = teamOfUser[0]._id
        Registrar.student(email, role, teamId)
        break
      default:
        break
    }
    const instance = Template.instance()
    success = true
    instance.state.set('create-success', success)
  }
})
