/**
 * Author: Vince Dang
 * Defines Tasks collection
 */

import { Mongo } from 'meteor/mongo'

export const Tasks = new Mongo.Collection('tasks')

Tasks.publicFields = {
  text: 1,
  start_date: 1,
  end_date: 1,
  parent: 1,
  id: 1,
  duration: 1,
  team: 1,
  assignee: 1,
  progress: 1
}