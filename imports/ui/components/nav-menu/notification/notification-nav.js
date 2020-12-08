import {Template} from 'meteor/templating'
import {Notifications} from './../../../../api/notifications/notifications'

import './notification-item'
import './notification-nav.html'

Template
  .notificationNav
  .onCreated(() => {
    Meteor.subscribe('notifications')
  })

Template
  .notificationNav
  .helpers({
    notificationCount() {
      return Notifications
        .find()
        .count()
    },
    notifications() {
      return Notifications.find()
    }
  })