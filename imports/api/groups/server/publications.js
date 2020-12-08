/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import {Groups} from '../groups'

Meteor.publish('groups', () => {
  return Groups.find({}, {fields: Groups.publicFields})
})

Meteor.methods({})
