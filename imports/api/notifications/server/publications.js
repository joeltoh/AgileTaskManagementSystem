/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import {Meteor} from 'meteor/meteor'
import {Notifications} from '../notifications'

Meteor.startup(() => {
  if (typeof Notifications.findOne() === 'undefined') {
    const notifications = [
      {
        time: "just now",
        title: "New user registered.",
        category: {
          label: "success",
          icon: "plus"
        }
      }, {
        time: "3 mins",
        title: "Server #12 overloaded.",
        category: {
          label: "danger",
          icon: "bolt"
        }
      }, {
        time: "10 mins",
        title: "Server #2 not responding.",
        category: {
          label: "warning",
          icon: "bell-o"
        }
      }, {
        time: "14 hrs",
        title: "Application error.",
        category: {
          label: "info",
          icon: "bullhorn"
        }
      }, {
        time: "2 days",
        title: "Database overloaded 68%.",
        category: {
          label: "danger",
          icon: "bolt"
        }
      }
    ]
    notifications.forEach((record) => {
      Notifications.insert(record)
    })
  }
})

Meteor.publish('notifications', () => {
  return Notifications.find({}, {fields: Notifications.publicFields})
})

Meteor.methods({})