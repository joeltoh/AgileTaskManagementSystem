import { Template } from 'meteor/templating'

import { SidebarMenu } from '../../../api/app-components/sidebar-menu'
import { SidebarMenuAdmin } from '../../../api/app-components/sidebar-menu-admin'
import './sidebar-section'
import './sidebar.html'

Template.sidebar.helpers({
  dashboard() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      return SidebarMenuAdmin.dashboard
    } else {
      return SidebarMenu.dashboard
    }
  },
  menus() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      return SidebarMenuAdmin.menus
    } else {
      return SidebarMenu.menus
    }
  }
})