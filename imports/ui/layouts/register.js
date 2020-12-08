import {Template} from 'meteor/templating'
import {ReactiveDict} from 'meteor/reactive-dict'

import {InputValidator} from '../../utils/input-validator'
import './register.html'

Template
  .register
  .onCreated(function () {
    this.state = new ReactiveDict()
    console.log(this)
  })

Template
  .register
  .helpers({
    error() {
      const instance = Template.instance()
      return instance
        .state
        .get('error-message')
    }
  })

Template
  .register
  .events({
    'change #username' (e) {
      const email = $('#username').val()
      let message
      if (!InputValidator.isValidEmail(email)) {
        message = 'Invalid Email'
      }
      console.log(message)
      const instance = Template.instance()
      instance
        .state
        .set('error-message', message)
    },
    'click #register' (e, instance) {
      e.preventDefault()
      const email = $('#username').val()
      if (!InputValidator.isValidEmail(email)) {
        return
      }
      const password = $('#password').val()
      const password2 = $('#password2').val()
      console.log(email + '-' + password + '-' + password2)
      if (password === password2) {
        const profile = {
          notificationPreference: 'email'
        }
        Meteor.call('users.create', email, password, profile)
        console.log("Succesfully created user")
        $('#username').val('')
        $('#password').val('')
        $('#password2').val('')
      } else {
        instance
          .state
          .set('error-message', 'Unmatched password')
      }
    },
    'click #login-btn' (e) {
      e.preventDefault()
      FlowRouter.go('public.login')
    }
  })
