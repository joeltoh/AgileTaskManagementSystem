import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { InputValidator } from '../../../utils/input-validator'

import './user-profile.html'

Template.userProfile.onCreated(function () {
  this.state = new ReactiveDict()
})

Template.userProfile.helpers({
  isChecked(value) {
    return value === Meteor.user().profile.notificationPreference ? "checked" : ""
  },
  isChosen(value) {
    return value === Meteor.user().profile.notificationPreference
  },
  username() {
    return Meteor.user().emails[0].address
  },
  name() {
    return Meteor.user().profile.name
  },
  phone() {
    return Meteor.user().profile.phone
  },
  piMessage() {
    const instance = Template.instance()
    return instance.state.get('pi-message')
  },
  pwMessage() {
    const instance = Template.instance()
    return instance.state.get('pw-message')
  },
  npMessage() {
    const instance = Template.instance()
    return instance.state.get('np-message')
  },
  piSuccess() {
    const instance = Template.instance()
    return instance.state.get('pi-success') ? 'alert-success' : 'alert-danger'
  },
  pwSuccess() {
    const instance = Template.instance()
    return instance.state.get('pw-success') ? 'alert-success' : 'alert-danger'
  },
  npSuccess() {
    const instance = Template.instance()
    return instance.state.get('np-success') ? 'alert-success' : 'alert-danger'
  }
})

Template.userProfile.events({
  'change #phone'(e) {
    e.preventDefault()
    const phone = $('#phone').val()
    let message
    if (!InputValidator.isValidPhone(phone)) {
      message = 'Invalid Phone Number'
    }
    const instance = Template.instance()
    instance.state.set('pi-message', message)
  },
  'click #personal-info-submit, submit #personal-info-form'(e) {
    e.preventDefault()
    const phone = $('#phone').val()
    let message
    let success
    const instance = Template.instance()
    if (phone && !InputValidator.isValidPhone(phone)) {
      message = 'Invalid Phone Number'
    } else {
      const name = $('#name').val()
      console.log(phone + "-" + name)
      message = 'Personal Info Changed Successfully'
      success = true

      Meteor.call('users.updatePersonalInfo', Meteor.userId(), name, phone)
      $('#phone').val('')
      $('#name').val('')
    }
    instance.state.set('pi-message', message)
    instance.state.set('pi-success', success)
  },
  'click #pw-submit, submit #pw-form'(e) {
    e.preventDefault()
    const pwCurrent = $('#pw-current').val()
    if (!pwCurrent) {
      return
    }
    const pwNew = $('#pw-new').val()
    const pwVerify = $('#pw-verify').val()
    let message = 'New Password Does Not Match'
    let success
    const instance = Template.instance()
    if (pwNew === pwVerify) {
      Accounts.changePassword(pwCurrent, pwNew, (e) => {
        if (e) {
          message = e.reason
        } else {
          Meteor.call('users.markConfirmed', Meteor.userId())
          message = "Change password successful"
          success = true
        }
        instance.state.set('pw-message', message)
        instance.state.set('pw-success', success)
      })
      $('#pw-current').val('')
      $('#pw-new').val('')
      $('#pw-verify').val('')
    }
    instance.state.set('pw-message', message)
    instance.state.set('pw-success', success)
  },
  'click #np-submit, submit #np-form'(e) {
    e.preventDefault()
    const pref = $('input[name="notification-preference"]:checked').val()
    console.log(pref)

    const instance = Template.instance()
    let message
    let success
    if (pref === 'sms' && !Meteor.user().profile.phone) {
      message = 'Please add your phone number before you changed to SMS.'
      success = false
    } else {
      Meteor.call('users.updateNotificationPreference', Meteor.userId(), pref)
      message = 'Preference updated.'
      success = true
    }
    instance.state.set('np-message', message)
    instance.state.set('np-success', success)
  }
})
