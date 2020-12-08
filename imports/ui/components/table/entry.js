import { Template } from 'meteor/templating'
import { Courses } from '../../../api/courses/courses'
import { Permissions } from '../../../api/permissions/permissions'

import './entry.html'
import swal from 'sweetalert';

Template.tableEntry.onCreated(() => {
  Meteor.subscribe('users')
  Meteor.subscribe('courses')
})

Template.tableEntry.helpers({
  displayUsers() {
    const ctxData = Template.instance().data
    const isStudent = ctxData.for === 'student'
    const isCoordinator = ctxData.for === 'coordinator'
    const isAdmin = ctxData.for === 'admin'

    counter = 1;

    let arrayOfCoordinators = []
    Courses.find({}).map(function(course) {
      return course.coordinators.map(function(courseCoordinators) {
        if(!arrayOfCoordinators.includes(courseCoordinators)) {
          arrayOfCoordinators.push(courseCoordinators)
        }
      })
    })

    console.log("arrayOfCoordinators ")
    console.log(arrayOfCoordinators)

    if (isCoordinator) {
      console.log("isCoordinator")
      counter = 1;
      return Meteor.users.find({'_id':{ $in: arrayOfCoordinators}}).map(function(users) {
        user_name = users.name ? users.name : 'Not updated';
        user_phone = users.phone ? users.phone : 'Not updated';
        user_completed = users.profile.confirmed ? 'Completed' : 'Incomplete';
        user_role = 'Coordinator';
        return {
          user_email: users.emails[0].address,
          user_name: user_name,
          user_phone: user_phone,
          user_completed: user_completed,
          user_role: user_role,
          counter: counter++
        }
      });
    }

    // Get user id of Admins
    arrayOfAdmin = Meteor.users.find({}).fetch().filter(function(users) {
      return Roles.userIsInRole(users._id, Permissions.admin, Roles.GLOBAL_GROUP);
    }).map(function(users) {
      return users._id;
    });
    console.log("arrayOfAdmin ")
    console.log(arrayOfAdmin)

    if (isAdmin) {
      console.log("isAdmin")
      return Meteor.users.find({'_id':{ $in: arrayOfAdmin}}).map(function(users) {
        user_name = users.name ? users.name : 'Not updated';
        user_phone = users.phone ? users.phone : 'Not updated';
        user_completed = users.profile.confirmed ? 'Completed' : 'Incomplete';
        user_role = 'Admin';
        return {
          user_email: users.emails[0].address,
          user_name: user_name,
          user_phone: user_phone,
          user_completed: user_completed,
          user_role: user_role,
          counter: counter++
        }
      });
    }

    // Merge coordinators and admins
    let arrayOfCoordinatorsAndAdmins = arrayOfCoordinators.concat(arrayOfAdmin)
    console.log("arrayOfCoordinatorsAndAdmins ")
    console.log(arrayOfCoordinatorsAndAdmins)

    if (isStudent) {
      console.log("isStudent")
      return Meteor.users.find({'_id':{ $nin: arrayOfCoordinatorsAndAdmins}}).map(function(users) {
        user_name = users.name ? users.name : 'Not updated';
        user_phone = users.phone ? users.phone : 'Not updated';
        user_completed = users.profile.confirmed ? 'Completed' : 'Incomplete';
        user_role = 'Student';
        return {
          user_email: users.emails[0].address,
          user_name: user_name,
          user_phone: user_phone,
          user_completed: user_completed,
          user_role: user_role,
          counter: counter++
        }
      });
    }
  }
})

Template.tableEntry.events({
  'click .del': function(event) {
    event.preventDefault()
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        console.log(willDelete)
        let userId = Meteor.users.findOne({'emails.0.address':this.user_email});
        userEmail = this.user_email;
        Meteor.call('users.delete', userId._id)
        swal("Done! " + userEmail + " has been deleted!", {
          icon: "success",
        });
      } else {
        console.log(willDelete)
        swal("User is safe!");
      }
    });
  }
})
