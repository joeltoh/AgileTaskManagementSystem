/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import { publishComposite } from 'meteor/reywood:publish-composite'
import { Teams } from '../teams'
import { Groups } from '../../groups/groups'
import { Courses } from '../../courses/courses'
import { UserHelper } from '../../users/helper'

Meteor.publish('teams.all', () => {
  return Teams.find({}, {fields: Teams.publicFields})
})

Meteor.publishComposite('teams', {
  find() {
    const query = {
      members: {
        $elemMatch: {
          $eq: Meteor.userId()
        }
      }
    }
    const projection = {
      fields: Teams.publicFields
    }
    return Teams.find(query, projection)
  },
  children: [{
    collectionName: 'myGroups',
    find(team) {
      const query = {
        _id: team.group
      }
      const projection = {
        fields: Groups.publicFields
      }
      return Groups.find(query, projection)
    },
    children: [{
      collectionName: 'myCourses',
      find(group) {
        const query = {
          _id: group.course
        }
        const projection = {
          fields: Groups.publicFields
        }
        return Courses.find(query, projection)
      }
    }]
  }]
})

Meteor.methods({
  'teams.addMember'(teamId, userId) {
    const query = {
      _id: teamId
    }
    const update = {
      $push: {
        members: userId
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Teams.update(query, update)
    console.log('Added member with email: ' + email + ' to teamId: ' + teamId)
  },
  'teams.removeMember'(userId) {
    const query = {
      members: {
        $elemMatch: {
          $eq: userId
        }
      }
    }
    const update = {
      $pull: {
        members: userId
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Teams.update(query, update, (err, record) => {
      if (err) {
        throw new Meteor.Error(err)
      } else {
        console.log(record ? 'Removed team member with email: ' + email : 'No team has the member with email: ' + email)
      }
    })
  },
})
