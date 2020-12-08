import { Random } from 'meteor/random'
import { check } from 'meteor/check'
import { Permissions } from '../permissions/permissions'
import { MailgunCredentials } from './mailgun-credentials'

const post_url = MailgunCredentials.url + MailgunCredentials.domain + '/messages'

const Registrar = {
  student: (userId, teamId) => {
    Meteor.call('teams.addMember', teamId, userId)
  },
  coordinator: (userId, courseId) => {
    Meteor.call('courses.addCoordinator', courseId, userId)
  },
}

Meteor.methods({
  'mailgun.sendRegisterEmail'(email, role, groupId) {
    // validate email
    if (!role in Permissions) {
      throw new Meteor.Error('Role "' + role + '" not exists')
    }
    const password = Random.id()
    console.log(email)
    console.log(password)
    const opts = {
      auth: MailgunCredentials.api,
      params: {
        from: MailgunCredentials.from,
        to: email,
        subject: 'Welcome to Agile Management System (SCSE)',
        html: 'Hello ' + email + ',<br />Your have been allocated an account on AMS (SCSE). Your password is ' + password + '.<br />Please change it within the next 7 days, otherwise your account will be deactivated.'
      }
    }
    Meteor.http.post(post_url, opts, function (err) {
      if (err) {
        console.log(err.reason)
        throw new Meteor.Error(err)
      } else {
        console.log('Email sent to ' + email)
      }
    })
    const profile = {
      notificationPreference: 'email',
      confirmed: false
    }
    Meteor.call('users.create', email, password, profile, (e) => {
      if (e) {
        throw new Meteor.Error(err)
      } else {
        const userId = Meteor.users.findOne({
          'emails.0.address': email
        })._id
        const group = groupId ? groupId : Roles.GLOBAL_GROUP
        Roles.addUsersToRoles(userId, Permissions[role], group)
        switch (role) {
          case 'coordinator':
            Registrar.coordinator(userId, groupId)
            break
          case 'teamLeader':
          case 'teamMember':
            Registrar.student(userId, groupId)
            break
          default:
            break
        }
      }
    })
  },
})


