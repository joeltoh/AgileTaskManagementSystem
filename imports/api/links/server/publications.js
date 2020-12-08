/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import {Links} from '../links'

Meteor.publish('links', () => {
  // return Links.find({}, {fields: Links.publicFields})
  return Links.find({})
})

Meteor.methods({})