import { Template } from 'meteor/templating'
import { Teams, MyCourses, MyGroups } from '../../../../api/teams/teams'

import './course-nav.html'

Template.courseNav.onCreated(() => {
  Meteor.subscribe('teams')
})

Template.courseNav.helpers({
  teamInfos() {
    const teams = Teams.find().fetch()
    const courses = MyCourses.find().fetch()

    return teams.map((team, index) => {
      const course = courses[index]
      return {
        teamId: team._id,
        courseCode: course.name
      }
    })
  },

})