/**
 * Author: Vince Dang
 * Indicates which collections & methods are published to the client
 */

import {Courses} from '../courses'
import {UserHelper} from '../../users/helper'

Meteor.publish('courses', () => {
  return Courses.find({}, {fields: Courses.publicFields})
})

Meteor.methods({
  'courses.addCoordinator'(courseId, userId) {
    const query = {
      _id: courseId
    }
    const update = {
      $push: {
        coordinators: userId
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Courses.update(query, update)
    console.log('Added coordinator with email: ' + email + ' to course ' + Courses.findOne(courseId).name)
  },
  'courses.removeCoordinator'(userId) {
    const query = {
      coordinators: {
        $elemMatch: {
          $eq: userId
        }
      }
    }
    const update = {
      $pull: {
        coordinators: userId
      }
    }
    const email = UserHelper.getUserEmail(userId)
    Courses.update(query, update, (err, record) => {
      if (err) {
        throw new Meteor.Error(err)
      } else {
        console.log(record ? 'Removed coordinator with email: ' + email : 'No course has the coordinator with email: ' + email)
      }
    })
  },
})
