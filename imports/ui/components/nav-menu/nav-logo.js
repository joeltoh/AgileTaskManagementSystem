import {Template} from 'meteor/templating'

import './nav-logo.html'

Template
  .navLogo
  .events({
    'click #page-logo-text' (e) {
      e.preventDefault()
      FlowRouter.go('user.home')
    }
  })