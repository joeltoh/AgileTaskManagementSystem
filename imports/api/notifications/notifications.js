/**
 * Author: Vince Dang
 * Defines Notifications collection
 */

import {Mongo} from 'meteor/mongo'

export const Notifications = new Mongo.Collection('notifications')

Notifications.publicFields = {
  time: 1,
  title: 1,
  category: 1
}