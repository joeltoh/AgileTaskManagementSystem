import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { InputValidator } from '../../utils/input-validator'

import "../../assets/global/css/components.min.css"
import "../../assets/global/css/plugins.min.css"
import "../../assets/layouts/layout/css/layout.min.css"
import "../../assets/layouts/layout/css/themes/darkblue.min.css"
import "../../assets/layouts/layout/css/custom.min.css"
import "../../assets/pages/css/login.min.css"

import './login.html'

Template.login.onCreated(function () {
  this.state = new ReactiveDict()
})

Template.login.helpers({
  error() {
    const instance = Template.instance()
    return instance.state.get('error-message')
  }
})

Template.login.events({
  'change #username'(e) {
    const email = $('#username').val()
    let message
    if (!InputValidator.isValidEmail(email)) {
      message = 'Invalid Email'
    }
    console.log(message)
    const instance = Template.instance()
    instance.state.set('error-message', message)
  },
  'click #login'(e) {
    e.preventDefault()
    const email = $('#username').val()
    if (!InputValidator.isValidEmail(email)) {
      return
    }
    const password = $('#password').val()
    console.log(email + '-' + password)
    const instance = Template.instance()
    Meteor.loginWithPassword(email, password, (e) => {
      if (e) {
        instance.state.set('error-message', e.reason)
        console.log(e.reason)
      } else {
        Session.setPersistent('is-admin', Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP))
        FlowRouter.go('user.home')
      }
    })
  }
})
