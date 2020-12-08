import { Mongo } from 'meteor/mongo'

export const Teams = new Mongo.Collection('teams')
export const MyGroups = new Mongo.Collection('myGroups')
export const MyCourses = new Mongo.Collection('myCourses')

Teams.publicFields = {
  number: 1,
  members: 1,
  group: 1
}
