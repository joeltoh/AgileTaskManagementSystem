/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import { Tasks } from '../tasks'
import { Teams } from '../../teams/teams'

Meteor.publish('tasks', () => {
  const teamId = Teams.findOne({
    members: {
      $elemMatch: {
        $eq: Meteor.userId()
      }
    }
  })._id
  console.log(teamId)
  console.log(Tasks.find({ team: teamId }, { fields: Tasks.publicFields }).fetch())
  return Tasks.find({ team: teamId }, { fields: Tasks.publicFields })
})

Meteor.methods({})