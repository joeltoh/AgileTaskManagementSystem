/**
 * Author: Vince Dang
 * Implement logic for routing and rendering the application.
 */

import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'

import '../../ui/layouts/master'
import '../../ui/layouts/login'
import '../../ui/layouts/register'
import '../../ui/pages/user/dashboard'
import '../../ui/pages/user/personal-task'
import '../../ui/pages/user/team-task'
import '../../ui/pages/user/task-details'
import '../../ui/pages/user/user-profile'
import '../../ui/pages/admin/user-list'
import '../../ui/pages/admin/course-list'
import '../../ui/pages/admin/group-list'
import '../../ui/pages/admin/team-list'
import '../../ui/pages/admin/edit-user'

const redirectIfLoggedIn = (ctx, redirect) => {
  if (Meteor.user() || Meteor.loggingIn()) {
    if (Session.get('is-admin')) {
      redirect('admin.home')
    } else {
      redirect('user.home')
    }
  }
}

const redirectIfNotLoggedIn = (ctx, redirect) => {
  if (!Meteor.user() && !Meteor.loggingIn()) {
    redirect('public.login')
  }
}

const redirectIfNotAdmin = (ctx, redirect) => {
  if (!Meteor.user() && !Meteor.loggingIn()) {
    console.log("admin: not user")
    redirect('public.login')
  } else if (!Session.get('is-admin')) {
    console.log("admin: not admin")
    redirect('user.home')
  }
  console.log("admin: is admin")
}

const redirectIfNotUser = (ctx, redirect) => {
  console.log(Meteor.user())
  if (!Meteor.user() && !Meteor.loggingIn()) {
    console.log("user: not user")
    redirect('public.login')
  } else if (Session.get('is-admin')) {
    console.log("user: to admin")
    redirect('admin.home')
  }
  console.log("user: is user")
}

FlowRouter.notFound = {
  action: () => {
    FlowRouter.go('public.login')
  }
}

FlowRouter.route('/profile', {
  name: 'user.profile',
  action() {
    BlazeLayout.render('master', { content: 'userProfile' })
  },
  triggersEnter: [redirectIfNotLoggedIn]
})

const publicRoutes = FlowRouter.group({ prefix: '/public', name: 'public' })

publicRoutes.route('/login', {
  name: 'public.login',
  action() {
    BlazeLayout.render('login')
  },
  triggersEnter: [redirectIfLoggedIn]
})

publicRoutes.route('/register', {
  name: 'public.register',
  action() {
    BlazeLayout.render('register')
  }
})

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [redirectIfNotAdmin]
})

adminRoutes.route('/home', {
  name: 'admin.home',
  action() {
    FlowRouter.go('admin.user')
  }
})

adminRoutes.route('/user', {
  name: 'admin.user',
  action() {
    BlazeLayout.render('master', { content: 'userList' })
  }
})

adminRoutes.route('/course', {
  name: 'admin.course',
  action() {
    BlazeLayout.render('master', { content: 'courseList' })
  }
})

adminRoutes.route('/group', {
  name: 'admin.group',
  action() {
    BlazeLayout.render('master', { content: 'groupList' })
  }
})

adminRoutes.route('/team', {
  name: 'admin.team',
  action() {
    BlazeLayout.render('master', { content: 'teamList' })
  }
})

adminRoutes.route('/edituser', {
  name: 'admin.edituser',
  action() {
    BlazeLayout.render('master', { content: 'edituserList' })
  }
})

const userRoutes = FlowRouter.group({
  prefix: '/user',
  name: 'user',
  triggersEnter: [redirectIfNotUser]
})

userRoutes.route('/home', {
  name: 'user.home',
  action() {
    FlowRouter.go('user.dashboard')
  }
})

userRoutes.route('/dashboard', {
  name: 'user.dashboard',
  action() {
    BlazeLayout.render('master', { content: 'dashboard' })
  }
})

userRoutes.route('/your-task', {
  name: 'user.self',
  action() {
    BlazeLayout.render('master', { content: 'personalTask' })
  }
})

userRoutes.route('/team-task', {
  name: 'user.team',
  action() {
    BlazeLayout.render('master', { content: 'teamTask' })
  }
})
