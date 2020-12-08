import { Mongo } from 'meteor/mongo'

export const Groups = new Mongo.Collection('groups')

Groups.publicFields = {
  name: 1,
  course: 1,
  labDate: 1
}
