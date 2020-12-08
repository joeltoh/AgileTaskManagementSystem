import { check } from 'meteor/check'
import { UserHelper } from '../helper'

Meteor.publish('users', function () {
  const selector = {}
  const options = {
    fields: {
      emails: 1,
      name: 1,
      roles: 1,
      profile: 1
    }
  }
  return Meteor.users.find(selector, options)
})

Meteor.methods({
  'users.create'(email, password, profile) {
    Accounts.createUser({
      email,
      password,
      profile
    })
    console.log('Created user with email: ' + email)
  },
  'users.delete'(userId) {
    const query = {
      _id: userId
    }
    const email = UserHelper.getUserEmail(userId)
    Meteor.call('courses.removeCoordinator', userId)
    Meteor.call('teams.removeMember', userId)
    Meteor.users.remove(query)
    console.log('Removed user with email: ' + email)
  },
  'users.markConfirmed'(userId) {
    const query = {
      _id: userId
    }
    const update = {
      $set: {
        'profile.confirmed': true
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Meteor.users.update(query, update)
    console.log('Verified user with email: ' + email)
  },
  'users.updatePersonalInfo'(userId, name, phone) {
    check(name, String)
    check(phone, String)
    phone = '+65' + phone
    const query = {
      _id: userId
    }
    const email = UserHelper.getUserEmail(userId)
    let update = {
      $set: {
        'profile.name': name,
      }
    }
    if (name) {
      Meteor.users.update(query, update)
    }
    console.log('Updated user with email: ' + email + ', set name=' + name)
    update = {
      $set: {
        'profile.phone': phone
      }
    }
    if (phone) {
      Meteor.users.update(query, update)
    }
    console.log('Updated user with email: ' + email + ', set phone=' + phone)
  },
  'users.updateNotificationPreference'(userId, pref) {
    check(pref, String)
    const query = {
      _id: userId
    }
    const update = {
      $set: {
        'profile.notificationPreference': pref
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Meteor.users.update(query, update)
    console.log('Updated user with email: ' + email + ', set pref=' + pref)
  },
})
