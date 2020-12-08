import { Template } from 'meteor/templating'

import './todo'
import './notification'
import './user'
import './course'
import './nav-menu.html'

Template.navMenu.helpers({
  isAdmin() {
    return !Session.get('is-admin')
  }
})