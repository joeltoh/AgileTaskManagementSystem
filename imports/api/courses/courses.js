import { Mongo } from 'meteor/mongo'

export const Courses = new Mongo.Collection('courses')

Courses.publicFields = {
  name: 1,
  coordinators: 1
}
